import { laugh, nervous, smile } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const MOUTH_ASSETS = {
  laugh,
  nervous,
  smile,
} as const

const getMouthAsset = (mouthStyle?: string): string => {
  switch (mouthStyle) {
    case 'nervous':
      return MOUTH_ASSETS.nervous
    case 'laugh':
      return MOUTH_ASSETS.laugh
    case 'smile':
    default:
      return MOUTH_ASSETS.smile
  }
}

// Mouth layer positioning
const MOUTH_LAYER_POSITION: LayerPosition = {
  x: 0.4, // 40% from left
  y: 0.63, // 63% from top
  scale: 1,
}

export const renderMouth = (avatarConfig: NormalizedConfig): string => {
  const mouthStyle = avatarConfig.mouth?.style
  const mouthAsset = getMouthAsset(mouthStyle)
  const avatarSize = avatarConfig.size

  // Apply lip color if specified
  let processedAsset = mouthAsset
  const lipColor = avatarConfig.mouth?.lipColor
  if (lipColor) {
    processedAsset = applyColorToSvgString(mouthAsset, lipColor)
  }

  // Create positioned layer
  const mouthLayer = createPositionedLayer(
    'mouth',
    processedAsset,
    avatarSize,
    MOUTH_LAYER_POSITION,
  )

  return mouthLayer
}
