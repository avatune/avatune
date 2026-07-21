import type { ThemeData } from '../../types'
import { toCamelCase } from '../caseUtils'
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
  const getCategoryColors = (
    category: string,
    assets: typeof themeData.assets | undefined,
  ) => {
    const usesThemeColor =
      category === 'background' || assets?.some((asset) => asset.usesThemeColor)
    const paletteId =
      themeData.paletteByCategory[
        category as keyof typeof themeData.paletteByCategory
      ]
    const palette = usesThemeColor
      ? palettesById.get(paletteId ?? '')
      : undefined
    return palette?.members.length
      ? { enumName: palette.enumName, members: palette.members }
      : {
          enumName: DEFAULT_COLOR_ENUM_NAME,
          members: [DEFAULT_COLOR_MEMBER],
        }
  }
  const categoryColors = new Map<string, ThemeColorReference>()
  categoryColors.set('background', getCategoryColors('background', undefined))
  for (const category of categoryOrder) {
    const assets = assetsByCategory.get(category)
    if (assets?.length) {
      categoryColors.set(category, getCategoryColors(category, assets))
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
  lines.push('  // Colors')

  for (const [category, colors] of categoryColors) {
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
  }

  return lines.join('\n')
}
