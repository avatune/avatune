import type {
  VanillaTheme,
  AvatarConfig,
  AvatarResult,
  AvatarPartCategory,
  VanillaAvatarItem,
} from '@avatune/types'

/**
 * Simple seeded random number generator for reproducible results
 */
function seededRandom(seed: string | number): () => number {
  let value = typeof seed === 'number' ? seed : hashString(seed)
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Select an item from a collection based on identifier or tags
 */
function selectItem(
  collection: Record<string, VanillaAvatarItem>,
  identifier?: string,
  tags?: string[],
  random?: () => number,
): { key: string; item: VanillaAvatarItem } | null {
  // If identifier specified, return that item
  if (identifier && collection[identifier]) {
    return { key: identifier, item: collection[identifier] }
  }

  // Filter by tags if specified
  let candidates = Object.entries(collection)

  if (tags && tags.length > 0) {
    candidates = candidates.filter(([, item]) =>
      tags.every((tag) => item.tags.includes(tag)),
    )
  }

  if (candidates.length === 0) {
    return null
  }

  // Pick random item (or first if no random function)
  const index = random ? Math.floor(random() * candidates.length) : 0
  const selected = candidates[index]

  if (!selected) {
    return null
  }

  const [key, item] = selected

  return { key, item }
}

/**
 * Generate avatar SVG code from theme and config
 */
export function renderAvatar(
  theme: VanillaTheme,
  config: AvatarConfig = {},
): AvatarResult & { svg: string } {
  const random = config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, VanillaAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  const categories: AvatarPartCategory[] = [
    'body',
    'ears',
    'eyebrows',
    'eyes',
    'hair',
    'head',
    'mouth',
    'noses',
  ]

  // Select items for each category
  for (const category of categories) {
    const identifier = config.parts?.[category]
    const tags = config.tags?.[category]

    const result = selectItem(
      theme[category] as Record<string, VanillaAvatarItem>,
      identifier,
      tags,
      random,
    )

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
  const width = 400
  const height = 400

  // Calculate responsive scale factor (base size is 400)
  const scaleFactor = width / 400

  const svgParts: string[] = []

  for (const [, item] of sortedItems) {
    if (item) {
      // Convert percentage positions to pixel coordinates
      const transformX = width * item.position.x
      const transformY = height * item.position.y

      // Wrap each SVG in a group with transform for positioning and scaling
      const transformed = `<g transform="translate(${transformX}, ${transformY}) scale(${scaleFactor})">${item.code}</g>`
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
