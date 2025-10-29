import type {
  AvatarConfig,
  AvatarPartCategory,
  AvatarResult,
  ReactAvatarItem,
  ReactTheme,
} from '@avatune/types'
import {
  AVATAR_CATEGORIES,
  BASE_AVATAR_SIZE,
  seededRandom,
  selectItem,
} from '@avatune/utils'
import { type CSSProperties, useMemo } from 'react'

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
  width = BASE_AVATAR_SIZE,
  height = BASE_AVATAR_SIZE,
  className,
  style,
}: AvatarProps) {
  const result = useMemo(() => {
    const random =
      'seed' in config && config.seed ? seededRandom(config.seed) : Math.random

    const selected: Partial<Record<AvatarPartCategory, ReactAvatarItem>> = {}
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

  // Calculate responsive scale factor
  const scaleFactor = width / BASE_AVATAR_SIZE

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
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
  const random =
    'seed' in config && config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, ReactAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = (
      config as Partial<Record<AvatarPartCategory, string | string[]>>
    )[category]

    const identifier = typeof value === 'string' ? value : undefined
    const tags = Array.isArray(value) ? value : undefined

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
