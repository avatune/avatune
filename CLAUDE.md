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
├── apps/                             # Example applications
│   ├── *-storybook/                  # Storybook demo apps
│   └── storybook-root                # Storybook root to ref all the *-storybook demo apps
├── packages/                         # Reusable packages
│   ├── *-predictor/                  # TFJS browser inference packages
│   ├── *-assets/                     # SVG assets bundled for all supported platforms (React, Vue, Svelte, Vanilla)
│   ├── *-theme/                      # Themes to be used by the platform renderers to visualize an avatar
│   ├── (svelte|react|vue|vanilla)/   # Avatar platform renderers
│   │── types                         # Types shared across other packages
│   │── utils                         # Utils shared across other packages
│   │── rsbuild-plugin-*              # Plugins shared across other packages built with Rsbuild
│   └── typescript-config/            # Shared TS configs to extend in the other monorepo packages
└── python/                           # ML training pipeline
    ├── notebooks/                    # Marimo notebooks for training
    │   ├── hair_color/
    │   ├── hair_length/
    │   └── skin_tone/
    ├── data/                         # Training datasets (gitignored)
    └── models/                       # Trained Keras models + TFJS exports
```

### Key Technologies

- **Turborepo** - Monorepo orchestration with caching
- **Bun** - Package manager (specified in package.json)
- **Biome** - Linting and formatting (replaces ESLint/Prettier)
- **Rslib** - Library bundler for packages (dual ESM/CJS)
- **Rsbuild** - App bundler (Rspack-based, faster than Webpack)
- **Storybook** - Library to show for demos
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
bun dev

# Storybook (run all storybooks and the root one waiting for the others)
bun storybook

# Lint all workspaces
bun lint

# Format all code
bun format

# Type checking
bun run check-types
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

Training notebooks automatically convert models to TFJS format at `models/tfjs/{model_name}/`.

## ML Models Pipeline

### Models Overview

All models follow a consistent structure:
- **Classes**: 3-4 categories per model
- **Input**: 128x128 RGB images, normalized to [0, 1]
- **Architecture**: MobileNetV2-based CNNs
- **Format**: TensorFlow.js (quantized to uint8 for smaller size)
- **Location**: `python/models/<model_name>/tfjs/`

Current models include hair color, skin tone, and hair length predictors. Check `python/models/` for the complete list.

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

Predictor packages export classes with `loadModel()` and `predict()` methods:

- Models are externalized in rslib builds (not bundled)
- TensorFlow.js is a peer dependency
- Model paths resolved via `getModelPath()` utility in each package
- Default base path: `/models` (configurable via `globalThis.__TFJS_MODEL_BASE_URL__`)

## Code Style

- **Biome** enforces style (not Prettier/ESLint)
- Single quotes, semicolons optional (ASI)
- Organize imports on save
- CSS modules enabled
- Do not add obvious comments

Format: `bun run format`

## Dependencies

- **Node**: >=22 (specified in engines)
- **Python**: >=3.12 (pyproject.toml)
- **Bun**: 1.3.1 (packageManager field)

## Testing

No test framework currently configured. Tests should be added to individual packages as needed.

## Key Implementation Details

### Workspace Protocol

All internal dependencies use `workspace:*` protocol for linking.

### Python Paths

Marimo notebooks use relative paths from their location to access `../../data/` and `../../../models/`.

### Model Integration

Example apps use Rspack plugins to automatically copy models from `python/models/` during build. No manual copying required.

## Development Workflow

1. **Training new models**: Work in `python/notebooks/`, run marimo notebooks, models auto-export to TFJS
2. **Building packages**: Run `bun run build` from root (handles all dependencies via Turborepo)
3. **Testing changes**: Run any example app with `bun run dev` (models copied automatically)
4. **Adding features**: Create feature branches, Turborepo caching ensures fast rebuilds
5. **Working with models**: Predictor packages automatically resolve model paths - no config needed
