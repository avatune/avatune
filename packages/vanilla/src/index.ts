import type {
  AvatarConfig,
  AvatarPartCategory,
  TypedAvatarConfig,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import { AVATAR_CATEGORIES, seededRandom, selectItem } from '@avatune/utils'

interface AvatarArgs<T extends VanillaTheme = VanillaTheme>
  extends TypedAvatarConfig<T> {
  theme: T
  size?: number
  config?: TypedAvatarConfig<T>
}
/**
 * Generate avatar SVG code from theme and config
 */
export function avatar<T extends VanillaTheme = VanillaTheme>({
  theme,
  size = theme.metadata.size,
  ...config
}: AvatarArgs<T>): string {
  const avatarConfig = config as AvatarConfig
  const random =
    'seed' in avatarConfig && avatarConfig.seed
      ? seededRandom(avatarConfig.seed)
      : Math.random

  const selected: Partial<Record<AvatarPartCategory, VanillaAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = (
      avatarConfig as Partial<Record<AvatarPartCategory, string | string[]>>
    )[category]

    const identifier = typeof value === 'string' ? value : undefined
    const tags = Array.isArray(value) ? value : undefined

    const result = selectItem(theme[category], identifier, tags, random)

    if (result) {
      selected[category] = result.item
      identifiers[category] = result.key
    }
  }

  // Sort items by layer
  const sortedItems = Object.entries(selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  )

  // Generate SVG
  // Default viewBox and dimensions
  // const width = theme.metadata.size
  // const height = theme.metadata.size

  // Calculate responsive scale factor (base size is 400)
  const scaleFactor = size / theme.metadata.size

  const svgParts: string[] = []

  for (const [category, item] of sortedItems) {
    if (item) {
      const position =
        typeof item.position === 'function'
          ? item.position(size, size)
          : item.position
      const transformX = position.x
      const transformY = position.y

      const configColor =
        'seed' in avatarConfig
          ? undefined
          : avatarConfig[`${category as AvatarPartCategory}Color`]
      const color = configColor || item.color
      const style = color ? `style="color: ${color}"` : ''
      const transform = `transform="translate(${transformX}, ${transformY}) scale(${scaleFactor})"`
      const attributes = [transform, style].filter(Boolean).join(' ')

      // Wrap each SVG in a group with transform for positioning and scaling
      const transformed = `<g ${attributes}>${item.code}</g>`
      svgParts.push(transformed)
    }
  }

  const backgroundColor = theme.metadata.backgroundColor
  const borderColor = theme.metadata.borderColor
  const borderWidth = theme.metadata.borderWidth
  const finalStyle = [
    backgroundColor ? `background-color: ${backgroundColor}` : '',
    borderWidth && borderColor
      ? `border: ${borderWidth}px solid ${borderColor}`
      : '',
    'border-radius: 100%',
  ]
    .filter(Boolean)
    .join('; ')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="${finalStyle}" viewBox="0 0 ${size} ${size}">
  ${svgParts.join('\n  ')}
</svg>`

  return svg
}
