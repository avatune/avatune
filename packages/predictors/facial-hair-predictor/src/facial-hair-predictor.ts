import { createFaceDetector } from '@avatune/face-detector'
import type { FacialHairPredictorClass } from '@avatune/types'
import * as tf from '@tensorflow/tfjs'

export type FacialHairResult = {
  facialHair: FacialHairPredictorClass
  confidence: number
  probabilities: Record<FacialHairPredictorClass, number>
  faceDetected: boolean
}

type ModelState = {
  model: tf.LayersModel
  classes: string[]
}

async function loadModel(modelDir: string): Promise<ModelState> {
  const normalizedDir = modelDir.endsWith('/')
    ? modelDir.slice(0, -1)
    : modelDir
  const modelPath = `${normalizedDir}/model.json`

  try {
    // Load model directly from URL - TFJS handles MobileNetV2 nested structure better this way
    const model = await tf.loadLayersModel(modelPath)
    const classes = await loadClasses(normalizedDir)

    return { model, classes }
  } catch (error) {
    console.error('Failed to load model:', error)
    throw new Error(`Failed to load facial hair model: ${error}`)
  }
}

async function loadClasses(modelDir: string): Promise<string[]> {
  try {
    const classesPath = `${modelDir}/classes.json`
    const response = await fetch(classesPath)
    const data = await response.json()
    return data.classes || data
  } catch (error) {
    console.warn('Could not load classes.json, using fallback:', error)
    return ['none', 'facial_hair']
  }
}

function predictFromTensor(
  modelState: ModelState,
  imageTensor: tf.Tensor3D,
  faceDetected: boolean,
): FacialHairResult {
  return tf.tidy(() => {
    const resized = tf.image.resizeBilinear(imageTensor, [128, 128])
    const batched = resized.expandDims(0) as tf.Tensor4D
    const predictions = modelState.model.predict(batched) as tf.Tensor
    const probabilities = predictions.dataSync()

    const maxProbability = Math.max(...Array.from(probabilities))
    const maxIndex = Array.from(probabilities).indexOf(maxProbability)

    const allProbabilities: Record<FacialHairPredictorClass, number> = {
      none: 0,
      facial_hair: 0,
    }
    modelState.classes.forEach((cls, i) => {
      allProbabilities[cls as FacialHairPredictorClass] = probabilities[i]
    })

    return {
      facialHair: modelState.classes[maxIndex] as FacialHairPredictorClass,
      confidence: maxProbability,
      probabilities: allProbabilities,
      faceDetected,
    }
  })
}

function canvasToTensor(canvas: HTMLCanvasElement): tf.Tensor3D {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(canvas)
    return tensor.toFloat().div(255) as tf.Tensor3D
  })
}

export function createFacialHairPredictor(
  modelDir: string = 'https://cdn.jsdelivr.net/npm/@avatune/facial-hair-predictor@1.0.0/dist/model',
) {
  let modelStatePromise: Promise<ModelState> | null = null

  const faceDetector = createFaceDetector()

  return {
    async loadModel(): Promise<void> {
      const promises: Promise<void>[] = []

      if (!modelStatePromise) {
        modelStatePromise = loadModel(modelDir)
        promises.push(modelStatePromise.then(() => {}))
      }

      if (faceDetector) {
        promises.push(faceDetector.load())
      }

      await Promise.all(promises)
    },

    async predict(imageTensor: tf.Tensor3D): Promise<FacialHairResult> {
      if (!modelStatePromise) {
        throw new Error('Model not loaded. Call loadModel() first.')
      }
      const modelState = await modelStatePromise
      return predictFromTensor(modelState, imageTensor, false)
    },

    async predictFromImage(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): Promise<FacialHairResult> {
      if (!modelStatePromise) {
        throw new Error('Model not loaded. Call loadModel() first.')
      }
      const modelState = await modelStatePromise

      let tensorSource:
        | HTMLCanvasElement
        | HTMLImageElement
        | HTMLVideoElement = image
      let faceDetected = false

      if (faceDetector) {
        // Use specialized crop for facial hair (focus on lower face area)
        const croppedFace = await faceDetector.cropFaceForFacialHair(image)
        if (croppedFace) {
          tensorSource = croppedFace
          faceDetected = true
        }
      }

      const tensor =
        tensorSource instanceof HTMLCanvasElement
          ? canvasToTensor(tensorSource)
          : tf.tidy(
              () =>
                tf.browser
                  .fromPixels(tensorSource)
                  .toFloat()
                  .div(255) as tf.Tensor3D,
            )

      try {
        return predictFromTensor(modelState, tensor, faceDetected)
      } finally {
        tensor.dispose()
      }
    },
  }
}
