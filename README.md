# Avatune

<p align="center">

[![DeepWiki](https://img.shields.io/badge/DeepWiki-avatune%2Favatune-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/avatune/avatune)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release Packages](https://github.com/avatune/avatune/actions/workflows/release-packages.yml/badge.svg)](https://github.com/avatune/avatune/actions/workflows/release-packages.yml)
[![Deploy Worker](https://github.com/avatune/avatune/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/avatune/avatune/actions/workflows/deploy-worker.yml)

</p>

<p align="center">
<img src="https://github.com/avatune/avatune/blob/main/assets/logo.png?raw=true" alt="Avatune Logo" width="300" />
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

### Install Theme and Renderer

```bash
npm install @avatune/pacovqzz-theme @avatune/react
# or
yarn add @avatune/fatin-verse-theme @avatune/react
# or
pnpm add @avatune/micah-theme @avatune/react
```

### Use Native SVG Components

<p align="center">
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-1.svg" alt="Preview #1" />
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-2.svg" alt="Preview #2" />
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-3.svg" alt="Preview #3" />
</p>

```tsx
import { Avatar } from '@avatune/react'
import pacovqzz from '@avatune/pacovqzz-theme/react'
import fatinverse from '@avatune/fatin-verse-theme/react'
import micah from '@avatune/micah-theme/react'

function App() {
  return (
    <div className="flex justify-between items-center">
      <Avatar theme={pacovqzz} seed="seed" size={200} />
      <Avatar theme={fatinverse} seed="seed" size={200} />
      <Avatar theme={micah} seed="seed" size={200} />
    </div>
  )
}
```

## Available Themes

All themes support React, Vue, Svelte, and Vanilla JavaScript.

| Theme | Package |
|-------|---------|
| Ashley Seo | [`@avatune/ashley-seo-theme`](./packages/themes/ashley-seo-theme) |
| Fatin Verse | [`@avatune/fatin-verse-theme`](./packages/themes/fatin-verse-theme) |
| Kyute | [`@avatune/kyute-theme`](./packages/themes/kyute-theme) |
| Micah | [`@avatune/micah-theme`](./packages/themes/micah-theme) |
| Miniavs | [`@avatune/miniavs-theme`](./packages/themes/miniavs-theme) |
| Nevmstas | [`@avatune/nevmstas-theme`](./packages/themes/nevmstas-theme) |
| Pacovqzz | [`@avatune/pacovqzz-theme`](./packages/themes/pacovqzz-theme) |
| Pawel Olek Man | [`@avatune/pawel-olek-man-theme`](./packages/themes/pawel-olek-man-theme) |
| Pawel Olek Woman | [`@avatune/pawel-olek-woman-theme`](./packages/themes/pawel-olek-woman-theme) |
| Yanliu | [`@avatune/yanliu-theme`](./packages/themes/yanliu-theme) |

## Framework Renderers

| Framework | Package |
|-----------|---------|
| Angular | [`@avatune/angular`](./packages/renderers/angular) |
| Solidjs | [`@avatune/solidjs`](./packages/renderers/solidjs) |
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
| Facial Hair Predictor | [`@avatune/facial-hair-predictor`](./packages/predictors/facial-hair-predictor) | ML predictor |
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
