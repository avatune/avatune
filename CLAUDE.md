# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Avatune is a monorepo combining ML-powered avatar analysis with browser-based avatar rendering. It consists of:

1. **Python ML Training** - TensorFlow/Keras models trained on CelebA and FairFace datasets, converted to TensorFlow.js
2. **TypeScript Packages** - Browser-compatible ML predictor packages using TensorFlow.js
3. **Avatar Rendering** - Modern cartoon avatar generation from analysis results
4. **Demo App** - React app showcasing the full pipeline

The workflow: Python trains models → exports to TFJS → TypeScript packages load models → browser inference.

## Architecture

### Monorepo Structure

```
avatune/
├── apps/
│   └── example/          # React demo app (Rsbuild + React 19)
├── packages/
│   ├── hair-color-predictor/    # TFJS browser inference
│   ├── hair-length-predictor/   # TFJS browser inference
│   ├── skin-tone-predictor/     # TFJS browser inference
│   ├── modern-cartoon/          # SVG avatar renderer
│   ├── assets/                  # Shared SVG assets
│   ├── eslint-config/
│   └── typescript-config/
└── python/
    ├── notebooks/        # Marimo notebooks for training
    │   ├── hair_color/
    │   ├── hair_length/
    │   └── skin_tone/
    ├── data/             # Training datasets
    └── models/           # Trained Keras models + TFJS exports
```

### Key Technologies

- **Turborepo** - Monorepo orchestration with caching
- **Bun** - Package manager (specified in package.json)
- **Biome** - Linting and formatting (replaces ESLint/Prettier)
- **Rslib** - Library bundler for packages (dual ESM/CJS)
- **Rsbuild** - App bundler (Rspack-based, faster than Webpack)
- **React 19** - UI framework for demo app
- **TensorFlow.js** - Browser-based ML inference
- **uv** - Python package manager (fast pip alternative)
- **Marimo** - Interactive Python notebooks

## Common Commands

### Root Level

```bash
# Install dependencies
bun install

# Build all packages and apps
bun run build

# Dev mode (all workspaces with watch)
bun run dev

# Lint all workspaces
bun run lint

# Format all code
bun run format

# Type checking
bun run check-types
```

### Workspace-Specific

```bash
# Build single package
turbo build --filter=@avatune/hair-color-predictor

# Dev mode for specific app
turbo dev --filter=modern-cartoon-example

# Run demo app
cd apps/example && bun run dev
```

### Python ML Training

```bash
cd python

# Install Python dependencies (use uv, not pip)
uv pip install -e .

# Run interactive notebook
marimo edit notebooks/hair_color/03_train.py

# Run notebook headless (trains + converts to TFJS)
marimo run notebooks/hair_color/03_train.py
```

Training notebooks automatically convert models to TFJS format at `models/tfjs/{model-name}/`.

## Package Build System

### Predictor Packages

All ML predictor packages (`*-predictor`) use **rslib.config.ts** with:
- Dual format output: ESM + CJS
- Type definitions bundled separately (`dts: { bundle: false }`)
- TensorFlow.js marked as external (peer dependency)
- Node 18+ target syntax

Build output: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`

### Modern Cartoon Package

Uses **rslib.config.ts** with:
- ESM-only output
- SVG handling: inline assets or raw source (via `?raw` query)
- Path aliases: `@assets`, `@src`

### Example App

Uses **rsbuild.config.ts** with React plugin. Hot reload enabled.

## ML Models Pipeline

### Training Flow

1. **Explore** (`01_explore.py`) - Analyze dataset distribution
2. **Prepare** (`02_prepare.py`) - Balance classes, organize images
3. **Train** (`03_train.py`) - Train Keras model + auto-convert to TFJS with uint8 quantization

Output structure:
```
models/
├── {model_name}.keras
├── {model_name}_classes.json
├── {model_name}_history.json
└── tfjs/
    └── {model_name}/
        ├── model.json
        ├── group1-shard1of1.bin
        └── classes.json
```

### TFJS Integration

TypeScript packages load models via:
```typescript
import * as tf from '@tensorflow/tfjs'
await tf.loadLayersModel('path/to/model.json')
```

Models are externalized in rslib builds (not bundled) - users install TFJS as peer dependency.

## Code Style

- **Biome** enforces style (not Prettier/ESLint)
- Single quotes, semicolons optional (ASI)
- Organize imports on save
- CSS modules enabled

Format: `bun run format`

## Dependencies

- **Node**: >=22 (specified in engines)
- **Python**: >=3.12 (pyproject.toml)
- **Bun**: 1.3.1 (packageManager field)

## Testing

No test framework currently configured. Tests should be added to individual packages as needed.

## Key Implementation Details

### Turborepo Tasks

Defined in [turbo.json](turbo.json):
- `build` - Depends on upstream builds, caches `.next/**`
- `dev` - No cache, persistent (long-running servers)
- `lint` - Depends on upstream linting
- `check-types` - Depends on upstream type checking

### Workspace Protocol

All internal dependencies use `workspace:*` protocol for linking (see package.json files).

### Python Paths

Marimo notebooks use relative paths from their location:
- Data: `../../data/` (from `python/notebooks/{topic}/`)
- Models: `../../../models/` (from `python/notebooks/{topic}/`)

## Development Workflow

1. **Training new models**: Work in `python/notebooks/`, run marimo notebooks
2. **Updating predictors**: Models auto-export to `models/tfjs/`, copy to package assets if needed
3. **Building packages**: Run `turbo build` from root (handles dependencies)
4. **Testing changes**: Run demo app with `turbo dev --filter=modern-cartoon-example`
5. **Adding features**: Create branches, use Turborepo caching for fast rebuilds
