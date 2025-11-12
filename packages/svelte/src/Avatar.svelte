<script lang="ts" generics="T extends SvelteTheme">
import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  SvelteTheme,
  TypedAvatarConfig,
} from '@avatune/types'
import { selectItems, themeStyleToStyleProp } from '@avatune/utils'

type Props = TypedAvatarConfig<T> & {
  theme: T
  size?: number
  class?: string
  style?: string
  predictions?: Predictions
}

const {
  theme,
  size = theme.style.size,
  class: className,
  style,
  predictions,
  ...config
}: Props = $props()

const result = $derived(selectItems(config as AvatarConfig, theme, predictions))

const sortedItems = $derived(
  Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  ),
)

const scaleFactor = $derived(size / theme.style.size)

const finalStyle = $derived(
  [themeStyleToStyleProp(theme.style, 'string'), style]
    .filter(Boolean)
    .join('; '),
)
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Avatar"
  width={size}
  height={size}
  viewBox="0 0 {size} {size}"
  class={className}
  style={finalStyle}
>
  {#each sortedItems as [category, item]}
    {#if item}
      {@const position = typeof item.position === 'function' ? item.position(size) : item.position}
      {@const transformX = position.x}
      {@const transformY = position.y}
      {@const color = result.colors[category]}
      {@const ItemComponent = item.Component}
      <g
        transform="translate({transformX}, {transformY}) scale({scaleFactor})"
        style="color: {color}"
      >
        <ItemComponent />
      </g>
    {/if}
  {/each}
</svg>
