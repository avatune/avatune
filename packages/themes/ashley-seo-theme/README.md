# @avatune/ashley-seo-theme

[![npm version](https://img.shields.io/npm/v/@avatune/ashley-seo-theme)](https://www.npmjs.com/package/@avatune/ashley-seo-theme)
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/ashley-seo-theme)](https://www.npmjs.com/package/@avatune/ashley-seo-theme)

Avatar theme for Avatune using ashley seo design assets.

## Installation

```bash
npm install @avatune/ashley-seo-theme
```

## Usage

This theme is available for multiple frameworks: React, Vue, Svelte, and Vanilla JavaScript.

### React

```tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/ashley-seo-theme/react'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="optional-seed-for-random-generation"
    />
  )
}
```

### Vue

```vue
<script setup lang="ts">
import { Avatar } from '@avatune/vue'
import theme from '@avatune/ashley-seo-theme/vue'
</script>

<template>
  <Avatar
    :theme="theme"
    :size="300"
    seed="optional-seed-for-random-generation"
  />
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { Avatar } from '@avatune/svelte'
  import theme from '@avatune/ashley-seo-theme/svelte'
</script>

<Avatar
  theme={theme}
  size={300}
  seed="optional-seed-for-random-generation"
/>
```

### Vanilla JavaScript

```typescript
import { avatar } from '@avatune/vanilla'
import theme from '@avatune/ashley-seo-theme/vanilla'

const container = document.getElementById('avatar-container')
const svg = avatar({
  theme,
  size: 300,
  seed: 'optional-seed-for-random-generation',
})

container?.appendChild(svg)
```

## Customization

You can override specific avatar parts:

```tsx
<Avatar
  theme={theme}
  size={300}
  hair="bangs"          // Choose specific hair style
  hairColor="#FF5733"    // Custom hair color
  body="sweaterVest"     // Choose specific clothing
  bodyColor="#3498DB"    // Custom clothing color
/>
```

## Design Assets

This theme uses assets from the [`@avatune/ashley-seo-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/ashley-seo-assets) package.

## License

This theme package is licensed under MIT (see [LICENSE.md](https://github.com/avatune/avatune/blob/main/LICENSE.md)).

The design assets used in this theme have their own license and attribution:

This project uses avatar design assets licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Original designs by [Ashley Gaunt-Seo](https://www.figma.com/community/file/881358461963645496/custom-avatar).
Modifications were made to adapt them for composable SVG avatars.

For full details, see:
- [CREDITS.md](https://github.com/avatune/avatune/blob/main/packages/assets/ashley-seo-assets/CREDITS.md) - Asset attribution
- Asset package license in [`@avatune/ashley-seo-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/ashley-seo-assets)

## Related Packages

- [`@avatune/ashley-seo-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/ashley-seo-assets) - SVG assets used by this theme
- [`@avatune/react`](https://github.com/avatune/avatune/tree/main/packages/renderers/react) - React avatar renderer
- [`@avatune/vue`](https://github.com/avatune/avatune/tree/main/packages/renderers/vue) - Vue avatar renderer
- [`@avatune/svelte`](https://github.com/avatune/avatune/tree/main/packages/renderers/svelte) - Svelte avatar renderer
- [`@avatune/vanilla`](https://github.com/avatune/avatune/tree/main/packages/renderers/vanilla) - Vanilla JavaScript avatar renderer

## Development

```bash
# Build the theme
bun run build

# Build in watch mode
bun run dev

# Type checking
bun run check-types
```