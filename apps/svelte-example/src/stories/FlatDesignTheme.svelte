<script lang="ts">
import theme from '@avatune/flat-design-theme/svelte'
import { Avatar } from '@avatune/svelte'

const config = $state({
  body: 'sweater',
  ears: 'standard',
  eyebrows: 'standard',
  eyes: 'dots',
  hair: 'short',
  head: 'oval',
  mouth: 'smile',
  noses: 'curve',
})

const options = {
  body: ['sweater'],
  ears: ['standard'],
  eyebrows: ['standard'],
  eyes: ['boring', 'dots'],
  hair: ['short', 'long', 'medium'],
  head: ['oval'],
  mouth: ['laugh', 'smile', 'nervous'],
  noses: ['curve', 'dots'],
}
</script>

<div style="padding: 2rem">
  <div style="margin-bottom: 2rem; text-align: center">
    <Avatar {theme} {...config} width={300} height={300} />
  </div>

  <div
    style="display: grid; grid-template-columns: auto 1fr; gap: 1rem; max-width: 500px; margin: 0 auto"
  >
    {#each Object.entries(options) as [category, items]}
      <label
        for={category}
        style="font-weight: bold; text-transform: capitalize; align-self: center"
      >
        {category}:
      </label>
      <select
        id={category}
        bind:value={config[category as keyof typeof config]}
        style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc"
      >
        {#each items as item}
          <option value={item}>
            {item}
          </option>
        {/each}
      </select>
    {/each}
  </div>
</div>
