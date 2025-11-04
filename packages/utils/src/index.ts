import type {
  AvatarConfig,
  AvatarItem,
  AvatarItemCollection,
  AvatarPartCategory,
  Theme,
} from '@avatune/types'

/**
 * Avatar part categories in rendering order
 */
export const AVATAR_CATEGORIES = [
  'body',
  'ears',
  'eyebrows',
  'eyes',
  'hair',
  'head',
  'mouth',
  'noses',
] satisfies AvatarPartCategory[]

/**
 * Simple string hash function
 */
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Simple seeded random number generator for reproducible results
 */
export function seededRandom(seed: string | number): () => number {
  let value = typeof seed === 'number' ? seed : hashString(seed)
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/**
 * Select an item from a collection based on identifier or tags
 */
export function selectItem<T extends AvatarItem>(
  collection: AvatarItemCollection<T>,
  identifier?: string,
  tags?: string[],
  random?: () => number,
): { key: string; item: T } | null {
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

export function selectItemFromConfig<T extends AvatarItem>(
  config: AvatarConfig,
  theme: Theme<T>,
): {
  selected: Partial<Record<AvatarPartCategory, T>>
  identifiers: Partial<Record<AvatarPartCategory, string>>
} & { seed?: string | number } {
  const random =
    typeof config.seed !== 'undefined' ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, T>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = config[category]

    const identifier = typeof value === 'string' ? value : undefined
    const tags = Array.isArray(value) ? value : undefined

    const result = selectItem(theme[category], identifier, tags, random)

    if (result) {
      selected[category] = result.item
      identifiers[category] = result.key
    }
  }

  return { selected, identifiers }
}

export function metadataToStyle(
  metadata: Theme['metadata'],
  output: 'object' | 'string' = 'object',
) {
  const backgroundColor = metadata.backgroundColor
  const borderColor = metadata.borderColor
  const borderWidth = metadata.borderWidth
  const borderRadius = metadata.borderRadius

  if (output === 'object') {
    return {
      backgroundColor,
      border:
        borderWidth && borderColor
          ? `${borderWidth}px solid ${borderColor}`
          : undefined,
      borderRadius,
    }
  }

  return [
    backgroundColor ? `background-color: ${backgroundColor};` : false,
    borderWidth && borderColor
      ? `border: ${borderWidth}px solid ${borderColor};`
      : false,
    borderRadius ? `border-radius: ${borderRadius};` : false,
  ]
    .filter(Boolean)
    .join(' ')
}
