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
import type { Meta, StoryObj } from '@storybook/react'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'

function PhotoAnalysis() {
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize predictors
  useEffect(() => {
    const initLibrary = async () => {
      if (initializingRef.current) return
      initializingRef.current = true

      try {
        await tf.ready()
        const hairColor = new HairColorPrediction()
        const hairLength = new HairLengthPrediction()
        const skinTone = new SkinTonePrediction()

        await Promise.all([
          hairColor.loadModel(),
          hairLength.loadModel(),
          skinTone.loadModel(),
        ])

        predictorsRef.current = { hairColor, hairLength, skinTone }
        setInitialized(true)
      } catch (err) {
        setError(`Failed to initialize: ${err}`)
      }
    }

    initLibrary()
  }, [])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !predictorsRef.current) return

    setLoading(true)
    setError(null)
    setHairResult(null)
    setSkinResult(null)
    setHairLengthResult(null)

    try {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.src = url

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not found')

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')

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

      const imageData = ctx.getImageData(0, 0, width, height)

      const imageTensor = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(imageData)
        return tf.cast(tensor, 'float32').div(255.0) as tf.Tensor3D
      })

      try {
        const [hair, skin, hairLength] = await Promise.all([
          predictorsRef.current.hairColor.predict(imageTensor),
          predictorsRef.current.skinTone.predict(imageTensor),
          predictorsRef.current.hairLength.predict(imageTensor),
        ])

        setHairResult(hair)
        setSkinResult(skin)
        setHairLengthResult(hairLength)
      } finally {
        imageTensor.dispose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to predict')
    } finally {
      setLoading(false)
    }
  }

  const hasResults = hairResult || skinResult || hairLengthResult

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      {!initialized && <p>Loading models...</p>}

      {initialized && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
          />
        </div>
      )}

      {loading && <p>Analyzing...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {hasResults && (
        <pre style={{ marginTop: '20px' }}>
          {JSON.stringify(
            {
              hairColor: hairResult,
              hairLength: hairLengthResult,
              skinTone: skinResult,
            },
            null,
            2,
          )}
        </pre>
      )}
    </div>
  )
}

const meta = {
  title: 'Photo Analysis',
  component: PhotoAnalysis,
} satisfies Meta<typeof PhotoAnalysis>

export default meta
type Story = StoryObj<typeof meta>

export const Predictor: Story = {}
