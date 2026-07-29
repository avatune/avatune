import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type {
  BuilderAsset,
  ContainerMeta,
} from '../apps/studio/src/hooks/use-builder'
import {
  CATEGORIES,
  type CategoryId,
  type PaletteAssignments,
  type PaletteConnections,
  PREDICTORS,
  type PredictorMappings,
  type ThemeColor,
  type ThemePalette,
} from '../apps/studio/src/types'
import { resolvePaletteId } from '../apps/studio/src/utils/palettes'
import {
  createStudioProject,
  parseStudioProject,
} from '../apps/studio/src/utils/studioProject'
import {
  hasThemedStroke,
  readItemSvg,
  readThemedFills,
  readThemePackage,
  resolveThemeDirectory,
} from './theme-package'

const CATEGORY_IDS = new Set<string>(CATEGORIES.map(({ id }) => id))

interface SourceTheme {
  style: { size: number; borderRadius?: string }
  colorPalettes: Record<string, string[]>
  predictorMappings?: Record<string, Record<string, string[]>>
  connectedColors?: Record<string, string>
  [category: string]: unknown
}

interface ThemeItem {
  position:
    | { x: number; y: number }
    | ((size: number) => { x: number; y: number })
  layer: number
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * Renderers scale each part by its intrinsic width/height, so those attributes —
 * not the viewBox — decide how large the asset is on the canvas.
 */
const readDimensions = (svg: string, label: string) => {
  const root = svg.match(/<svg\b[^>]*>/i)?.[0] ?? ''
  const attribute = (name: string) =>
    Number.parseFloat(
      root.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1] ??
        '',
    )

  const width = attribute('width')
  const height = attribute('height')
  if (width > 0 && height > 0) return { width, height }

  const viewBox = root
    .match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)
  if (viewBox?.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
    return { width: viewBox[2], height: viewBox[3] }
  }

  throw new Error(`${label}: SVG has no usable width/height or viewBox`)
}

const round2 = (value: number) => Math.round(value * 100) / 100

// ---------------------------------------------------------------------------
// Palettes
// ---------------------------------------------------------------------------

type ColorEnums = Record<string, Record<string, string>>

const toSlug = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

/**
 * Studio derives a theme's colour enums back from palette names, appending
 * "Colors" unless the name is already a known one — so `ClothingColors` has to
 * round-trip as `Clothing`, while `SkinTones` is kept whole.
 */
const toPaletteName = (enumName: string) =>
  enumName.endsWith('Colors') && enumName.length > 'Colors'.length
    ? enumName.slice(0, -'Colors'.length)
    : enumName

const buildPalettes = (
  theme: SourceTheme,
  colorEnums: ColorEnums,
  connections: PaletteConnections,
) => {
  const enums = Object.entries(colorEnums).filter(([, members]) =>
    Object.values(members ?? {}).every((value) => typeof value === 'string'),
  )

  /**
   * The smallest enum containing every colour of a palette named it in the
   * source — the same hex can sit in two enums, so a global lookup would label
   * a hair colour with the accent name that happens to share its value.
   */
  const findEnum = (colors: string[]) =>
    enums
      .filter(([, members]) =>
        colors.every((color) => Object.values(members).includes(color)),
      )
      .sort(
        ([, left], [, right]) =>
          Object.keys(left).length - Object.keys(right).length,
      )[0]

  const palettes: ThemePalette[] = []
  const paletteByCategory: PaletteAssignments = {}
  const previewColorByPalette: Record<string, string> = {}
  const paletteByColorKey = new Map<string, ThemePalette>()
  const usedIds = new Set<string>()

  for (const [category, colors] of Object.entries(theme.colorPalettes)) {
    if (category !== 'background' && !CATEGORY_IDS.has(category)) continue
    if (connections[category as CategoryId]) continue
    if (!Array.isArray(colors) || colors.length === 0) continue

    const colorKey = colors.join(',')
    const existing = paletteByColorKey.get(colorKey)
    if (existing) {
      paletteByCategory[category as CategoryId] = existing.id
      continue
    }

    // A category whose colours are exactly one enum keeps that enum's name; a
    // subset (e.g. eyes taking a single accent) gets its own category-named one.
    const [enumName, members] = findEnum(colors) ?? []
    const isWholeEnum =
      members !== undefined && Object.keys(members).length === colors.length

    const name = isWholeEnum && enumName ? toPaletteName(enumName) : category
    let id = toSlug(name)
    while (usedIds.has(id)) id = `${id}-${category}`
    usedIds.add(id)

    const memberNames = new Map(
      Object.entries(members ?? {}).map(([member, value]) => [value, member]),
    )
    const usedColorIds = new Set<string>()
    const paletteColors: ThemeColor[] = colors.map((value, index) => {
      const memberName = memberNames.get(value) ?? `Color ${index + 1}`
      let colorId = toSlug(memberName)
      while (usedColorIds.has(colorId)) colorId = `${colorId}-${index + 1}`
      usedColorIds.add(colorId)
      return { id: colorId, name: memberName, value }
    })

    const palette: ThemePalette = { id, name, colors: paletteColors }
    palettes.push(palette)
    paletteByColorKey.set(colorKey, palette)
    paletteByCategory[category as CategoryId] = id
    previewColorByPalette[id] = paletteColors[0].id
  }

  return { palettes, paletteByCategory, previewColorByPalette }
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

const toPredictorMappings = (theme: SourceTheme): PredictorMappings => {
  const mappings: PredictorMappings = {}
  for (const predictor of PREDICTORS) {
    const mapping = theme.predictorMappings?.[predictor]
    if (mapping && Object.keys(mapping).length > 0)
      mappings[predictor] = mapping
  }
  return mappings
}

const convertTheme = async (repoRoot: string, themeName: string) => {
  const themePackage = await readThemePackage(repoRoot, themeName)
  const themeSource = resolve(themePackage.themeDirectory, 'src')

  const builder = (await import(resolve(themeSource, 'shared.ts'))).default
  const theme = builder.build() as SourceTheme
  const colorEnums = (await import(
    resolve(themeSource, 'colors.ts')
  )) as ColorEnums
  const { replacements } = themePackage

  const size = theme.style.size
  const warnings: string[] = []
  const assets: BuilderAsset[] = []
  const optionalCategories: CategoryId[] = []
  let created = 0

  const connections: PaletteConnections = {}
  for (const [dependent, source] of Object.entries(
    theme.connectedColors ?? {},
  )) {
    if (CATEGORY_IDS.has(dependent) && CATEGORY_IDS.has(source)) {
      connections[dependent as CategoryId] = source as CategoryId
    }
  }

  const { palettes, paletteByCategory, previewColorByPalette } = buildPalettes(
    theme,
    colorEnums,
    connections,
  )
  const palettesById = new Map(palettes.map((palette) => [palette.id, palette]))
  const previewColorOf = (category: CategoryId) => {
    const paletteId = resolvePaletteId(
      { paletteByCategory, paletteConnections: connections },
      category,
    )
    const palette = paletteId ? palettesById.get(paletteId) : undefined
    const preview = previewColorByPalette[paletteId ?? '']
    return (
      palette?.colors.find((color) => color.id === preview)?.value ??
      palette?.colors[0]?.value ??
      '#808080'
    )
  }

  for (const category of Object.keys(theme)) {
    if (!CATEGORY_IDS.has(category)) continue

    for (const [identifier, item] of Object.entries(
      theme[category] as Record<string, ThemeItem>,
    )) {
      // `setOptional` adds a placeholder that renders nothing — Studio records
      // that as the category being optional rather than as an asset.
      if (identifier === 'none') {
        optionalCategories.push(category as CategoryId)
        continue
      }

      const label = `${category}.${identifier}`
      const svgPath = themePackage.svgPathByItem.get(label)
      if (!svgPath) {
        warnings.push(`${label}: no SVG binding found in vanilla.ts`)
        continue
      }

      const source = readItemSvg(themePackage, svgPath)
      const { svg, bindings } = readThemedFills(
        source,
        replacements,
        previewColorOf(category as CategoryId),
      )
      const { width, height } = readDimensions(svg, label)
      const position =
        typeof item.position === 'function'
          ? item.position(size)
          : item.position

      if (hasThemedStroke(source, replacements)) {
        warnings.push(`${label}: themed stroke is not representable in Studio`)
      }

      assets.push({
        id: label,
        category: category as CategoryId,
        name: identifier,
        svg,
        url: '',
        created: created++,
        x: round2(((Number(position.x) + width / 2) / size) * 100),
        y: round2(((Number(position.y) + height / 2) / size) * 100),
        scale: round2((width / size) * 100),
        rotation: 0,
        layer: item.layer,
        themeFillBindings: bindings,
      })
    }
  }

  const meta: ContainerMeta = {
    size,
    radius: Number.parseFloat(theme.style.borderRadius ?? '50%') || 50,
    clip: true,
    themeName,
    palettes,
    paletteByCategory,
    paletteConnections: connections,
    predictorMappings: toPredictorMappings(theme),
    optionalCategories,
    previewColorByPalette,
  }

  return { project: createStudioProject(assets, meta), warnings }
}

// ---------------------------------------------------------------------------

const main = async () => {
  const [themeArgument, outputArgument] = Bun.argv.slice(2)
  if (!themeArgument) {
    throw new Error(
      'Usage: bun scripts/theme-to-studio.ts <theme-name> [output.json]',
    )
  }

  const repoRoot = resolve(import.meta.dir, '..')
  const themeName = themeArgument.replace(/-theme$/, '')
  const themeDirectory = resolveThemeDirectory(repoRoot, themeName)
  if (!existsSync(themeDirectory)) {
    throw new Error(`No such theme package: ${themeDirectory}`)
  }

  const { project, warnings } = await convertTheme(repoRoot, themeName)
  const parsed = parseStudioProject(JSON.parse(JSON.stringify(project)))
  if (!parsed.ok)
    throw new Error(`Generated an invalid Studio project: ${parsed.error}`)

  const outputPath = resolve(outputArgument ?? `${themeName}.json`)
  await Bun.write(outputPath, `${JSON.stringify(project, null, 2)}\n`)

  for (const warning of warnings) console.warn(`warning: ${warning}`)
  console.log(
    `Wrote ${outputPath} — ${project.assets.length} assets, ${project.meta.palettes.length} palettes`,
  )
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
