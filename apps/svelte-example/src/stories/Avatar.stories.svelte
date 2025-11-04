<script module lang="ts">
import { defineMeta } from '@storybook/addon-svelte-csf'
import AllCombinations from './AllCombinations.svelte'
import SeedGenerator from './SeedGenerator.svelte'

const { Story } = defineMeta({
  title: 'Avatar/Configurator',
  parameters: {
    layout: 'centered',
  },
})
</script>

<Story name="AllCombinations">
  <AllCombinations />
</Story>

<Story name="SeedGenerator">
  <SeedGenerator />
</Story>
