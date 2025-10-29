import type {
  AvatarItem,
  AvatarItemCollection,
  AvatarPartCategory,
} from '@avatune/types'

/**
 * Base avatar size for calculations (400x400)
 */
export const BASE_AVATAR_SIZE = 400

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
