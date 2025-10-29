import { earsDefault } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createSvgElement } from '../utils/svg-helpers'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

// Ears layer positioning
const EARS_LAYER_POSITION: LayerPosition = {
  x: 0.22, // 22% from left
  y: 0.55, // 55% from top
  scale: 1,
}

export const renderEars = (avatarConfig: NormalizedConfig): string => {
  const areEarsVisible = avatarConfig.ears?.visible !== false
  const avatarSize = avatarConfig.size

  // Don't render ears if not visible
  if (!areEarsVisible) {
    return createSvgElement('g', { 'data-layer': 'ears' }, '')
  }

  // Get ears asset
  let earsAsset = earsDefault

  // Apply skin tone to ears
  const skinTone = avatarConfig.face?.skinTone || '#F6C7AC'
  earsAsset = applyColorToSvgString(earsAsset, skinTone)

  // Create positioned layer
  const earsLayer = createPositionedLayer(
    'ears',
    earsAsset,
    avatarSize,
    EARS_LAYER_POSITION,
  )

  return earsLayer
}
