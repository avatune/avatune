import type { Predictions, ReactTheme } from '@avatune/types'

export function getSkinToneColors(
  theme: ReactTheme,
  predictions: Predictions,
): string[] {
  const skinToneMap = theme.predictorMappings?.skinTone
  if (!skinToneMap || !predictions.skinTone) return []
  return skinToneMap[predictions.skinTone] ?? []
}

export function getHairColors(
  theme: ReactTheme,
  predictions: Predictions,
): string[] {
  const colorMap = theme.predictorMappings?.hairColor
  if (!colorMap || !predictions.hairColor) return []
  return colorMap[predictions.hairColor] ?? []
}
