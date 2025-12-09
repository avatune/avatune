import { createFacialHairPredictor } from '@avatune/facial-hair-predictor'
import { createHairColorPredictor } from '@avatune/hair-color-predictor'
import { createHairLengthPredictor } from '@avatune/hair-length-predictor'
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
import type { Predictions } from '@avatune/types'

export type Predictors = {
  hairColor: ReturnType<typeof createHairColorPredictor>
  hairLength: ReturnType<typeof createHairLengthPredictor>
  skinTone: ReturnType<typeof createSkinTonePredictor>
  facialHair: ReturnType<typeof createFacialHairPredictor>
}

export async function initializePredictors(): Promise<Predictors> {
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
    facialHair: facialHairPredictor,
  }
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if ('scheduler' in globalThis && 'yield' in (globalThis as any).scheduler) {
      ;(globalThis as any).scheduler.yield().then(resolve)
    } else {
      setTimeout(resolve, 0)
    }
  })
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

  const facialHairResult = await predictors.facialHair.predictFromImage(image)

  return {
    hairColor: hairColorResult.color,
    hairLength: hairLengthResult.length,
    skinTone: skinToneResult.tone,
    facialHair: facialHairResult.facialHair,
  }
}
