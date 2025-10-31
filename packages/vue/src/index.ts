import type {
  AvatarConfig,
  AvatarPartCategory,
  AvatarResult,
  VueAvatarItem,
  VueTheme,
} from '@avatune/types'
import {
  AVATAR_CATEGORIES,
  BASE_AVATAR_SIZE,
  seededRandom,
  selectItem,
} from '@avatune/utils'
import {
  type CSSProperties,
  computed,
  defineComponent,
  h,
  type PropType,
} from 'vue'

export interface AvatarProps {
  /** Theme to use for rendering */
  theme: VueTheme
  /** Configuration for avatar generation */
  config?: AvatarConfig
  /** Width of the avatar (default: 400) */
  width?: number
  /** Height of the avatar (default: 400) */
  height?: number
  /** Optional className for the SVG container */
  class?: string
  /** Optional style for the SVG container */
  style?: CSSProperties
}

/**
 * Vue component for rendering avatars
 */
export const Avatar = defineComponent({
  name: 'Avatar',
  props: {
    theme: {
      type: Object as PropType<VueTheme>,
      required: true,
    },
    config: {
      type: Object as PropType<AvatarConfig>,
      default: () => ({}),
    },
    width: {
      type: Number,
      default: BASE_AVATAR_SIZE,
    },
    height: {
      type: Number,
      default: BASE_AVATAR_SIZE,
    },
    class: {
      type: String,
      default: undefined,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: undefined,
    },
  },
  setup(props) {
    const result = computed(() => {
      const random =
        'seed' in props.config && props.config.seed
          ? seededRandom(props.config.seed)
          : Math.random

      const selected: Partial<Record<AvatarPartCategory, VueAvatarItem>> = {}
      const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

      for (const category of AVATAR_CATEGORIES) {
        const value = (
          props.config as Partial<Record<AvatarPartCategory, string | string[]>>
        )[category]

        const identifier = typeof value === 'string' ? value : undefined
        const tags = Array.isArray(value) ? value : undefined

        const result = selectItem(
          props.theme[category],
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
    })

    const sortedItems = computed(() =>
      Object.entries(result.value.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    )

    const scaleFactor = computed(() => props.width / BASE_AVATAR_SIZE)

    return () => {
      return h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          role: 'img',
          'aria-label': 'Avatar',
          width: props.width,
          height: props.height,
          viewBox: `0 0 ${props.width} ${props.height}`,
          class: props.class,
          style: props.style,
        },
        sortedItems.value.map(([category, item]) => {
          if (!item) {
            return null
          }

          const Component = item.Component

          // Convert percentage positions to pixel coordinates
          const transformX = props.width * item.position.x
          const transformY = props.height * item.position.y

          const configColor =
            'seed' in props.config
              ? undefined
              : props.config[`${category as AvatarPartCategory}Color`]

          return h(
            'g',
            {
              key: category,
              transform: `translate(${transformX}, ${transformY}) scale(${scaleFactor.value})`,
              style: { color: configColor || item.color },
            },
            [h(Component)],
          )
        }),
      )
    }
  },
})

/**
 * Generate avatar data without rendering (useful for server-side or data generation)
 */
export function generateAvatarData(
  theme: VueTheme,
  config: AvatarConfig = {},
): AvatarResult {
  const random =
    'seed' in config && config.seed ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, VueAvatarItem>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}

  for (const category of AVATAR_CATEGORIES) {
    const value = (
      config as Partial<Record<AvatarPartCategory, string | string[]>>
    )[category]

    const identifier = typeof value === 'string' ? value : undefined
    const tags = Array.isArray(value) ? value : undefined

    const result = selectItem(
      theme[category] as Record<string, VueAvatarItem>,
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
  theme: VueTheme,
  category: AvatarPartCategory,
): string[] {
  return Object.keys(theme[category])
}

/**
 * Get all available tags for a specific category
 */
export function getAvailableTags(
  theme: VueTheme,
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
