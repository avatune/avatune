# Avatune

**Production-ready avatar system with AI-powered generation and framework-native components.**

Generate beautiful, customizable avatars with machine learning prediction or manual configuration. Works seamlessly with React, Vue, Svelte, and Vanilla JavaScript.

## Features

- **AI-Powered Generation** - Train and use TensorFlow.js models for intelligent avatar attribute prediction (hair color, skin tone, hair length)
- **Framework Native** - First-class support for React, Vue, Svelte, and Vanilla JS with framework-specific components
- **Theme System** - Multiple professionally designed themes with full customization support
- **Type Safe** - Built with TypeScript for complete type safety across all packages
- **Production Ready** - Optimized builds with Rspack, tree-shakeable, and performant

## Quick Start

```bash
# Install a theme and renderer for your framework
npm install @avatune/yanliu-theme @avatune/react
```

```tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/yanliu-theme/react'

function App() {
  return <Avatar theme={theme} seed="unique-identifier" size={300} />
}
```

## Available Themes

All themes support React, Vue, Svelte, and Vanilla JavaScript.

- [`@avatune/yanliu-theme`](./packages/yanliu-theme) - Cute, friendly avatar designs
- [`@avatune/miniavs-theme`](./packages/miniavs-theme) - Minimalist avatar system
- [`@avatune/nevmstas-theme`](./packages/nevmstas-theme) - Modern Nevmstas avatars

## Framework Renderers

- [`@avatune/react`](./packages/react) - React components
- [`@avatune/vue`](./packages/vue) - Vue 3 components
- [`@avatune/svelte`](./packages/svelte) - Svelte 5 components
- [`@avatune/vanilla`](./packages/vanilla) - Framework-agnostic JavaScript

## Predictors

Train custom TensorFlow.js models or use pre-trained predictors:

- [`@avatune/hair-color-predictor`](./packages/hair-color-predictor) - Predict hair color from images
- [`@avatune/skin-tone-predictor`](./packages/skin-tone-predictor) - Predict skin tone from images
- [`@avatune/hair-length-predictor`](./packages/hair-length-predictor) - Predict hair length from images

Models are trained in Python and exported to TensorFlow.js for browser inference.

## Live Demo

Explore all themes and frameworks in the unified Storybook:

```bash
bun run build && bun storybook
```

This launches a single Storybook instance showcasing all themes across React, Vue, Svelte, and Vanilla implementations.

## Development

Built with a modern monorepo setup:

- **Turborepo** - Intelligent build system with caching
- **Bun** - Fast package manager and runtime
- **Rspack** - Lightning-fast bundler for production builds
- **Biome** - Fast linting and formatting

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run all storybooks
bun storybook
```

## Creating Custom Themes

Use the theme builder to create your own themes:

```typescript
import { createTheme } from '@avatune/theme-builder'
import type { ReactAvatarItem } from '@avatune/types'

const myTheme = createTheme()
  .withStyle({ size: 500, borderRadius: '100%' })
  .addColors('hair', ['#000000', '#8B4513'])
  .addColors('body', ['#FF0000', '#00FF00'])
  .toFramework<ReactAvatarItem>()
  .withComponents('hair', {
    short: { Component: ShortHair },
    long: { Component: LongHair },
  })
  .build()
```

## License

See [LICENSE.md](LICENSE.md) for license information.

## Credits

Design assets are sourced from community creators. See individual theme packages for license and attribution.
