import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  TypedAvatarConfig,
  VueTheme,
} from '@avatune/types'
import { selectItems, themeStyleToStyleProp } from '@avatune/utils'
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
    /** Size of the avatar (default: theme size) */
    size?: number
    /** Optional className for the SVG container */
    class?: string
    /** Optional style for the SVG container */
    style?: CSSProperties
    /** Optional ML predictor results for avatar generation */
    predictions?: Predictions
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
    size: {
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
    predictions: {
      type: Object as PropType<Predictions>,
      default: undefined,
    },
  },
  setup(props) {
    const config = computed(() => {
      const {
        theme: _theme,
        size: _size,
        class: _class,
        style: _style,
        predictions: _predictions,
        ...rest
      } = props as Record<string, unknown>
      return rest as AvatarConfig
    })

    const result = computed(() =>
      selectItems(config.value, props.theme, props.predictions),
    )

    const sortedItems = computed(() =>
      Object.entries(result.value.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    )

    const actualSize = computed(() => props.size ?? props.theme.style.size)

    const scaleFactor = computed(
      () => actualSize.value / props.theme.style.size,
    )

    const finalStyle = computed(() => ({
      ...(themeStyleToStyleProp(props.theme.style) as CSSProperties),
      ...(props.style || {}),
    }))

    return () => {
      return h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          role: 'img',
          'aria-label': 'Avatar',
          width: actualSize.value,
          height: actualSize.value,
          viewBox: `0 0 ${actualSize.value} ${actualSize.value}`,
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
              ? item.position(actualSize.value)
              : item.position
          const transformX = position.x
          const transformY = position.y

          const color = result.value.colors[category as AvatarPartCategory]

          return h(
            'g',
            {
              key: category,
              transform: `translate(${transformX}, ${transformY}) scale(${scaleFactor.value})`,
              style: { color },
            },
            [h(Component)],
          )
        }),
      )
    }
  },
})
