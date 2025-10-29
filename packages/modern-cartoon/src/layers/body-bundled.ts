import { shirt, sweater, turtleneck } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const CLOTHING_ASSETS = {
  shirt,
  sweater,
  turtleneck,
} as const

const getClothingAsset = (clothingStyle?: string): string => {
  switch (clothingStyle) {
    case 'sweater':
      return CLOTHING_ASSETS.sweater
    case 'turtleneck':
      return CLOTHING_ASSETS.turtleneck
    case 'shirt':
    default:
      return CLOTHING_ASSETS.shirt
  }
}

const BODY_LAYER_POSITION: LayerPosition = {
  x: 0.1, // 10% from left
  y: 0.8, // 80% from top
  scale: 1,
}

export const renderBody = (avatarConfig: NormalizedConfig): string => {
  const clothingStyle = avatarConfig.clothing?.style
  let clothingAsset = getClothingAsset(clothingStyle)
  const avatarSize = avatarConfig.size

  // Apply clothing color if specified
  const clothingColor = avatarConfig.clothing?.color
  if (clothingColor) {
    clothingAsset = applyColorToSvgString(clothingAsset, clothingColor)
  }

  const bodyLayer = createPositionedLayer(
    'body',
    clothingAsset,
    avatarSize,
    BODY_LAYER_POSITION,
  )

  return bodyLayer
}
