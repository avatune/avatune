# Avatune

<p align="center">
  <img src="https://github.com/avatune/avatune/blob/main/apps/website/public/favicon.png?raw=true" alt="Avatune Logo" width="300" />
</p>

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
npm install @avatune/fatin-verse-theme @avatune/react
```

```tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/fatin-verse-theme/react'

function App() {
  return <Avatar theme={theme} seed="unique-identifier" size={300} />
}
```

## Available Themes

All themes support React, Vue, Svelte, and Vanilla JavaScript.

| Theme | Package |
|-------|---------|
| Fatin Verse | [`@avatune/fatin-verse-theme`](./packages/themes/fatin-verse-theme) |
| Kyute | [`@avatune/kyute-theme`](./packages/themes/kyute-theme) |
| Micah | [`@avatune/micah-theme`](./packages/themes/micah-theme) |
| Miniavs | [`@avatune/miniavs-theme`](./packages/themes/miniavs-theme) |
| Nevmstas | [`@avatune/nevmstas-theme`](./packages/themes/nevmstas-theme) |
| Pacovqzz | [`@avatune/pacovqzz-theme`](./packages/themes/pacovqzz-theme) |
| Yanliu | [`@avatune/yanliu-theme`](./packages/themes/yanliu-theme) |

## Framework Renderers

| Framework | Package |
|-----------|---------|
| React | [`@avatune/react`](./packages/renderers/react) |
| React Native | [`@avatune/react-native`](./packages/renderers/react-native) |
| Vue 3 | [`@avatune/vue`](./packages/renderers/vue) |
| Svelte 5 | [`@avatune/svelte`](./packages/renderers/svelte) |
| Vanilla JS | [`@avatune/vanilla`](./packages/renderers/vanilla) |

## Predictors

Train custom TensorFlow.js models or use pre-trained predictors:

| Predictor | Package | Description |
|-----------|---------|-------------|
| Face Detector | [`@avatune/face-detector`](./packages/predictors/face-detector) | Detect faces in images |
| Hair Color Predictor | [`@avatune/hair-color-predictor`](./packages/predictors/hair-color-predictor) | Predict hair color from images |
| Hair Length Predictor | [`@avatune/hair-length-predictor`](./packages/predictors/hair-length-predictor) | Predict hair length from images |
| Skin Tone Predictor | [`@avatune/skin-tone-predictor`](./packages/predictors/skin-tone-predictor) | Predict skin tone from images |

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
import type { ReactAvatarItem } from '@avatune/types'
import { createTheme, fromHead } from '@avatune/theme-builder'
import { percentage } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * percentage('8%'),
  y: size * percentage('3%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

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

See [LICENSE.md](https://github.com/avatune/avatune/blob/main/LICENSE.md) for license information.

## Credits

Design assets are sourced from community creators. See individual theme packages for license and attribution.
