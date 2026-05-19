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
import { untrack } from 'svelte'

const genId = () => Math.random().toString(36).slice(2, 9)

type Props = AvatarConfig<SvelteAvatarItem, T> & {
  theme: T
  size?: number
  class?: string
  style?: string
  predictions?: Predictions
}

const props: Props = $props()

const theme = $derived(props.theme)
const size = $derived(props.size ?? theme.style.size)
const className = $derived(props.class)
const style = $derived(props.style)
const predictions = $derived(props.predictions)

const config = $derived.by(() => {
  const {
    theme: _,
    size: __,
    class: ___,
    style: ____,
    predictions: _____,
    ...rest
  } = props
  return rest as AvatarConfig<SvelteAvatarItem, T>
})

const result = $derived(selectItems(config, theme, predictions))

const sortedItems = $derived(
  Object.entries(result.selected)
    .filter(([, item]) => item != null)
    .sort(([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0)) as [
    AvatarPartCategory,
    SvelteAvatarItem,
  ][],
)

const scaleFactor = $derived(size / theme.style.size)
const clipId = untrack(genId)
const uid = untrack(genId)
const borderRadius = $derived(
  parseBorderRadius(
    result.style?.borderRadius ?? theme.style.borderRadius,
    size,
  ),
)
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
    {#each sortedItems as [category, item] (category)}
      {@const position = typeof item.position === 'function' ? item.position(size) : item.position}
      {@const color = result.colors[category]}
      {@const Component = item.Component}
      <g transform="translate({position.x}, {position.y}) scale({scaleFactor})">
        <Component {color} {uid} />
      </g>
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
