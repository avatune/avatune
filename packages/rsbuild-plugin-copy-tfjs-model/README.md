# @avatune/rsbuild-plugin-copy-tfjs-model

Rsbuild plugin to copy TensorFlow.js models during build.

## Usage

```ts
import { defineConfig } from '@rslib/core'
import { pluginCopyTfjsModel } from '@avatune/rsbuild-plugin-copy-tfjs-model'

export default defineConfig({
  plugins: [
    pluginCopyTfjsModel({
      modelName: 'hair_color',
      outputDir: 'dist/model'
    })
  ],
})
```

## Options

```ts
{
  modelName: string           // Model name (e.g., 'hair_color', 'skin_tone')
  pythonModelsDir?: string    // Custom path to python/models directory
  outputDir?: string          // Output directory (default: 'dist/model')
}
```

## What it does

Copies three model files from `python/models/{modelName}/tfjs/` to the output directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `*.bin` - Model weights

Runs automatically after build via `onAfterBuild` hook.
