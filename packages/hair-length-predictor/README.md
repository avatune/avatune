# @avatune/hair-length-predictor

Browser-based hair length prediction using TensorFlow.js. Classifies hair into 3 categories: short, medium, long.

Tiny model (~110KB) with blazingly fast loading and inference in the browser.

## Installation

```bash
npm install @avatune/hair-length-predictor @tensorflow/tfjs
```

## Model Files

The predictor requires TFJS model files to be publicly accessible. Three files must exist in the same directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `group1-shard1of1.bin` - Model weights

### Getting the Model

The model files are bundled in this package at `dist/model/`. Copy them to your public directory.

Source models are available at `python/models/hair_length/tfjs/` in the monorepo.

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
        const srcDir = join(__dirname, 'node_modules', '@avatune', 'hair-length-predictor', 'dist', 'model')
        const destDir = join(__dirname, 'public', 'models', 'hair-length')

        mkdirSync(destDir, { recursive: true })

        copyFileSync(join(srcDir, 'model.json'), join(destDir, 'model.json'))
        copyFileSync(join(srcDir, 'classes.json'), join(destDir, 'classes.json'))

        const files = readdirSync(srcDir)
        for (const file of files) {
          if (file.endsWith('.bin')) {
            copyFileSync(join(srcDir, file), join(destDir, file))
          }
        }

        console.log('✓ Copied hair-length model to public/models')
      },
    },
  ],
})
```

See [apps/predictor-storybook/.storybook/vite.config.ts](../../apps/predictor-storybook/.storybook/vite.config.ts) for a working example.

## Usage

```ts
import { HairLengthPredictor } from '@avatune/hair-length-predictor'
import * as tf from '@tensorflow/tfjs'

const predictor = new HairLengthPredictor('/models/hair-length')
await predictor.loadModel()

// Create image tensor (normalized to [0, 1])
const imageTensor = tf.browser.fromPixels(imageElement).div(255)

const result = await predictor.predict(imageTensor)
console.log(result)
// {
//   length: 'medium',
//   confidence: 0.91,
//   probabilities: { short: 0.04, medium: 0.91, long: 0.05 }
// }
```

## API

### Constructor

```ts
new HairLengthPredictor(modelDir: string)
```

**Parameters:**
- `modelDir` - Path to directory containing model files (relative to public directory)

### Methods

#### `loadModel(): Promise<void>`

Loads the TFJS model and class labels. Call this once before making predictions.

#### `predict(imageTensor: tf.Tensor3D): Promise<HairLengthResult>`

Predicts hair length from an image tensor.

**Parameters:**
- `imageTensor` - Normalized RGB image tensor [H, W, 3] with values in range [0, 1]

**Returns:**
```ts
{
  length: string       // Predicted class: 'short' | 'medium' | 'long'
  confidence: number   // Confidence score [0, 1]
  probabilities: Record<string, number>  // Scores for all classes
}
```

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Classes: 3 (short, medium, long)
- Training: CelebAMask-HQ dataset
- Accuracy: ~82%
- Model size: ~110KB (uint8 quantized)
- Format: TensorFlow.js with uint8 quantization

## License

See monorepo root for license information.
