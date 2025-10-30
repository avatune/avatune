import type {
  AvatarConfig,
  AvatarPartCategory,
  AvatarResult,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import {
  AVATAR_CATEGORIES,
  BASE_AVATAR_SIZE,
  seededRandom,
  selectItem,
} from '@avatune/utils'

/**
 * Generate avatar SVG code from theme and config
 */
export function renderAvatar(
  theme: VanillaTheme,
  config: AvatarConfig = {},
): AvatarResult & { svg: string } {
  const random =
    'seed' in config && config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, VanillaAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = (
      config as Partial<Record<AvatarPartCategory, string | string[]>>
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
  const width = BASE_AVATAR_SIZE
  const height = BASE_AVATAR_SIZE

  // Calculate responsive scale factor (base size is 400)
  const scaleFactor = width / BASE_AVATAR_SIZE

  const svgParts: string[] = []

  for (const [category, item] of sortedItems) {
    if (item) {
      // Convert percentage positions to pixel coordinates
      const transformX = width * item.position.x
      const transformY = height * item.position.y

      const configColor =
        'seed' in config
          ? undefined
          : config[`${category as AvatarPartCategory}Color`]
      const color = configColor || item.color
      const style = color ? `style="color: ${color}"` : ''
      const transform = `transform="translate(${transformX}, ${transformY}) scale(${scaleFactor})"`
      const attributes = [transform, style].filter(Boolean).join(' ')

      // Wrap each SVG in a group with transform for positioning and scaling
      const transformed = `<g ${attributes}>${item.code}</g>`
      svgParts.push(transformed)
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${svgParts.join('\n  ')}
</svg>`

  return {
    selected,
    identifiers,
    svg,
  }
}

/**
 * Get all available identifiers for a specific category
 */
export function getAvailableItems(
  theme: VanillaTheme,
  category: AvatarPartCategory,
): string[] {
  return Object.keys(theme[category])
}

/**
 * Get all available tags for a specific category
 */
export function getAvailableTags(
  theme: VanillaTheme,
  category: AvatarPartCategory,
): string[] {
  const tags = new Set<string>()
  for (const item of Object.values(theme[category])) {
    for (const tag of item.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags)
}
