import {
  type CategoryId,
  PREDICTORS,
  type ThemeColorCategory,
  type ThemeData,
} from '../../types'
import { toCamelCase } from '../caseUtils'
import { resolvePaletteId } from '../palettes'
import type { ThemeColorReference } from '../themeColorDefinitions'
import {
  DEFAULT_COLOR_ENUM_NAME,
  DEFAULT_COLOR_MEMBER,
  getThemePaletteDefinitions,
} from '../themeColorDefinitions'

/**
 * Generates the shared.ts theme configuration code
 *
 * Both the studio and theme renderer use the same coordinate system:
 * - Position represents percentage from canvas top-left (0-100%)
 * - Assets are positioned by their top-left corner
 * - Head position defines the reference point for other assets
 * - Other assets use fromHeadOffset with their offset from head position
 */
export function generateThemeFile(themeData: ThemeData): string {
  const headXPercent = themeData.headAsset?.xPercent || 0
  const headYPercent = themeData.headAsset?.yPercent || 0
  const categoryOrder = [
    'accessories',
    'body',
    'ears',
    'eyebrows',
    'eyes',
    'faceHair',
    'faceDetails',
    'forelock',
    'glasses',
    'hair',
    'hats',
    'head',
    'mouth',
    'neck',
    'nose',
  ]
  const assetsByCategory = new Map<string, typeof themeData.assets>()
  if (themeData.headAsset) {
    assetsByCategory.set('head', [themeData.headAsset])
  }
  for (const asset of themeData.assets) {
    const categoryAssets = assetsByCategory.get(asset.category)
    if (categoryAssets) categoryAssets.push(asset)
    else assetsByCategory.set(asset.category, [asset])
  }

  const paletteDefinitions = getThemePaletteDefinitions(themeData.palettes)
  const palettesById = new Map(
    paletteDefinitions.map((definition) => [definition.id, definition]),
  )
  const getCategoryColors = (category: string) => {
    // A connected category lists the colors of the category it follows.
    const paletteId = resolvePaletteId(
      {
        paletteByCategory: themeData.paletteByCategory,
        paletteConnections: themeData.paletteConnections,
      },
      category as ThemeColorCategory,
    )
    const palette = palettesById.get(paletteId ?? '')
    return palette?.members.length
      ? { enumName: palette.enumName, members: palette.members }
      : {
          enumName: DEFAULT_COLOR_ENUM_NAME,
          members: [DEFAULT_COLOR_MEMBER],
        }
  }
  const categoryColors = new Map<string, ThemeColorReference>()
  categoryColors.set('background', getCategoryColors('background'))
  for (const category of categoryOrder) {
    if (assetsByCategory.get(category)?.length) {
      categoryColors.set(category, getCategoryColors(category))
    }
  }

  const importedEnums = [
    ...new Set([...categoryColors.values()].map(({ enumName }) => enumName)),
  ].sort()
  const lines: string[] = []
  lines.push("import { createTheme, fromHead } from '@avatune/theme-builder'")
  lines.push("import type { BaseAvatarItem } from '@avatune/types'")
  lines.push("import { percentage } from '@avatune/utils'")
  lines.push(`import { ${importedEnums.join(', ')} } from './colors'`)
  lines.push('')
  lines.push('const getHeadPosition = (size: number) => ({')
  lines.push(`  x: size * percentage('${headXPercent.toFixed(2)}%'),`)
  lines.push(`  y: size * percentage('${headYPercent.toFixed(2)}%'),`)
  lines.push('})')
  lines.push('')
  lines.push('const fromHeadOffset = fromHead(getHeadPosition)')
  lines.push('')
  lines.push(`export default createTheme<BaseAvatarItem>()`)
  lines.push(`  .withStyle({`)
  lines.push(`    size: ${themeData.size},`)
  lines.push(`    borderRadius: '${themeData.borderRadius}',`)
  lines.push(`  })`)

  // Connections only make sense between categories that made it into the theme.
  const dependentsBySource = new Map<CategoryId, CategoryId[]>()
  for (const [dependent, source] of Object.entries(
    themeData.paletteConnections,
  ) as Array<[CategoryId, CategoryId]>) {
    if (!categoryColors.has(dependent) || !categoryColors.has(source)) continue
    const dependents = dependentsBySource.get(source)
    if (dependents) dependents.push(dependent)
    else dependentsBySource.set(source, [dependent])
  }
  for (const [source, dependents] of dependentsBySource) {
    const list = dependents.map((dependent) => `'${dependent}'`).join(', ')
    lines.push(`  .connectColors('${source}', [${list}])`)
  }

  // Predictor mappings store bare hex; emitting the enum member it came from
  // keeps the generated theme readable and consistent with `.addColors`.
  const colorReferences = new Map<string, string>()
  for (const { enumName, members } of categoryColors.values()) {
    for (const member of members) {
      const key = member.value.toLowerCase()
      if (!colorReferences.has(key)) {
        colorReferences.set(key, `${enumName}.${member.name}`)
      }
    }
  }

  const predictorLines: string[] = []
  for (const predictor of PREDICTORS) {
    const mapping = themeData.predictorMappings[predictor]
    if (!mapping) continue
    for (const [predictorValue, values] of Object.entries(mapping)) {
      const list = values
        .map(
          (value) => colorReferences.get(value.toLowerCase()) ?? `'${value}'`,
        )
        .join(', ')
      predictorLines.push(
        `  .mapPrediction('${predictor}', '${predictorValue}', [${list}])`,
      )
    }
  }
  if (predictorLines.length > 0) {
    lines.push('  // Predictions')
    lines.push(...predictorLines)
  }

  lines.push('  // Colors')

  // A connected category copies its source's color at render time, but only if
  // the source was resolved first — and resolution follows palette order.
  const orderedCategories: string[] = []
  const visited = new Set<string>()
  const visitCategory = (category: string) => {
    if (visited.has(category)) return
    visited.add(category)
    const source = themeData.paletteConnections[category as CategoryId]
    if (source && categoryColors.has(source)) visitCategory(source)
    orderedCategories.push(category)
  }
  for (const category of categoryColors.keys()) visitCategory(category)

  for (const category of orderedCategories) {
    const colors = categoryColors.get(category) as ThemeColorReference
    if (colors.members.length === 1) {
      lines.push(
        `  .addColors('${category}', [${colors.enumName}.${colors.members[0].name}])`,
      )
      continue
    }
    lines.push(`  .addColors('${category}', [`)
    for (const member of colors.members) {
      lines.push(`    ${colors.enumName}.${member.name},`)
    }
    lines.push('  ])')
  }

  for (const category of categoryOrder) {
    const assets = assetsByCategory.get(category)
    if (!assets?.length) continue

    lines.push(`  // ${category.charAt(0).toUpperCase() + category.slice(1)}`)
    for (const asset of assets) {
      const xOffset = asset.xPercent - headXPercent
      const yOffset = asset.yPercent - headYPercent
      const xSign = xOffset >= 0 ? '' : '-'
      const ySign = yOffset >= 0 ? '' : '-'
      const xPercent = Math.abs(xOffset) || 0
      const yPercent = Math.abs(yOffset) || 0
      const assetName = toCamelCase(asset.name)

      lines.push(`  .addItem('${asset.category}', '${assetName}', {`)
      if (xPercent === 0 && yPercent === 0) {
        lines.push(
          `    position: fromHeadOffset(percentage('0%'), percentage('0%')),`,
        )
      } else {
        lines.push(
          `    position: fromHeadOffset(${xSign}percentage('${xPercent.toFixed(2)}%'), ${ySign}percentage('${yPercent.toFixed(2)}%')),`,
        )
      }
      lines.push(`    layer: ${asset.layer},`)
      lines.push(`  })`)
    }

    // Declared after the items so the generated 'none' entry sorts last, the
    // same position a hand-written theme puts it in.
    if (themeData.optionalCategories.includes(category as CategoryId)) {
      lines.push(`  .setOptional('${category}')`)
    }
  }

  return lines.join('\n')
}
