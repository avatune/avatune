import type { ThemeData } from '../../types'
import { toKebabCase } from '../caseUtils'

/**
 * Generates the shared.ts theme configuration code
 */
export function generateThemeFile(themeData: ThemeData): string {
  // Head position is typically at center (0, 0) or slightly offset
  // We'll use the head asset's position as the base reference
  const headXPercent = themeData.headAsset?.xPercent || 0
  const headYPercent = themeData.headAsset?.yPercent || 0

  // Calculate head position relative to canvas center
  // In the theme, head position is usually defined as an offset from top-left
  // We'll use a standard position and adjust other assets relative to it
  const headX = Math.abs(headXPercent) || 27
  const headY = Math.abs(headYPercent) || 20

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
  lines.push(`  x: size * percentage('${headX}%'),`)
  lines.push(`  y: size * percentage('${headY}%'),`)
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

  // Generate addItem calls
  const categoryOrder = [
    'accessories',
    'body',
    'ears',
    'eyebrows',
    'eyes',
    'faceHair',
    'glasses',
    'hair',
    'head',
    'mouth',
    'nose',
  ]

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

      const assetName = toKebabCase(asset.name)
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
