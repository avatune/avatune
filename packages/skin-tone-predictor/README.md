# @avatune/skin-tone-predictor

Browser-based skin tone prediction using TensorFlow.js. Predicts ethnicity (7 classes) and maps to skin tone (dark, medium, light).

Uses an ethnicity classifier trained on FairFace dataset, then maps predictions to skin tones for more accurate results.

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

Source models are available at `python/models/ethnicity/tfjs/` in the monorepo.

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
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
import * as tf from '@tensorflow/tfjs'

const predictor = createSkinTonePredictor('/models/skin-tone')
await predictor.loadModel()

// Create image tensor (normalized to [0, 1])
const imageTensor = tf.browser.fromPixels(imageElement).div(255)

const result = await predictor.predict(imageTensor)
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

## API

### Constructor

```ts
createSkinTonePredictor(modelDir: string)
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
  tone: string                           // Mapped skin tone: 'dark' | 'medium' | 'light'
  confidence: number                     // Skin tone confidence [0, 1]
  probabilities: Record<string, number>  // Aggregated skin tone probabilities
  ethnicity: string                      // Predicted ethnicity class
  ethnicityConfidence: number            // Ethnicity prediction confidence [0, 1]
  faceDetected: boolean                  // Whether a face was detected
}
```

## Model Details

- Architecture: MobileNetV2-based CNN
- Input: 128x128 RGB images
- Model classes: 7 ethnicities (black, east_asian, indian, latino_hispanic, middle_eastern, southeast_asian, white)
- Output: Mapped to 3 skin tones (dark, medium, light)
- Training: FairFace dataset
- Format: TensorFlow.js with uint8 quantization

### Ethnicity to Skin Tone Mapping

| Ethnicity        | Skin Tone |
| ---------------- | --------- |
| black            | dark      |
| east_asian       | light     |
| indian           | medium    |
| latino_hispanic  | medium    |
| middle_eastern   | medium    |
| southeast_asian  | medium    |
| white            | light     |

## License

See [LICENSE.md](LICENSE.md) for license information.
