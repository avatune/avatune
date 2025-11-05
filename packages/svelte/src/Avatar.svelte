<script lang="ts" generics="T extends SvelteTheme">
import type {
  AvatarConfig,
  AvatarPartCategory,
  SvelteTheme,
  TypedAvatarConfig,
} from '@avatune/types'
import { metadataToStyle, selectItemFromConfig } from '@avatune/utils'

type Props = TypedAvatarConfig<T> & {
  theme: T
  size?: number
  class?: string
  style?: string
}

const {
  theme,
  size = theme.metadata.size,
  class: className,
  style,
  ...config
}: Props = $props()

const result = $derived(selectItemFromConfig(config as AvatarConfig, theme))

const sortedItems = $derived(
  Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  ),
)

const scaleFactor = $derived(size / theme.metadata.size)

const finalStyle = $derived(
  [metadataToStyle(theme.metadata, 'string'), style].filter(Boolean).join('; '),
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
      {@const configColor = config.seed ? undefined : config[`${category}Color` as `${AvatarPartCategory}Color`]}
      {@const ItemComponent = item.Component}
      <g
        transform="translate({transformX}, {transformY}) scale({scaleFactor})"
        style="color: {configColor || item.color}"
      >
        <ItemComponent />
      </g>
    {/if}
  {/each}
</svg>
