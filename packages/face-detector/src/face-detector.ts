import {
  FaceDetector,
  FilesetResolver,
  type Detection,
} from '@mediapipe/tasks-vision'

export type FaceBoundingBox = {
  x: number
  y: number
  width: number
  height: number
}

export type FaceDetection = {
  boundingBox: FaceBoundingBox
  confidence: number
}

type FaceDetectorState = {
  detector: FaceDetector
}

const DEFAULT_WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

const DEFAULT_MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

export type FaceDetectorOptions = {
  wasmPath?: string
  modelPath?: string
  minDetectionConfidence?: number
}

async function initDetector(
  options: FaceDetectorOptions = {},
): Promise<FaceDetectorState> {
  const {
    wasmPath = DEFAULT_WASM_PATH,
    modelPath = DEFAULT_MODEL_PATH,
    minDetectionConfidence = 0.5,
  } = options

  const vision = await FilesetResolver.forVisionTasks(wasmPath)

  const detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate: 'GPU',
    },
    runningMode: 'IMAGE',
    minDetectionConfidence,
  })

  return { detector }
}

function parseDetection(detection: Detection): FaceDetection | null {
  const bbox = detection.boundingBox
  if (!bbox) return null

  return {
    boundingBox: {
      x: bbox.originX,
      y: bbox.originY,
      width: bbox.width,
      height: bbox.height,
    },
    confidence: detection.categories?.[0]?.score ?? 0,
  }
}

function detectFaces(
  state: FaceDetectorState,
  image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): FaceDetection[] {
  const result = state.detector.detect(image)

  return result.detections
    .map(parseDetection)
    .filter((d): d is FaceDetection => d !== null)
    .sort((a, b) => b.confidence - a.confidence)
}

function detectLargestFace(
  state: FaceDetectorState,
  image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): FaceDetection | null {
  const faces = detectFaces(state, image)
  if (faces.length === 0) return null

  return faces.reduce((largest, face) => {
    const largestArea = largest.boundingBox.width * largest.boundingBox.height
    const faceArea = face.boundingBox.width * face.boundingBox.height
    return faceArea > largestArea ? face : largest
  })
}

function cropFaceFromCanvas(
  canvas: HTMLCanvasElement,
  detection: FaceDetection,
  padding = 0.2,
): HTMLCanvasElement {
  const { x, y, width, height } = detection.boundingBox

  const paddingX = width * padding
  const paddingY = height * padding

  const cropX = Math.max(0, x - paddingX)
  const cropY = Math.max(0, y - paddingY)
  const cropWidth = Math.min(canvas.width - cropX, width + paddingX * 2)
  const cropHeight = Math.min(canvas.height - cropY, height + paddingY * 2)

  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = cropWidth
  croppedCanvas.height = cropHeight

  const ctx = croppedCanvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  ctx.drawImage(
    canvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  )

  return croppedCanvas
}

function imageToCanvas(
  image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): HTMLCanvasElement {
  if (image instanceof HTMLCanvasElement) {
    return image
  }

  const canvas = document.createElement('canvas')

  if (image instanceof HTMLVideoElement) {
    canvas.width = image.videoWidth
    canvas.height = image.videoHeight
  } else {
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  ctx.drawImage(image, 0, 0)
  return canvas
}

export function createFaceDetector(options: FaceDetectorOptions = {}) {
  let statePromise: Promise<FaceDetectorState> | null = null

  return {
    async load(): Promise<void> {
      if (!statePromise) {
        statePromise = initDetector(options)
      }
      await statePromise
    },

    async detectFaces(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): Promise<FaceDetection[]> {
      if (!statePromise) {
        throw new Error('Face detector not loaded. Call load() first.')
      }
      const state = await statePromise
      return detectFaces(state, image)
    },

    async detectLargestFace(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): Promise<FaceDetection | null> {
      if (!statePromise) {
        throw new Error('Face detector not loaded. Call load() first.')
      }
      const state = await statePromise
      return detectLargestFace(state, image)
    },

    async cropFace(
      image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
      padding = 0.2,
    ): Promise<HTMLCanvasElement | null> {
      if (!statePromise) {
        throw new Error('Face detector not loaded. Call load() first.')
      }
      const state = await statePromise

      const canvas = imageToCanvas(image)
      const face = detectLargestFace(state, canvas)

      if (!face) return null

      return cropFaceFromCanvas(canvas, face, padding)
    },
  }
}
