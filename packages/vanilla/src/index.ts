import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'

export interface AvatarArgs<T extends VanillaTheme = VanillaTheme>
  extends AvatarConfig<VanillaAvatarItem, T> {
  theme: T
  size?: number
  predictions?: Predictions
  config?: AvatarConfig<VanillaAvatarItem, T>
}

/**
 * Generate avatar SVG code from theme and config
 */
export function avatar<T extends VanillaTheme = VanillaTheme>({
  theme,
  size = theme.style.size,
  predictions,
  ...config
}: AvatarArgs<T>): string {
  const avatarConfig = config as AvatarConfig<VanillaAvatarItem, T>

  const result = selectItems(avatarConfig, theme, predictions)

  const sortedItems = Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  )

  const scaleFactor = size / theme.style.size
  const clipId = `avatar-clip-${Math.random().toString(36).slice(2, 9)}`
  const borderRadius = parseBorderRadius(theme.style.borderRadius, size)
  const backgroundColor =
    result.style?.backgroundColor || theme.style.backgroundColor
  const borderColor = theme.style.borderColor
  const borderWidth = parseBorderWidth(theme.style.borderWidth)

  const svgParts: string[] = []

  // Defs with clipPath
  svgParts.push(`<defs>
    <clipPath id="${clipId}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" />
    </clipPath>
  </defs>`)

  // Background
  if (backgroundColor) {
    svgParts.push(
      `<rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="${backgroundColor}" />`,
    )
  }

  // Avatar content with clipping
  const contentParts: string[] = []
  for (const [category, item] of sortedItems) {
    const vanillaItem = item as VanillaAvatarItem | undefined
    if (vanillaItem && 'code' in vanillaItem) {
      const position =
        typeof vanillaItem.position === 'function'
          ? vanillaItem.position(size)
          : vanillaItem.position
      const transformX = position.x
      const transformY = position.y

      const color = result.colors[category as AvatarPartCategory]
      const style = color ? `style="color: ${color}"` : ''
      const transform = `transform="translate(${transformX}, ${transformY}) scale(${scaleFactor})"`
      const attributes = [transform, style].filter(Boolean).join(' ')

      const transformed = `<g ${attributes}>${vanillaItem.code({ color: color ?? 'currentColor' })}</g>`
      contentParts.push(transformed)
    }
  }

  svgParts.push(`<g clip-path="url(#${clipId})">
  ${contentParts.join('\n  ')}
</g>`)

  // Border (rendered on top)
  if (borderColor && borderWidth > 0) {
    svgParts.push(
      `<rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${size - borderWidth}" height="${size - borderWidth}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" />`,
    )
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${svgParts.join('\n  ')}
</svg>`

  return svg
}
