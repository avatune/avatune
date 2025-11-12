import { HairColorPredictor } from '@avatune/hair-color-predictor'
import { HairLengthPredictor } from '@avatune/hair-length-predictor'
import { SkinTonePredictor } from '@avatune/skin-tone-predictor'
import type { Predictions } from '@avatune/types'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'

export interface PredictionFileInputProps {
  onPredict?: () => void
  onPredictSuccess?: (predictions: Predictions) => void
  onPredictError?: (error: string) => void
}

export function PredictionFileInput({
  onPredict,
  onPredictSuccess,
  onPredictError,
}: PredictionFileInputProps) {
  const initializingRef = useRef(false)
  const predictorsRef = useRef<{
    hairColor: HairColorPredictor
    hairLength: HairLengthPredictor
    skinTone: SkinTonePredictor
  } | null>(null)

  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const initLibrary = async () => {
      if (initializingRef.current) return
      initializingRef.current = true

      try {
        await tf.ready()
        const hairColor = new HairColorPredictor('/models/hair_color')
        const hairLength = new HairLengthPredictor('/models/hair_length')
        const skinTone = new SkinTonePredictor('/models/skin_tone')

        await Promise.all([
          hairColor.loadModel(),
          hairLength.loadModel(),
          skinTone.loadModel(),
        ])

        predictorsRef.current = { hairColor, hairLength, skinTone }
        setInitialized(true)
      } catch (err) {
        const errorMsg = `Failed to initialize: ${err}`
        setError(errorMsg)
        onPredictError?.(errorMsg)
      }
    }

    initLibrary()
  }, [onPredictError])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !predictorsRef.current) return

    setLoading(true)
    setError(null)
    onPredict?.()

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
        const [hairColor, skinTone, hairLength] = await Promise.all([
          predictorsRef.current.hairColor.predict(imageTensor),
          predictorsRef.current.skinTone.predict(imageTensor),
          predictorsRef.current.hairLength.predict(imageTensor),
        ])

        const predictions: Predictions = {
          hairColor: hairColor.color,
          hairLength: hairLength.length,
          skinTone: skinTone.tone,
        }

        onPredictSuccess?.(predictions)
      } finally {
        imageTensor.dispose()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to predict'
      setError(errorMsg)
      onPredictError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
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
    </div>
  )
}
