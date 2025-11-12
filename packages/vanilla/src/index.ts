import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  TypedAvatarConfig,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import { selectItems, themeStyleToStyleProp } from '@avatune/utils'

interface AvatarArgs<T extends VanillaTheme = VanillaTheme>
  extends TypedAvatarConfig<T> {
  theme: T
  size?: number
  predictions?: Predictions
  config?: TypedAvatarConfig<T>
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
  const avatarConfig = config as AvatarConfig

  const result = selectItems(avatarConfig, theme, predictions)

  const sortedItems = Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  )

  const scaleFactor = size / theme.style.size

  const svgParts: string[] = []

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

      const transformed = `<g ${attributes}>${vanillaItem.code}</g>`
      svgParts.push(transformed)
    }
  }

  const finalStyle = themeStyleToStyleProp(theme.style, 'string')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="${finalStyle}" viewBox="0 0 ${size} ${size}">
  ${svgParts.join('\n  ')}
</svg>`

  return svg
}
