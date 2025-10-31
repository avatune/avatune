<script lang="ts">
import type {
  AvatarConfig,
  AvatarPartCategory,
  SvelteAvatarItem,
  SvelteTheme,
} from '@avatune/types'
import {
  AVATAR_CATEGORIES,
  BASE_AVATAR_SIZE,
  seededRandom,
  selectItem,
} from '@avatune/utils'

interface Props {
  theme: SvelteTheme
  config?: AvatarConfig
  width?: number
  height?: number
  class?: string
  style?: string
}

let {
  theme,
  config = {},
  width = BASE_AVATAR_SIZE,
  height = BASE_AVATAR_SIZE,
  class: className,
  style,
}: Props = $props()

const result = $derived.by(() => {
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

    const itemResult = selectItem(theme[category], identifier, tags, random)

    if (itemResult) {
      selected[category] = itemResult.item
      identifiers[category] = itemResult.key
    }
  }

  return { selected, identifiers }
})

const sortedItems = $derived(
  Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  ),
)

const scaleFactor = $derived(width / BASE_AVATAR_SIZE)
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Avatar"
  {width}
  {height}
  viewBox="0 0 {width} {height}"
  class={className}
  {style}
>
  {#each sortedItems as [category, item]}
    {#if item}
      {@const transformX = width * item.position.x}
      {@const transformY = height * item.position.y}
      {@const configColor =
        'seed' in config
          ? undefined
          : config[`${category}Color`]}
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
