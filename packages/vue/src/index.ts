import type {
  AvatarConfig,
  AvatarPartCategory,
  TypedAvatarConfig,
  VueTheme,
} from '@avatune/types'
import { BASE_AVATAR_SIZE, selectItemFromConfig } from '@avatune/utils'
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
    const result = computed(() =>
      selectItemFromConfig(props as AvatarConfig, props.theme),
    )

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
