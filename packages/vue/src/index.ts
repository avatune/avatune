import type {
  AvatarConfig,
  AvatarPartCategory,
  TypedAvatarConfig,
  VueTheme,
} from '@avatune/types'
import { metadataToStyle, selectItemFromConfig } from '@avatune/utils'
import {
  type CSSProperties,
  computed,
  defineComponent,
  h,
  type PropType,
} from 'vue'

export type AvatarProps<T extends VueTheme = VueTheme> =
  TypedAvatarConfig<T> & {
    /** Theme to use for rendering */
    theme: T
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
    seed: {
      type: String,
      default: undefined,
    },
    body: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    ears: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    eyebrows: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    eyes: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    hair: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    head: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    mouth: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    noses: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
    bodyColor: {
      type: String,
      default: undefined,
    },
    earsColor: {
      type: String,
      default: undefined,
    },
    eyebrowsColor: {
      type: String,
      default: undefined,
    },
    eyesColor: {
      type: String,
      default: undefined,
    },
    hairColor: {
      type: String,
      default: undefined,
    },
    headColor: {
      type: String,
      default: undefined,
    },
    mouthColor: {
      type: String,
      default: undefined,
    },
    nosesColor: {
      type: String,
      default: undefined,
    },
    width: {
      type: Number,
      default: undefined,
    },
    height: {
      type: Number,
      default: undefined,
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
    const config = computed(() => {
      const {
        theme: _theme,
        width: _width,
        height: _height,
        class: _class,
        style: _style,
        ...rest
      } = props as Record<string, unknown>
      return rest as AvatarConfig
    })

    const result = computed(() =>
      selectItemFromConfig(config.value, props.theme),
    )

    const sortedItems = computed(() =>
      Object.entries(result.value.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    )

    const actualWidth = computed(() => props.width ?? props.theme.metadata.size)
    const actualHeight = computed(
      () => props.height ?? props.theme.metadata.size,
    )

    const scaleFactor = computed(
      () => actualWidth.value / props.theme.metadata.size,
    )

    const finalStyle = computed(() => ({
      ...(metadataToStyle(props.theme.metadata) as CSSProperties),
      ...(props.style || {}),
    }))

    return () => {
      return h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          role: 'img',
          'aria-label': 'Avatar',
          width: actualWidth.value,
          height: actualHeight.value,
          viewBox: `0 0 ${actualWidth.value} ${actualHeight.value}`,
          class: props.class,
          style: finalStyle.value,
        },
        sortedItems.value.map(([category, item]) => {
          if (!item) {
            return null
          }

          const Component = item.Component

          const position =
            typeof item.position === 'function'
              ? item.position(actualWidth.value, actualHeight.value)
              : item.position
          const transformX = position.x
          const transformY = position.y

          const configColor = props.seed
            ? undefined
            : props[`${category}Color` as `${AvatarPartCategory}Color`]

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
