import { createFacialHairPredictor } from '@avatune/facial-hair-predictor'
import { createHairColorPredictor } from '@avatune/hair-color-predictor'
import { createHairLengthPredictor } from '@avatune/hair-length-predictor'
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
import type { Predictions } from '@avatune/types'
import * as tf from '@tensorflow/tfjs'

export type Predictors = {
  hairColor: ReturnType<typeof createHairColorPredictor>
  hairLength: ReturnType<typeof createHairLengthPredictor>
  skinTone: ReturnType<typeof createSkinTonePredictor>
  faceHair: ReturnType<typeof createFacialHairPredictor>
}

export async function initializePredictors(): Promise<Predictors> {
  // iOS WebGL produces different inference results for sensitive models.
  // CPU backend guarantees consistent float32 precision across devices.
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    await tf.setBackend('cpu')
    await tf.ready()
  }

  const hairColorPredictor = createHairColorPredictor()
  const hairLengthPredictor = createHairLengthPredictor()
  const skinTonePredictor = createSkinTonePredictor()
  const facialHairPredictor = createFacialHairPredictor()

  await Promise.all([
    hairColorPredictor.loadModel(),
    hairLengthPredictor.loadModel(),
    skinTonePredictor.loadModel(),
    facialHairPredictor.loadModel(),
  ])

  return {
    hairColor: hairColorPredictor,
    hairLength: hairLengthPredictor,
    skinTone: skinTonePredictor,
    faceHair: facialHairPredictor,
  }
}

function yieldToMain(): Promise<void> {
  const scheduler = (
    globalThis as typeof globalThis & {
      scheduler?: { yield?: () => Promise<void> }
    }
  ).scheduler

  if (!scheduler?.yield) {
    const { promise, resolve } = Promise.withResolvers<void>()
    setTimeout(resolve, 0)
    return promise
  }

  return scheduler.yield()
}

export async function predictFromImage(
  predictors: Predictors,
  image: HTMLImageElement,
): Promise<Predictions> {
  // Run predictions sequentially with yielding to prevent UI freeze
  const hairColorResult = await predictors.hairColor.predictFromImage(image)
  await yieldToMain()

  const hairLengthResult = await predictors.hairLength.predictFromImage(image)
  await yieldToMain()

  const skinToneResult = await predictors.skinTone.predictFromImage(image)
  await yieldToMain()

  const facialHairResult = await predictors.faceHair.predictFromImage(image)

  return {
    hairColor: hairColorResult.color,
    hairLength: hairLengthResult.length,
    skinTone: skinToneResult.tone,
    faceHair: facialHairResult.facialHair,
  }
}
