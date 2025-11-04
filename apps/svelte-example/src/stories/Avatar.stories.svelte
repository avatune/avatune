<script module lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Story is used in template
import { defineMeta } from '@storybook/addon-svelte-csf'
// biome-ignore lint/correctness/noUnusedImports: used in Story template
import FlatDesignTheme from './FlatDesignTheme.svelte'
// biome-ignore lint/correctness/noUnusedImports: used in Story template
import SeedGenerator from './SeedGenerator.svelte'
// biome-ignore lint/correctness/noUnusedImports: used in Story template
import SketchTheme from './SketchTheme.svelte'

// biome-ignore lint/correctness/noUnusedVariables: Story is used in template below
const { Story } = defineMeta({
  title: 'Avatar/Configurator',
  parameters: {
    layout: 'centered',
  },
})
</script>

<Story name="SketchTheme">
  <SketchTheme />
</Story>

<Story name="FlatDesignTheme">
  <FlatDesignTheme />
</Story>

<Story name="SeedGenerator">
  <SeedGenerator />
</Story>
