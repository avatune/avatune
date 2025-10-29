import { сurve } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { createPositionedLayer, type LayerPosition } from '../utils/svg-utils'

const NOSE_LAYER_POSITION: LayerPosition = {
  x: 0.45, // 45% from left
  y: 0.53, // 53% from top
  scale: 1,
}

export const renderNose = (avatarConfig: NormalizedConfig): string => {
  const avatarSize = avatarConfig.size

  const noseLayer = createPositionedLayer(
    'nose',
    сurve,
    avatarSize,
    NOSE_LAYER_POSITION,
  )

  return noseLayer
}
