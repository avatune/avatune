# @avatune/hair-color-predictor

Browser-based hair color prediction using TensorFlow.js. Classifies hair into 4 categories: black, brown, blond, gray.

Tiny model (~110KB) with blazingly fast loading and inference in the browser.

## Installation

```bash
npm install @avatune/hair-color-predictor @tensorflow/tfjs
```

## Model Files

The predictor requires TFJS model files to be publicly accessible. Three files must exist in the same directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `group1-shard1of1.bin` - Model weights

### Getting the Model

The model files are bundled in this package at `dist/model/`. Copy them to your public directory.

Source models are available at `python/models/hair_color/tfjs/` in the monorepo.

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
        const srcDir = join(__dirname, 'node_modules', '@avatune', 'hair-color-predictor', 'dist', 'model')
        const destDir = join(__dirname, 'public', 'models', 'hair-color')

        mkdirSync(destDir, { recursive: true })

        copyFileSync(join(srcDir, 'model.json'), join(destDir, 'model.json'))
        copyFileSync(join(srcDir, 'classes.json'), join(destDir, 'classes.json'))

        const files = readdirSync(srcDir)
        for (const file of files) {
          if (file.endsWith('.bin')) {
            copyFileSync(join(srcDir, file), join(destDir, file))
          }
        }

        console.log('✓ Copied hair-color model to public/models')
      },
    },
  ],
})
```

See [apps/predictor-storybook/.storybook/vite.config.ts](../../apps/predictor-storybook/.storybook/vite.config.ts) for a working example.

## Usage

```ts
import { HairColorPredictor } from '@avatune/hair-color-predictor'
import * as tf from '@tensorflow/tfjs'

const predictor = new HairColorPredictor('/models/hair-color')
await predictor.loadModel()

// Create image tensor (normalized to [0, 1])
const imageTensor = tf.browser.fromPixels(imageElement).div(255)

const result = await predictor.predict(imageTensor)
console.log(result)
// {
//   color: 'brown',
//   confidence: 0.87,
//   probabilities: { black: 0.05, brown: 0.87, blond: 0.06, gray: 0.02 }
// }
```

## API

### Constructor

```ts
new HairColorPredictor(modelDir: string)
```

**Parameters:**
- `modelDir` - Path to directory containing model files (relative to public directory)

### Methods

#### `loadModel(): Promise<void>`

Loads the TFJS model and class labels. Call this once before making predictions.

#### `predict(imageTensor: tf.Tensor3D): Promise<HairColorResult>`

Predicts hair color from an image tensor.

**Parameters:**
- `imageTensor` - Normalized RGB image tensor [H, W, 3] with values in range [0, 1]

**Returns:**
```ts
{
  color: string        // Predicted class: 'black' | 'brown' | 'blond' | 'gray'
  confidence: number   // Confidence score [0, 1]
  probabilities: Record<string, number>  // Scores for all classes
}
```

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Classes: 4 (black, brown, blond, gray)
- Training: CelebA dataset
- Accuracy: ~79%
- Model size: ~110KB (uint8 quantized)
- Format: TensorFlow.js with uint8 quantization

## License

See monorepo root for license information.
