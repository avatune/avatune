import type {
  AvatarConfig,
  AvatarPartCategory,
  AvatarResult,
  ReactAvatarItem,
  ReactTheme,
} from '@avatune/types'
import { type CSSProperties, useMemo } from 'react'

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
  collection: Record<string, ReactAvatarItem>,
  identifier?: string,
  tags?: string[],
  random?: () => number,
): { key: string; item: ReactAvatarItem } | null {
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

export interface AvatarProps {
  /** Theme to use for rendering */
  theme: ReactTheme
  /** Configuration for avatar generation */
  config?: AvatarConfig
  /** Width of the avatar (default: 400) */
  width?: number
  /** Height of the avatar (default: 400) */
  height?: number
  /** Optional className for the SVG container */
  className?: string
  /** Optional style for the SVG container */
  style?: CSSProperties
}

/**
 * React component for rendering avatars
 */
export function Avatar({
  theme,
  config = {},
  width = 400,
  height = 400,
  className,
  style,
}: AvatarProps) {
  const result = useMemo(() => {
    const random = config.seed ? seededRandom(config.seed) : Math.random

    const selected: Partial<Record<AvatarPartCategory, ReactAvatarItem>> = {}
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
        theme[category] as Record<string, ReactAvatarItem>,
        identifier,
        tags,
        random,
      )

      if (result) {
        selected[category] = result.item
        identifiers[category] = result.key
      }
    }

    return { selected, identifiers }
  }, [theme, config])

  // Sort items by layer
  const sortedItems = useMemo(
    () =>
      Object.entries(result.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    [result.selected],
  )

  // Calculate responsive scale factor (base size is 400)
  const scaleFactor = width / 400

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
    >
      {sortedItems.map(([category, item]) => {
        if (!item) return null

        const Component = item.Component

        // Convert percentage positions to pixel coordinates
        const transformX = width * item.position.x
        const transformY = height * item.position.y

        return (
          <g
            key={category}
            transform={`translate(${transformX}, ${transformY}) scale(${scaleFactor})`}
          >
            <Component />
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Generate avatar data without rendering (useful for server-side or data generation)
 */
export function generateAvatarData(
  theme: ReactTheme,
  config: AvatarConfig = {},
): AvatarResult {
  const random = config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, ReactAvatarItem>> = {}
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
      theme[category] as Record<string, ReactAvatarItem>,
      identifier,
      tags,
      random,
    )

    if (result) {
      selected[category] = result.item
      identifiers[category] = result.key
    }
  }

  return { selected, identifiers }
}

/**
 * Get all available identifiers for a specific category
 */
export function getAvailableItems(
  theme: ReactTheme,
  category: AvatarPartCategory,
): string[] {
  return Object.keys(theme[category])
}

/**
 * Get all available tags for a specific category
 */
export function getAvailableTags(
  theme: ReactTheme,
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
