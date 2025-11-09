# @avatune/rsbuild-plugin-svg-to-vue

Rsbuild plugin to transform SVG files into Vue components.

## Usage

```ts
import { defineConfig } from '@rslib/core'
import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'

export default defineConfig({
  plugins: [pluginSvgToVue()],
})
```

In your Vue code:

```vue
<script setup>
import Icon from './icon.svg?vue'
</script>

<template>
  <Icon />
</template>
```

## Options

```ts
{
  svgoConfig?: SvgoConfig     // SVGO optimization config
  svgo?: boolean              // Enable/disable SVGO (default: true)
  mixedImport?: boolean       // Allow mixed imports
  exclude?: RuleSetCondition  // Files to exclude
  debug?: boolean             // Enable debug logging
}
```

## Import Queries

- `?vue` - Import as Vue component
- `?url` - Import as URL
- `?inline` - Import as inline data URI
- `?raw` - Import as raw SVG string

Default SVGO config preserves viewBox and adds prefix IDs.
