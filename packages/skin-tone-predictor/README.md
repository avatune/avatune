# @avatune/skin-tone-predictor

Browser-based skin tone prediction using TensorFlow.js. Classifies skin tone into 4 categories: dark, medium, light, very_light.

Tiny model (~110KB) with blazingly fast loading and inference in the browser.

## Installation

```bash
npm install @avatune/skin-tone-predictor @tensorflow/tfjs
```

## Model Files

The predictor requires TFJS model files to be publicly accessible. Three files must exist in the same directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `group1-shard1of1.bin` - Model weights

### Getting the Model

The model files are bundled in this package at `dist/model/`. Copy them to your public directory.

Source models are available at `python/models/skin_tone/tfjs/` in the monorepo.

### Setup with Vite

```ts
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'copy-tfjs-models',
      buildStart() {
        const srcDir = join(__dirname, 'node_modules', '@avatune', 'skin-tone-predictor', 'dist', 'model')
        const destDir = join(__dirname, 'public', 'models', 'skin-tone')

        mkdirSync(destDir, { recursive: true })

        copyFileSync(join(srcDir, 'model.json'), join(destDir, 'model.json'))
        copyFileSync(join(srcDir, 'classes.json'), join(destDir, 'classes.json'))

        const files = readdirSync(srcDir)
        for (const file of files) {
          if (file.endsWith('.bin')) {
            copyFileSync(join(srcDir, file), join(destDir, file))
          }
        }

        console.log('✓ Copied skin-tone model to public/models')
      },
    },
  ],
})
```

See [apps/predictor-storybook/.storybook/vite.config.ts](../../apps/predictor-storybook/.storybook/vite.config.ts) for a working example.

## Usage

```ts
import { SkinTonePredictor } from '@avatune/skin-tone-predictor'
import * as tf from '@tensorflow/tfjs'

const predictor = new SkinTonePredictor('/models/skin-tone')
await predictor.loadModel()

// Create image tensor (normalized to [0, 1])
const imageTensor = tf.browser.fromPixels(imageElement).div(255)

const result = await predictor.predict(imageTensor)
console.log(result)
// {
//   tone: 'medium',
//   confidence: 0.84,
//   probabilities: { dark: 0.08, medium: 0.84, light: 0.06, very_light: 0.02 }
// }
```

## API

### Constructor

```ts
new SkinTonePredictor(modelDir: string)
```

**Parameters:**
- `modelDir` - Path to directory containing model files (relative to public directory)

### Methods

#### `loadModel(): Promise<void>`

Loads the TFJS model and class labels. Call this once before making predictions.

#### `predict(imageTensor: tf.Tensor3D): Promise<SkinToneResult>`

Predicts skin tone from an image tensor.

**Parameters:**
- `imageTensor` - Normalized RGB image tensor [H, W, 3] with values in range [0, 1]

**Returns:**
```ts
{
  tone: string         // Predicted class: 'dark' | 'medium' | 'light' | 'very_light'
  confidence: number   // Confidence score [0, 1]
  probabilities: Record<string, number>  // Scores for all classes
}
```

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Classes: 4 (dark, medium, light, very_light)
- Training: FairFace dataset
- Accuracy: ~68%
- Model size: ~110KB (uint8 quantized)
- Format: TensorFlow.js with uint8 quantization

## License

See monorepo root for license information.
