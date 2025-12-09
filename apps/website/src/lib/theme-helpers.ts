import type { Predictions, SvelteTheme } from '@avatune/types'

export function getHairComponent(theme: SvelteTheme, item: string): unknown {
  const hairCategory = theme.hair as Record<string, { Component: unknown }>
  return hairCategory?.[item]?.Component ?? null
}

export function getSkinToneColors(
  theme: SvelteTheme,
  predictions: Predictions,
): string[] {
  const skinToneMap = theme.predictorMappings?.skinTone
  if (!skinToneMap || !predictions.skinTone) return []
  return skinToneMap[predictions.skinTone] ?? []
}

export function getHairItems(
  theme: SvelteTheme,
  predictions: Predictions,
): string[] {
  const hairMap = theme.predictorMappings?.hair
  if (!hairMap || !predictions.hairLength) return []
  return hairMap[predictions.hairLength] ?? []
}

export function getHairColors(
  theme: SvelteTheme,
  predictions: Predictions,
): string[] {
  const colorMap = theme.predictorMappings?.hairColor
  if (!colorMap || !predictions.hairColor) return []
  return colorMap[predictions.hairColor] ?? []
}

export function getFacialHairItems(
  theme: SvelteTheme,
  predictions: Predictions,
): string[] {
  const facialHairMap = theme.predictorMappings?.facialHair
  if (!facialHairMap || !predictions.facialHair) return []
  return facialHairMap[predictions.facialHair] ?? []
}

export function getFacialHairComponent(
  theme: SvelteTheme,
  item: string,
): unknown {
  const faceHairCategory = theme.faceHair as
    | Record<string, { Component: unknown }>
    | undefined
  return faceHairCategory?.[item]?.Component ?? null
}
