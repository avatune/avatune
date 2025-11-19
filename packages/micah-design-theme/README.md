# @avatune/micah-design-theme

Avatar theme for Avatune using micah design design assets.

## Installation

```bash
npm install @avatune/micah-design-theme
```

## Usage

This theme is available for multiple frameworks: React, Vue, Svelte, and Vanilla JavaScript.

### React

```tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/micah-design-theme/react'

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
import theme from '@avatune/micah-design-theme/vue'
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
  import theme from '@avatune/micah-design-theme/svelte'
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
import theme from '@avatune/micah-design-theme/vanilla'

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
  hair="dannyPhantom"          // Choose specific hair style
  hairColor="#FF5733"    // Custom hair color
  body="collaredShirt"     // Choose specific clothing
  bodyColor="#3498DB"    // Custom clothing color
/>
```

## Design Assets

This theme uses assets from the [`@avatune/micah-design-assets`](../packages/micah-design-assets) package.

## License

This theme package is licensed under MIT (see [LICENSE.md](../../LICENSE.md)).

The design assets used in this theme have their own license and attribution:

This project uses avatar design assets licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Original designs by [Micah Lanier](https://www.figma.com/community/file/829741575478342595/avatar-illustration-system).
Modifications were made to adapt them for composable SVG avatars.

For full details, see:
- [CREDITS.md](../packages/micah-design-assets/CREDITS.md) - Asset attribution
- Asset package license in [`@avatune/micah-design-assets`](../packages/micah-design-assets)

## Related Packages

- [`@avatune/micah-design-assets`](../packages/micah-design-assets) - SVG assets used by this theme
- [`@avatune/react`](../packages/react) - React avatar renderer
- [`@avatune/vue`](../packages/vue) - Vue avatar renderer
- [`@avatune/svelte`](../packages/svelte) - Svelte avatar renderer
- [`@avatune/vanilla`](../packages/vanilla) - Vanilla JavaScript avatar renderer

## Development

```bash
# Build the theme
bun run build

# Build in watch mode
bun run dev

# Type checking
bun run check-types
```
