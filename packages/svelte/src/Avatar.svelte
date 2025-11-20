<script lang="ts" generics="T extends SvelteTheme">
import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  SvelteAvatarItem,
  SvelteTheme,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'

type Props = AvatarConfig<SvelteAvatarItem, T> & {
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

const result = $derived(
  selectItems(config as AvatarConfig<SvelteAvatarItem, T>, theme, predictions),
)

const sortedItems = $derived(
  Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  ),
)

const scaleFactor = $derived(size / theme.style.size)
const clipId = `avatar-clip-${Math.random().toString(36).slice(2, 9)}`
const borderRadius = $derived(parseBorderRadius(theme.style.borderRadius, size))
const backgroundColor = $derived(
  result.style?.backgroundColor || theme.style.backgroundColor,
)
const borderColor = $derived(theme.style.borderColor)
const borderWidth = $derived(parseBorderWidth(theme.style.borderWidth))
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Avatar"
  width={size}
  height={size}
  viewBox="0 0 {size} {size}"
  class={className}
  {style}
>
  <defs>
    <clipPath id={clipId}>
      <rect
        x={0}
        y={0}
        width={size}
        height={size}
        rx={borderRadius}
        ry={borderRadius}
      />
    </clipPath>
  </defs>

  <!-- Background -->
  {#if backgroundColor}
    <rect
      x={0}
      y={0}
      width={size}
      height={size}
      rx={borderRadius}
      ry={borderRadius}
      fill={backgroundColor}
    />
  {/if}

  <!-- Avatar content with clipping -->
  <g clip-path="url(#{clipId})">
    {#each sortedItems as [category, item]}
      {#if item}
        {@const position = typeof item.position === 'function' ? item.position(size) : item.position}
        {@const transformX = position.x}
        {@const transformY = position.y}
        {@const color = result.colors[category as AvatarPartCategory]}
        {@const ItemComponent = item.Component}
        <g
          transform="translate({transformX}, {transformY}) scale({scaleFactor})"
        >
          <ItemComponent color={color} />
        </g>
      {/if}
    {/each}
  </g>

  <!-- Border (rendered on top) -->
  {#if borderColor && borderWidth > 0}
    <rect
      x={borderWidth / 2}
      y={borderWidth / 2}
      width={size - borderWidth}
      height={size - borderWidth}
      rx={borderRadius}
      ry={borderRadius}
      fill="none"
      stroke={borderColor}
      stroke-width={borderWidth}
    />
  {/if}
</svg>
