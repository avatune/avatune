# @avatune/rsbuild-plugin-svg-to-svelte

Rsbuild plugin to transform SVG files into Svelte components.

## Usage

```ts
import { defineConfig } from '@rslib/core'
import { pluginSvgToSvelte } from '@avatune/rsbuild-plugin-svg-to-svelte'

export default defineConfig({
  plugins: [pluginSvgToSvelte()],
})
```

In your Svelte code:

```svelte
<script>
  import Icon from './icon.svg?svelte'
</script>

<Icon />
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

- `?svelte` - Import as Svelte component
- `?url` - Import as URL
- `?inline` - Import as inline data URI
- `?raw` - Import as raw SVG string

Default SVGO config preserves viewBox and adds prefix IDs.
