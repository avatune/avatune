# @avatune/hair-color-predictor

[![npm version](https://img.shields.io/npm/v/@avatune/hair-color-predictor)](https://www.npmjs.com/package/@avatune/hair-color-predictor)
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/hair-color-predictor)](https://www.npmjs.com/package/@avatune/hair-color-predictor)

Browser-based hair color prediction using TensorFlow.js. Classifies hair into 4 categories: black, brown, blond, gray.

Tiny model (~110KB) with blazingly fast loading and inference in the browser.

## Installation

```bash
npm install @avatune/hair-color-predictor @tensorflow/tfjs
```

## Usage

```ts
import { createHairColorPredictor } from '@avatune/hair-color-predictor'

// Uses jsDelivr CDN by default - no setup required!
const predictor = createHairColorPredictor()
await predictor.loadModel()

const result = await predictor.predictFromImage(imageElement)
console.log(result)
// {
//   color: 'brown',
//   confidence: 0.87,
//   probabilities: { black: 0.05, brown: 0.87, blond: 0.06, gray: 0.02 },
//   faceDetected: true
// }
```

## Model Files

By default, models are loaded from jsDelivr CDN (`https://cdn.jsdelivr.net/npm/@avatune/hair-color-predictor@1.2.2/dist/model`). No setup required!

### Self-hosting (Optional)

If you prefer to self-host the model files, copy them from `dist/model/` to your public directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `group1-shard1of1.bin` - Model weights

Then pass the path to the predictor:

```ts
const predictor = createHairColorPredictor('/models/hair-color')
```

### Setup with Vite (Optional)

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

## API

### Structure

```ts
createHairColorPredictor(modelDir?: string)
```

**Parameters:**
- `modelDir` (optional) - Path to directory containing model files. Defaults to jsDelivr CDN

### Functions

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

#### `predictFromImage(image): Promise<HairColorResult>`

Predicts hair color from an image element. Automatically detects and crops the face for better accuracy.

**Parameters:**
- `image` - `HTMLImageElement`, `HTMLVideoElement`, or `HTMLCanvasElement`

**Returns:** Same as `predict()`, plus `faceDetected: boolean`

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Classes: 4 (black, brown, blond, gray)
- Training: CelebA dataset
- Accuracy: ~79%
- Format: TensorFlow.js with uint8 quantization

## License

See [LICENSE.md](LICENSE.md) for license information.
