import type {
  AvatarConfig,
  AvatarPartCategory,
  AvatarResult,
  SvelteAvatarItem,
  SvelteTheme,
} from '@avatune/types'
import { AVATAR_CATEGORIES, seededRandom, selectItem } from '@avatune/utils'

export { default as Avatar } from './Avatar.svelte'

/**
 * Generate avatar data without rendering (useful for server-side or data generation)
 */
export function generateAvatarData(
  theme: SvelteTheme,
  config: AvatarConfig = {},
): AvatarResult {
  const random =
    'seed' in config && config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, SvelteAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = (
      config as Partial<Record<AvatarPartCategory, string | string[]>>
    )[category]

    const identifier = typeof value === 'string' ? value : undefined
    const tags = Array.isArray(value) ? value : undefined

    const result = selectItem(
      theme[category] as Record<string, SvelteAvatarItem>,
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
  theme: SvelteTheme,
  category: AvatarPartCategory,
): string[] {
  return Object.keys(theme[category])
}

/**
 * Get all available tags for a specific category
 */
export function getAvailableTags(
  theme: SvelteTheme,
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
