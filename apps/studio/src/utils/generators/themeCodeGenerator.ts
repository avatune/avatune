import type { ThemeData } from '../../types'
import { toCamelCase } from '../caseUtils'

// Default color mappings for each category
const CATEGORY_COLORS: Record<string, string[]> = {
  head: ['SkinTones.Light', 'SkinTones.Medium', 'SkinTones.Dark'],
  ears: ['SkinTones.Light', 'SkinTones.Medium', 'SkinTones.Dark'],
  hair: ['AccentColors.Black', 'AccentColors.White', 'AccentColors.Canary'],
  faceHair: ['AccentColors.Black', 'AccentColors.White', 'AccentColors.Canary'],
  eyes: ['AccentColors.Black'],
  eyebrows: ['AccentColors.Black'],
  mouth: ['AccentColors.Black'],
  nose: ['AccentColors.Black'],
  glasses: ['AccentColors.Black'],
  body: ['AccentColors.Lavender', 'AccentColors.Sky', 'AccentColors.Salmon'],
  accessories: ['AccentColors.Canary'],
  faceDetails: ['AccentColors.Black'],
  forelock: ['AccentColors.Black', 'AccentColors.White', 'AccentColors.Canary'],
  hats: ['AccentColors.Black', 'AccentColors.White'],
}

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
  // Head position from studio (percentage from top-left, 0-100)
  const headXPercent = themeData.headAsset?.xPercent || 0
  const headYPercent = themeData.headAsset?.yPercent || 0

  // Use head position directly - studio and theme use same coordinate system
  const headX = headXPercent
  const headY = headYPercent

  const lines: string[] = []
  lines.push("import { createTheme, fromHead } from '@avatune/theme-builder'")
  lines.push("import type { BaseAvatarItem } from '@avatune/types'")
  lines.push("import { percentage } from '@avatune/utils'")
  lines.push('import {')
  lines.push('  AccentColors,')
  lines.push('  BackgroundColors,')
  lines.push('  SkinTones,')
  lines.push("} from './colors'")
  lines.push('')
  lines.push('const getHeadPosition = (size: number) => ({')
  lines.push(`  x: size * percentage('${headX.toFixed(2)}%'),`)
  lines.push(`  y: size * percentage('${headY.toFixed(2)}%'),`)
  lines.push('})')
  lines.push('')
  lines.push('const fromHeadOffset = fromHead(getHeadPosition)')
  lines.push('')
  lines.push(`export default createTheme<BaseAvatarItem>()`)
  lines.push(`  .withStyle({`)
  lines.push(`    size: ${themeData.size},`)
  lines.push(`    borderRadius: '${themeData.borderRadius}',`)
  lines.push(`  })`)

  // Group assets by category
  const assetsByCategory = new Map<string, typeof themeData.assets>()
  if (themeData.headAsset) {
    assetsByCategory.set('head', [themeData.headAsset])
  }
  themeData.assets.forEach((asset) => {
    if (!assetsByCategory.has(asset.category)) {
      assetsByCategory.set(asset.category, [])
    }
    const categoryAssets = assetsByCategory.get(asset.category)
    if (categoryAssets) {
      categoryAssets.push(asset)
    }
  })

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

  // Generate addColors calls for each category that has assets
  lines.push('  // Colors')
  for (const category of categoryOrder) {
    const assets = assetsByCategory.get(category)
    if (!assets || assets.length === 0) continue

    const colors = CATEGORY_COLORS[category] || ['AccentColors.Black']
    lines.push(`  .addColors('${category}', [${colors.join(', ')}])`)
  }

  // Generate addItem calls
  for (const category of categoryOrder) {
    const assets = assetsByCategory.get(category)
    if (!assets || assets.length === 0) continue

    lines.push(`  // ${category.charAt(0).toUpperCase() + category.slice(1)}`)
    for (const asset of assets) {
      // Calculate offset from head position
      // In preview, assets are positioned relative to canvas center (0, 0)
      // We need to convert this to offset from head position
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
