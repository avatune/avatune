import * as tf from '@tensorflow/tfjs'
import { getClassesPath, getModelPath } from './utils'

export type HairLengthResult = {
  length: string
  confidence: number
  probabilities: Record<string, number>
}

/**
 * Hair length prediction from face image
 * Analyzes image to determine hair length category
 */
export class HairLengthPrediction {
  private model: tf.LayersModel | null
  private classes: string[]

  constructor() {
    this.model = null
    this.classes = []
  }

  /**
   * Load the TensorFlow.js model and classes
   * Uses path resolution to work in both development and production
   */
  async loadModel() {
    if (this.model) {
      return
    }

    const modelPath = getModelPath()

    try {
      // Fetch the model.json to modify it
      const response = await fetch(modelPath)
      const modelJSON = await response.json()

      // Fix the InputLayer config - convert batch_shape to inputShape
      if (
        modelJSON.modelTopology?.model_config?.config?.layers?.[0]
          ?.class_name === 'InputLayer'
      ) {
        const inputLayer = modelJSON.modelTopology.model_config.config.layers[0]
        if (inputLayer.config.batch_shape) {
          // Convert batch_shape [null, 128, 128, 3] to inputShape [128, 128, 3]
          const batchShape = inputLayer.config.batch_shape
          inputLayer.config.inputShape = batchShape.slice(1)
          delete inputLayer.config.batch_shape
        }
      }

      // Fetch the weights binary file
      const weightsManifest = modelJSON.weightsManifest
      const baseUrl = modelPath.replace('/model.json', '/')
      const weightsPath = baseUrl + weightsManifest[0].paths[0]
      const weightsResponse = await fetch(weightsPath)
      const weightsData = await weightsResponse.arrayBuffer()

      // Load model from modified JSON and weights
      this.model = await tf.loadLayersModel(
        tf.io.fromMemory({
          modelTopology: modelJSON.modelTopology,
          weightSpecs: weightsManifest[0].weights,
          weightData: weightsData,
        }),
      )
    } catch (error) {
      console.error('Failed to load hair length model:', error)
      throw new Error(`Failed to load hair length model: ${error}`)
    }

    // Load classes from JSON file
    await this.loadClasses()
  }

  /**
   * Load class labels from classes.json
   */
  private async loadClasses() {
    try {
      const classesPath = getClassesPath()

      const response = await fetch(classesPath)
      const data = await response.json()
      this.classes = data.classes || data
    } catch (error) {
      // Fallback to hardcoded classes
      console.warn('Could not load classes.json, using fallback:', error)
      this.classes = ['short', 'medium', 'long']
    }
  }

  /**
   * Predict hair length from image tensor
   *
   * @param imageTensor - Normalized image tensor [H, W, 3] in range [0, 1]
   * @returns Hair length prediction with confidence and probabilities
   * @throws Error if model is not loaded
   */
  async predict(imageTensor: tf.Tensor3D): Promise<HairLengthResult> {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    return tf.tidy(() => {
      // Resize to model input size and add batch dimension
      const resized = tf.image.resizeBilinear(imageTensor, [128, 128])
      const batched = resized.expandDims(0) as tf.Tensor4D

      // Get predictions (model is checked above)
      const predictions = this.model?.predict(batched) as tf.Tensor

      // Synchronously get probabilities (we're in tidy, so this is safe)
      const probabilities = predictions.dataSync()

      const maxProbability = Math.max(...Array.from(probabilities))
      const maxIndex = Array.from(probabilities).indexOf(maxProbability)

      const allProbabilities: Record<string, number> = {}
      this.classes.forEach((length, i) => {
        allProbabilities[length] = probabilities[i]
      })

      return {
        length: this.classes[maxIndex],
        confidence: maxProbability,
        probabilities: allProbabilities,
      }
    })
  }
}
