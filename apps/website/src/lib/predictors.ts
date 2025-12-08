import { createHairColorPredictor } from '@avatune/hair-color-predictor'
import { createHairLengthPredictor } from '@avatune/hair-length-predictor'
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
import type { Predictions } from '@avatune/types'

export type Predictors = {
  hairColor: ReturnType<typeof createHairColorPredictor>
  hairLength: ReturnType<typeof createHairLengthPredictor>
  skinTone: ReturnType<typeof createSkinTonePredictor>
}

export async function initializePredictors(): Promise<Predictors> {
  const hairColorPredictor = createHairColorPredictor('/models/hair-color')
  const hairLengthPredictor = createHairLengthPredictor('/models/hair-length')
  const skinTonePredictor = createSkinTonePredictor('/models/skin-tone')

  await Promise.all([
    hairColorPredictor.loadModel(),
    hairLengthPredictor.loadModel(),
    skinTonePredictor.loadModel(),
  ])

  return {
    hairColor: hairColorPredictor,
    hairLength: hairLengthPredictor,
    skinTone: skinTonePredictor,
  }
}

export async function predictFromImage(
  predictors: Predictors,
  image: HTMLImageElement,
): Promise<Predictions> {
  const [hairColorResult, hairLengthResult, skinToneResult] = await Promise.all(
    [
      predictors.hairColor.predictFromImage(image),
      predictors.hairLength.predictFromImage(image),
      predictors.skinTone.predictFromImage(image),
    ],
  )

  return {
    hairColor: hairColorResult.color,
    hairLength: hairLengthResult.length,
    skinTone: skinToneResult.tone,
  }
}
