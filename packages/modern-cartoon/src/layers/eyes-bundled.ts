import { dots } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const EYES_ASSETS = {
  dots,
} as const

const getEyesAsset = (eyeStyle?: string): string => {
  return EYES_ASSETS.dots
}

// Eyes layer positioning
const EYES_LAYER_POSITION: LayerPosition = {
  x: 0.35, // 35% from left
  y: 0.45, // 45% from top
  scale: 1,
}

export const renderEyes = (avatarConfig: NormalizedConfig): string => {
  const eyeColor = avatarConfig.eyes?.color || '#4A2E14'
  const avatarSize = avatarConfig.size

  // Get eyes asset
  let eyesAsset = getEyesAsset(avatarConfig.eyes?.style)

  // Apply eye color
  eyesAsset = applyColorToSvgString(eyesAsset, eyeColor)

  // Create positioned layer
  const eyesLayer = createPositionedLayer(
    'eyes',
    eyesAsset,
    avatarSize,
    EYES_LAYER_POSITION,
  )

  return eyesLayer
}
