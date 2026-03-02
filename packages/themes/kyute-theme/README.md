# @avatune/kyute-theme

[![npm version](https://img.shields.io/npm/v/@avatune/kyute-theme)](https://www.npmjs.com/package/@avatune/kyute-theme)
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/kyute-theme)](https://www.npmjs.com/package/@avatune/kyute-theme)

Avatar theme for Avatune using kyute design assets.

## Installation

```bash
npm install @avatune/kyute-theme
```

## Usage

This theme is available for multiple frameworks: React, Vue, Svelte, Angular, and Vanilla JavaScript.

### React

```tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/kyute-theme/react'

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
import theme from '@avatune/kyute-theme/vue'
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
  import theme from '@avatune/kyute-theme/svelte'
</script>

<Avatar
  theme={theme}
  size={300}
  seed="optional-seed-for-random-generation"
/>
```

### Angular

```ts
import { Component } from '@angular/core'
import { Avatar } from '@avatune/angular'
import theme from '@avatune/kyute-theme/angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Avatar],
  template: `
    <avatune-avatar
      [theme]="theme"
      [inputSize]="300"
      seed="optional-seed-for-random-generation"
    />
  `,
})
export class AppComponent {
  theme = theme
}
```

### Vanilla JavaScript

```typescript
import { avatar } from '@avatune/vanilla'
import theme from '@avatune/kyute-theme/vanilla'

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
  hair="bob"          // Choose specific hair style
  hairColor="#FF5733"    // Custom hair color
  body="casual"     // Choose specific clothing
  bodyColor="#3498DB"    // Custom clothing color
/>
```

## Design Assets

This theme uses assets from the [`@avatune/kyute-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/kyute-assets) package.

## License

This theme package is licensed under MIT (see [LICENSE.md](https://github.com/avatune/avatune/blob/main/LICENSE.md)).

The design assets used in this theme have their own license and attribution:

This project uses avatar design assets licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Original designs by [Aaron Gitlin](https://www.figma.com/community/file/800912493498815197).
Modifications were made to adapt them for composable SVG avatars.

For full details, see:
- [CREDITS.md](https://github.com/avatune/avatune/blob/main/packages/assets/kyute-assets/CREDITS.md) - Asset attribution
- Asset package license in [`@avatune/kyute-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/kyute-assets)

## Related Packages

- [`@avatune/kyute-assets`](https://github.com/avatune/avatune/tree/main/packages/assets/kyute-assets) - SVG assets used by this theme
- [`@avatune/react`](https://github.com/avatune/avatune/tree/main/packages/renderers/react) - React avatar renderer
- [`@avatune/vue`](https://github.com/avatune/avatune/tree/main/packages/renderers/vue) - Vue avatar renderer
- [`@avatune/svelte`](https://github.com/avatune/avatune/tree/main/packages/renderers/svelte) - Svelte avatar renderer
- [`@avatune/angular`](https://github.com/avatune/avatune/tree/main/packages/renderers/angular) - Angular avatar renderer
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