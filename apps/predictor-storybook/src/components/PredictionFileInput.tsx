import { createHairColorPredictor } from '@avatune/hair-color-predictor'
import { createHairLengthPredictor } from '@avatune/hair-length-predictor'
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
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
    hairColor: ReturnType<typeof createHairColorPredictor>
    hairLength: ReturnType<typeof createHairLengthPredictor>
    skinTone: ReturnType<typeof createSkinTonePredictor>
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
        const hairColor = createHairColorPredictor('/models/hair_color')
        const skinTone = createSkinTonePredictor('/models/skin_tone')
        const hairLength = createHairLengthPredictor('/models/hair_length')
        await Promise.all([
          hairColor.loadModel(),
          skinTone.loadModel(),
          hairLength.loadModel(),
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

      const [hairColor, skinTone, hairLength] = await Promise.all([
        predictorsRef.current.hairColor.predictFromImage(canvas),
        predictorsRef.current.skinTone.predictFromImage(canvas),
        predictorsRef.current.hairLength.predictFromImage(canvas),
      ])

      const predictions: Predictions = {
        hairColor: hairColor.color,
        hairLength: hairLength.length,
        skinTone: skinTone.tone,
      }

      onPredictSuccess?.(predictions)
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
