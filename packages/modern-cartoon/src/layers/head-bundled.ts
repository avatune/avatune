import { oval } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const HEAD_ASSETS = {
  oval,
} as const

const getHeadAsset = (headShape?: string): string => {
  return HEAD_ASSETS.oval
}

// Head layer positioning
const HEAD_LAYER_POSITION: LayerPosition = {
  x: 0.21, // 21% from left
  y: 0.2, // 20% from top
  scale: 1,
}

export const renderHead = (avatarConfig: NormalizedConfig): string => {
  const skinTone = avatarConfig.face?.skinTone || '#F6C7AC'
  const avatarSize = avatarConfig.size

  // Get head asset
  let headAsset = getHeadAsset(avatarConfig.face?.shape)

  // Apply skin tone
  headAsset = applyColorToSvgString(headAsset, skinTone)

  // Create positioned layer
  const headLayer = createPositionedLayer(
    'head',
    headAsset,
    avatarSize,
    HEAD_LAYER_POSITION,
  )

  return headLayer
}
