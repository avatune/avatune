# @avatune/skin-tone-predictor

[![npm version](https://img.shields.io/npm/v/@avatune/skin-tone-predictor)](https://www.npmjs.com/package/@avatune/skin-tone-predictor)
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/skin-tone-predictor)](https://www.npmjs.com/package/@avatune/skin-tone-predictor)

Browser-based skin tone prediction using TensorFlow.js. Predicts ethnicity (7 classes) and maps to skin tone (dark, medium, light).

Uses an ethnicity classifier trained on FairFace dataset, then maps predictions to skin tones for more accurate results.

## Installation

```bash
npm install @avatune/skin-tone-predictor @tensorflow/tfjs
```

## Usage

```ts
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'

// Uses jsDelivr CDN by default - no setup required!
const predictor = createSkinTonePredictor()
await predictor.loadModel()

const result = await predictor.predictFromImage(imageElement)
console.log(result)
// {
//   tone: 'medium',
//   confidence: 0.72,
//   probabilities: { dark: 0.08, medium: 0.72, light: 0.20 },
//   ethnicity: 'indian',
//   ethnicityConfidence: 0.65,
//   faceDetected: true
// }
```

## Model Files

By default, models are loaded from jsDelivr CDN (`https://cdn.jsdelivr.net/npm/@avatune/skin-tone-predictor@1.2.2/dist/model`). No setup required!

### Self-hosting (Optional)

If you prefer to self-host the model files, copy them from `dist/model/` to your public directory:
- `model.json` - Model architecture and weights manifest
- `classes.json` - Class labels
- `group1-shard1of1.bin` - Model weights

Then pass the path to the predictor:

```ts
const predictor = createSkinTonePredictor('/models/skin-tone')
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

## API

### Constructor

```ts
createSkinTonePredictor(modelDir?: string)
```

**Parameters:**
- `modelDir` (optional) - Path to directory containing model files. Defaults to jsDelivr CDN

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
  tone: string                           // Mapped skin tone: 'dark' | 'medium' | 'light'
  confidence: number                     // Skin tone confidence [0, 1]
  probabilities: Record<string, number>  // Aggregated skin tone probabilities
  ethnicity: string                      // Predicted ethnicity class
  ethnicityConfidence: number            // Ethnicity prediction confidence [0, 1]
  faceDetected: boolean                  // Whether a face was detected
}
```

#### `predictFromImage(image): Promise<SkinToneResult>`

Predicts skin tone from an image element. Automatically detects and crops the face for better accuracy.

**Parameters:**
- `image` - `HTMLImageElement`, `HTMLVideoElement`, or `HTMLCanvasElement`

**Returns:** Same as `predict()`, plus `faceDetected: boolean`

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Approach: Ethnicity classification (7 classes) mapped to skin tones (3 classes)
- Training: FairFace dataset
- Ethnicity accuracy: ~79%
- Skin tone accuracy: ~88%
- Format: TensorFlow.js with uint8 quantization

### Why Ethnicity-Based?

Direct skin tone labels are noisy - ITA analysis shows all 3 classes overlap significantly, capping accuracy at ~50%. Ethnicity labels are cleaner and more learnable, then mapped to skin tones:

| Ethnicity       | Skin Tone |
| --------------- | --------- |
| black           | dark      |
| east_asian      | light     |
| indian          | medium    |
| latino_hispanic | medium    |
| middle_eastern  | medium    |
| southeast_asian | medium    |
| white           | light     |

## License

See [LICENSE.md](LICENSE.md) for license information.
