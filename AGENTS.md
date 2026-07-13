## Project Overview

Avatune is a monorepo combining ML-powered avatar analysis with browser-based avatar rendering. It consists of:

1. **Python ML Training** - TensorFlow/Keras models trained on CelebA and FairFace datasets, converted to TensorFlow.js
2. **TypeScript Packages** - Browser-compatible ML predictor packages using TensorFlow.js
3. **Avatar Rendering** - Avatar generation from analysis results

The workflow: Python trains models → exports to TFJS → TypeScript packages load models → browser inference.

## Architecture

### Monorepo Structure

```
avatune/
├── apps/                                    # Applications
│   ├── website/                             # Documentation website (Astro)
│   ├── cloudflare-worker/                   # Cloudflare Worker API
│   ├── RNStorybook/                         # React Native Storybook
│   ├── react-storybook/                     # React Storybook
│   ├── svelte-storybook/                    # Svelte Storybook
│   ├── vue-storybook/                       # Vue Storybook
│   ├── vanilla-storybook/                   # Vanilla JS Storybook
│   ├── predictor-storybook/                 # ML Predictor demos
│   ├── studio/                              # Theme creation studio
│   └── storybook-root/                      # Root Storybook aggregator
├── packages/
│   ├── assets/                              # SVG assets per theme
│   │   ├── ashley-seo-assets/
│   │   ├── fatin-verse-assets/
│   │   ├── kyute-assets/
│   │   ├── micah-assets/
│   │   ├── miniavs-assets/
│   │   ├── nevmstas-assets/
│   │   ├── pacovqzz-assets/
│   │   ├── pawel-olek-assets/
│   │   └── yanliu-assets/
│   ├── themes/                              # Theme configurations
│   │   ├── ashley-seo-theme/
│   │   ├── fatin-verse-theme/
│   │   ├── kyute-theme/
│   │   ├── micah-theme/
│   │   ├── miniavs-theme/
│   │   ├── nevmstas-theme/
│   │   ├── pacovqzz-theme/
│   │   ├── pawel-olek-man-theme/
│   │   ├── pawel-olek-woman-theme/
│   │   └── yanliu-theme/
│   ├── renderers/                           # Platform-specific renderers
│   │   ├── react/
│   │   ├── react-native/
│   │   ├── solidjs/
│   │   ├── svelte/
│   │   ├── vue/
│   │   └── vanilla/
│   ├── predictors/                          # ML prediction packages
│   │   ├── face-detector/
│   │   ├── hair-color-predictor/
│   │   ├── hair-length-predictor/
│   │   └── skin-tone-predictor/
│   ├── core/                                # Shared core packages
│   │   ├── types/                           # TypeScript types
│   │   ├── utils/                           # Shared utilities
│   │   ├── theme-builder/                   # Theme builder API
│   │   ├── api-client/                      # API client
│   │   └── typescript-config/               # Shared TS configs
│   └── rsbuild-plugins/                     # Build plugins
│       ├── rsbuild-plugin-copy-tfjs-model/
│       ├── rsbuild-plugin-raw-svg/
│       ├── rsbuild-plugin-svg-to-solid/
│       ├── rsbuild-plugin-svg-to-svelte/
│       └── rsbuild-plugin-svg-to-vue/
├── scripts/                                 # Build/generation scripts
│   ├── generate-assets.ts                   # Generate asset entrypoints
│   ├── generate-theme.ts                    # Scaffold new themes
│   ├── generate-stories.ts                  # Generate Storybook stories
│   ├── generate-assets-readme.ts            # Generate asset READMEs
│   ├── generate-assets-theme-readme.ts      # Generate theme READMEs
│   ├── generate-themes-mdx.ts               # Generate theme docs
│   ├── generate-root-readme.ts              # Generate root README
│   └── shared.ts                            # Shared script utilities
└── python/                                  # ML training pipeline
    ├── notebooks/                           # Marimo notebooks
    │   ├── hair_color/
    │   ├── hair_length/
    │   └── skin_tone/
    ├── data/                                # Training datasets (gitignored)
    └── models/                              # Trained models + TFJS exports
```

### Key Technologies

- **Turborepo** - Monorepo orchestration with caching
- **Bun** - Package manager (specified in package.json)
- **Biome** - Linting and formatting (replaces ESLint/Prettier)
- **Rslib** - Library bundler for packages (dual ESM/CJS)
- **Rsbuild** - App bundler (Rspack-based, faster than Webpack)
- **Storybook** - Component demos
- **TensorFlow.js** - Browser-based ML inference
- **uv** - Python package manager (fast pip alternative)
- **Marimo** - Interactive Python notebooks
- **Astro** - Documentation website

## Common Commands

### Root Level

```bash
bun install              # Install dependencies
bun run build            # Build all packages and apps
bun dev                  # Dev mode (all workspaces with watch)
bun storybook            # Run all storybooks
bun lint                 # Lint all workspaces
bun format               # Format all code
bun run check-types      # Type checking
```

### Scripts

```bash
# Generate asset entrypoints from SVG files
bun scripts/generate-assets.ts <assets-package-name>
# Example: bun scripts/generate-assets.ts kyute-assets

# Scaffold a new theme from assets package
bun scripts/generate-theme.ts <theme-name>
# Example: bun scripts/generate-theme.ts kyute-theme

# Generate Storybook stories
bun scripts/generate-stories.ts <theme-name>
```

### Python ML Training

```bash
cd python
uv pip install -e .                              # Install dependencies
marimo edit notebooks/hair_color/03_train.py     # Interactive notebook
marimo run notebooks/hair_color/03_train.py      # Headless training
```

## Package Relationships

### Assets → Theme → Renderer Flow

1. **Assets packages** (`@avatune/*-assets`) contain SVG files organized by category
2. **Theme packages** (`@avatune/*-theme`) define positions, layers, colors, and link to assets
3. **Renderer packages** (`@avatune/react`, etc.) render avatars using themes

### Theme Structure

Each theme has:
- `colors.ts` - Color enums (SkinTones, HairColors, AccentColors, BackgroundColors)
- `shared.ts` - Base theme config (positions, layers, colors, items)
- `react.ts`, `vue.ts`, `svelte.ts`, `solidjs.ts`, `vanilla.ts`, `react-native.ts` - Framework bindings
- `index.ts` - Barrel exports

### Theme Builder API

```typescript
import { createTheme, fromHead } from '@avatune/theme-builder'

createTheme()
  .withStyle({ size: 400, borderRadius: '100%' })
  .addColors('head', [SkinTones.Light, SkinTones.Medium])
  .addColors('hair', [HairColors.Black, HairColors.Brown])
  .connectColors('head', ['ears'])           // ears uses head's color
  .setOptional('glasses')                    // adds 'none' option
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .build()
```

### SSR Support

**SolidJS**: Assets and renderer ship uncompiled `.jsx` files under the `"solid"` export condition. `vite-plugin-solid` + `vitefu` detect this and compile JSX with the correct `generate` mode (`dom` for client, `ssr` for server) — standard Solid ecosystem convention (Kobalte, Corvu). `pluginSvgToSolidJsx` generates `dist/solid.jsx` as a post-build step; the renderer uses esbuild (`jsx: 'preserve'`) to produce `dist/index.jsx`. Theme solidjs entries have no JSX, so `dist/solidjs.js` works directly.

**Svelte**: Assets ship compiled `.svelte` component files under the `"svelte"` export condition (`dist/svelte/index.js`). SvelteKit resolves this condition and handles SSR natively since Svelte components compile to both DOM and SSR output. The `pluginSvgToSvelte` plugin with `emitSvelteFiles` generates these files during build.

## ML Models Pipeline

### Models Overview

- **Input**: 128x128 RGB images, normalized to [0, 1]
- **Architecture**: MobileNetV2-based CNNs
- **Format**: TensorFlow.js (quantized to uint8)
- **Location**: `python/models/<model_name>/tfjs/`

### Training Flow

1. `01_explore.py` - Analyze dataset distribution
2. `02_prepare.py` - Balance classes, organize images
3. `03_train.py` - Train Keras model + auto-convert to TFJS

### TFJS Integration

Predictor packages export classes with `loadModel()` and `predict()` methods. Default model path: `/models` (configurable via `globalThis.__TFJS_MODEL_BASE_URL__`).

## Code Style

- **Biome** enforces style (not Prettier/ESLint)
- Single quotes, semicolons optional (ASI)
- Organize imports on save
- Do not add obvious comments

## Dependencies

- **Node**: >=22
- **Python**: >=3.12
- **Bun**: 1.3.1

## Development Workflow

1. **New assets**: Add SVGs to `packages/assets/<name>-assets/src/svg/<category>/`, run `bun scripts/generate-assets.ts <name>-assets`
2. **New theme**: Run `bun scripts/generate-theme.ts <name>-theme`, customize colors and positions
3. **Building**: `bun run build` from root (Turborepo handles dependencies)
4. **Testing**: Run storybook apps with `bun run dev` in respective app folder
5. **Models**: Train in `python/notebooks/`, auto-exported to TFJS format
