import {
  HairColorPrediction,
  type HairColorResult,
} from '@avatune/hair-color-predictor'
import {
  HairLengthPrediction,
  type HairLengthResult,
} from '@avatune/hair-length-predictor'
import {
  SkinTonePrediction,
  type SkinToneResult,
} from '@avatune/skin-tone-predictor'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'

export default function App() {
  const initializingRef = useRef(false)
  const predictorsRef = useRef<{
    hairColor: HairColorPrediction
    hairLength: HairLengthPrediction
    skinTone: SkinTonePrediction
  } | null>(null)

  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hairResult, setHairResult] = useState<HairColorResult | null>(null)
  const [skinResult, setSkinResult] = useState<SkinToneResult | null>(null)
  const [hairLengthResult, setHairLengthResult] =
    useState<HairLengthResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize the library on mount
  useEffect(() => {
    const initLibrary = async () => {
      if (initializingRef.current) return
      initializingRef.current = true

      try {
        console.log('Initializing TensorFlow.js...')
        await tf.ready()

        console.log('Creating predictor instances...')
        const hairColor = new HairColorPrediction()
        const hairLength = new HairLengthPrediction()
        const skinTone = new SkinTonePrediction()

        console.log('Loading models in parallel...')
        await Promise.all([
          hairColor.loadModel(),
          hairLength.loadModel(),
          skinTone.loadModel(),
        ])

        predictorsRef.current = { hairColor, hairLength, skinTone }

        console.log('All predictors initialized successfully')
        setInitialized(true)
      } catch (err) {
        console.error('Failed to initialize:', err)
        setError(`Failed to initialize the predictors: ${err}`)
      }
    }

    initLibrary()
  }, [])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!predictorsRef.current) {
      setError('Predictors not initialized')
      return
    }

    setLoading(true)
    setError(null)
    setHairResult(null)
    setSkinResult(null)
    setHairLengthResult(null)

    try {
      // Create object URL for display
      const url = URL.createObjectURL(file)
      setImageUrl(url)

      // Load image
      const img = new Image()
      img.src = url

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Draw to canvas
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not found')

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')

      // Resize if too large
      const maxSize = 1024
      let width = img.width
      let height = img.height

      if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height)
        width = Math.floor(width * scale)
        height = Math.floor(height * scale)
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Get ImageData and convert to TensorFlow.js tensor
      const imageData = ctx.getImageData(0, 0, width, height)

      // Convert ImageData to normalized tensor [H, W, 3] in range [0, 1]
      const imageTensor = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(imageData)
        return tf.cast(tensor, 'float32').div(255.0) as tf.Tensor3D
      })

      try {
        // Predict hair color, skin tone, and hair length in parallel
        const [hair, skin, hairLength] = await Promise.all([
          predictorsRef.current.hairColor.predict(imageTensor),
          predictorsRef.current.skinTone.predict(imageTensor),
          predictorsRef.current.hairLength.predict(imageTensor),
        ])

        setHairResult(hair)
        setSkinResult(skin)
        setHairLengthResult(hairLength)
      } finally {
        // Clean up tensor
        imageTensor.dispose()
      }
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err instanceof Error ? err.message : 'Failed to predict colors')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Avatune Photo Analysis</h1>
      <p>
        Upload a portrait photo to analyze hair color, hair length, and skin
        tone
      </p>

      {!initialized && (
        <div style={{ padding: '10px', background: '#f0f0f0' }}>
          <p>Initializing models...</p>
        </div>
      )}

      {initialized && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
          />
        </div>
      )}

      {loading && (
        <p style={{ color: '#0066cc', marginTop: '10px' }}>
          Analyzing photo...
        </p>
      )}

      {error && (
        <div
          style={{
            padding: '10px',
            background: '#fee',
            border: '1px solid #fcc',
            marginTop: '10px',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Image</h2>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: '400px', border: '1px solid #ddd' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {(hairResult || skinResult || hairLengthResult) && (
        <div style={{ marginTop: '30px' }}>
          <h2>Results</h2>

          {hairResult && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Hair Color</h3>
              <p>
                <strong>Color:</strong> {hairResult.color}
              </p>
              <p>
                <strong>Confidence:</strong>{' '}
                {(hairResult.confidence * 100).toFixed(0)}%
              </p>
              <p>
                <strong>Probabilities:</strong>
              </p>
              <ul>
                {Object.entries(hairResult.probabilities).map(
                  ([color, prob]) => (
                    <li key={color}>
                      {color}: {((prob as number) * 100).toFixed(1)}%
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {hairLengthResult && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Hair Length</h3>
              <p>
                <strong>Length:</strong> {hairLengthResult.length}
              </p>
              <p>
                <strong>Confidence:</strong>{' '}
                {(hairLengthResult.confidence * 100).toFixed(0)}%
              </p>
              <p>
                <strong>Probabilities:</strong>
              </p>
              <ul>
                {Object.entries(hairLengthResult.probabilities).map(
                  ([length, prob]) => (
                    <li key={length}>
                      {length}: {((prob as number) * 100).toFixed(1)}%
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {skinResult && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Skin Tone</h3>
              <p>
                <strong>Tone:</strong> {skinResult.tone}
              </p>
              <p>
                <strong>Confidence:</strong>{' '}
                {(skinResult.confidence * 100).toFixed(0)}%
              </p>
              <p>
                <strong>Probabilities:</strong>
              </p>
              <ul>
                {Object.entries(skinResult.probabilities).map(
                  ([tone, prob]) => (
                    <li key={tone}>
                      {tone}: {((prob as number) * 100).toFixed(1)}%
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer' }}>View JSON Output</summary>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '10px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(
                {
                  hair: hairResult,
                  hairLength: hairLengthResult,
                  skin: skinResult,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
