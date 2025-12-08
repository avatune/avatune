import {
  createFaceDetector,
  type FaceDetectorOptions,
} from '@avatune/face-detector'
import type { SkinTonePredictorClass } from '@avatune/types'
import * as tf from '@tensorflow/tfjs'

type EthnicityClass =
  | 'black'
  | 'east_asian'
  | 'indian'
  | 'latino_hispanic'
  | 'middle_eastern'
  | 'southeast_asian'
  | 'white'

const ETHNICITY_TO_SKIN_TONE: Record<EthnicityClass, SkinTonePredictorClass> = {
  black: 'dark',
  east_asian: 'light',
  indian: 'medium',
  latino_hispanic: 'medium',
  middle_eastern: 'medium',
  southeast_asian: 'medium',
  white: 'light',
}

export type SkinToneResult = {
  tone: SkinTonePredictorClass
  confidence: number
  probabilities: Record<SkinTonePredictorClass, number>
  ethnicity: EthnicityClass
  ethnicityConfidence: number
  faceDetected: boolean
}

export type SkinTonePredictorOptions = {
  modelDir: string
  faceDetection?: boolean | FaceDetectorOptions
}

type ModelState = {
  model: tf.LayersModel
  classes: EthnicityClass[]
}

async function loadModel(modelDir: string): Promise<ModelState> {
  const normalizedDir = modelDir.endsWith('/')
    ? modelDir.slice(0, -1)
    : modelDir
  const modelPath = `${normalizedDir}/model.json`

  try {
    const response = await fetch(modelPath)
    const modelJSON = await response.json()

    if (
      modelJSON.modelTopology?.model_config?.config?.layers?.[0]?.class_name ===
      'InputLayer'
    ) {
      const inputLayer = modelJSON.modelTopology.model_config.config.layers[0]
      if (inputLayer.config.batch_shape) {
        const batchShape = inputLayer.config.batch_shape
        inputLayer.config.inputShape = batchShape.slice(1)
        delete inputLayer.config.batch_shape
      }
    }

    const weightsManifest = modelJSON.weightsManifest
    const weightsPath = `${normalizedDir}/${weightsManifest[0].paths[0]}`
    const weightsResponse = await fetch(weightsPath)
    const weightsData = await weightsResponse.arrayBuffer()

    const model = await tf.loadLayersModel(
      tf.io.fromMemory({
        modelTopology: modelJSON.modelTopology,
        weightSpecs: weightsManifest[0].weights,
        weightData: weightsData,
      }),
    )

    const classes = await loadClasses(normalizedDir)

    return { model, classes }
  } catch (error) {
    console.error('Failed to load skin tone model:', error)
    throw new Error(`Failed to load skin tone model: ${error}`)
  }
}

async function loadClasses(modelDir: string): Promise<EthnicityClass[]> {
  try {
    const classesPath = `${modelDir}/classes.json`
    const response = await fetch(classesPath)
    const data = await response.json()
    return data.classes || data
  } catch (error) {
    console.warn('Could not load classes.json, using fallback:', error)
    return [
      'black',
      'east_asian',
      'indian',
      'latino_hispanic',
      'middle_eastern',
      'southeast_asian',
      'white',
    ]
  }
}

function predictFromTensor(
  modelState: ModelState,
  imageTensor: tf.Tensor3D,
  faceDetected: boolean,
): SkinToneResult {
  return tf.tidy(() => {
    const resized = tf.image.resizeBilinear(imageTensor, [128, 128])
    const batched = resized.expandDims(0) as tf.Tensor4D
    const predictions = modelState.model.predict(batched) as tf.Tensor
    const probabilities = predictions.dataSync()

    const maxProbability = Math.max(...Array.from(probabilities))
    const maxIndex = Array.from(probabilities).indexOf(maxProbability)
    const predictedEthnicity = modelState.classes[maxIndex]

    const skinToneProbabilities: Record<SkinTonePredictorClass, number> = {
      dark: 0,
      medium: 0,
      light: 0,
    }

    modelState.classes.forEach((ethnicity, i) => {
      const skinTone = ETHNICITY_TO_SKIN_TONE[ethnicity]
      skinToneProbabilities[skinTone] += probabilities[i]
    })

    const predictedSkinTone = ETHNICITY_TO_SKIN_TONE[predictedEthnicity]
    const skinToneConfidence = skinToneProbabilities[predictedSkinTone]

    return {
      tone: predictedSkinTone,
      confidence: skinToneConfidence,
      probabilities: skinToneProbabilities,
      ethnicity: predictedEthnicity,
      ethnicityConfidence: maxProbability,
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

export function createSkinTonePredictor(
  modelDir: string = 'https://cdn.jsdelivr.net/npm/@avatune/skin-tone-predictor@1.2.2/dist/model',
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

    async predict(imageTensor: tf.Tensor3D): Promise<SkinToneResult> {
      if (!modelStatePromise) {
        throw new Error('Model not loaded. Call loadModel() first.')
      }
      const modelState = await modelStatePromise
      return predictFromTensor(modelState, imageTensor, false)
    },

    async predictFromImage(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): Promise<SkinToneResult> {
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
        const croppedFace = await faceDetector.cropFace(image, 0.25)
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
