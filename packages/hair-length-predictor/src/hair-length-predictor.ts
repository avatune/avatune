import { createFaceDetector } from '@avatune/face-detector'
import type { HairLengthPredictorClass } from '@avatune/types'
import * as tf from '@tensorflow/tfjs'

export type HairLengthResult = {
  length: HairLengthPredictorClass
  confidence: number
  probabilities: Record<HairLengthPredictorClass, number>
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
    console.error('Failed to load hair length model:', error)
    throw new Error(`Failed to load hair length model: ${error}`)
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
    return ['short', 'medium', 'long']
  }
}

function predictFromTensor(
  modelState: ModelState,
  imageTensor: tf.Tensor3D,
  faceDetected: boolean,
): HairLengthResult {
  return tf.tidy(() => {
    const resized = tf.image.resizeBilinear(imageTensor, [128, 128])
    const batched = resized.expandDims(0) as tf.Tensor4D
    const predictions = modelState.model.predict(batched) as tf.Tensor
    const probabilities = predictions.dataSync()

    const maxProbability = Math.max(...Array.from(probabilities))
    const maxIndex = Array.from(probabilities).indexOf(maxProbability)

    const allProbabilities: Record<HairLengthPredictorClass, number> = {
      short: 0,
      medium: 0,
      long: 0,
    }
    modelState.classes.forEach((length, i) => {
      allProbabilities[length as HairLengthPredictorClass] = probabilities[i]
    })

    return {
      length: modelState.classes[maxIndex] as HairLengthPredictorClass,
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

export function createHairLengthPredictor(modelDir: string) {
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

    async predict(imageTensor: tf.Tensor3D): Promise<HairLengthResult> {
      if (!modelStatePromise) {
        throw new Error('Model not loaded. Call loadModel() first.')
      }
      const modelState = await modelStatePromise
      return predictFromTensor(modelState, imageTensor, false)
    },

    async predictFromImage(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): Promise<HairLengthResult> {
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
        const croppedFace = await faceDetector.cropFaceWithHair(image)
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
