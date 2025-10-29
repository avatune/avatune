import { funny } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const EYEBROW_ASSETS = {
  funny,
} as const

const getEyebrowAsset = (_eyebrowStyle?: string): string => {
  return EYEBROW_ASSETS.funny
}

// Eyebrows layer positioning
const EYEBROWS_LAYER_POSITION: LayerPosition = {
  x: 0.28, // 28% from left
  y: 0.4, // 40% from top
  scale: 1,
}

export const renderEyebrows = (avatarConfig: NormalizedConfig): string => {
  const eyebrowStyle = avatarConfig.eyebrows?.style
  let eyebrowAsset = getEyebrowAsset(eyebrowStyle)
  const avatarSize = avatarConfig.size

  // Apply eyebrow color
  const eyebrowColor = avatarConfig.eyebrows?.color || '#8B4513'
  eyebrowAsset = applyColorToSvgString(eyebrowAsset, eyebrowColor)

  const eyebrowsLayer = createPositionedLayer(
    'eyebrows',
    eyebrowAsset,
    avatarSize,
    EYEBROWS_LAYER_POSITION,
  )

  return eyebrowsLayer
}
