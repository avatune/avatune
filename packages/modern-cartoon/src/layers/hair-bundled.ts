import { long, short } from '@avatune/assets/svg'
import type { NormalizedConfig } from '../normalize'
import { applyColorToSvgString } from '../utils/color-utils'
import { createSvgElement, parseSvgContent } from '../utils/svg-helpers'
import { createLayerContainer, type LayerPosition } from '../utils/svg-utils'

const HAIR_ASSETS = {
  short,
  long,
} as const

const getHairAsset = (hairStyle?: string): string => {
  switch (hairStyle) {
    case 'long':
      return HAIR_ASSETS.long
    case 'short':
    default:
      return HAIR_ASSETS.short
  }
}

// Hair positioning based on style
const HAIR_LAYER_POSITIONS: Record<string, LayerPosition> = {
  short: {
    x: 0.13,
    y: 0.16,
  },
  long: {
    x: 0.06,
    y: 0.2,
  },
}

export const renderHair = (avatarConfig: NormalizedConfig): string => {
  const hairStyle = avatarConfig.hair?.style || 'short'
  const avatarSize = avatarConfig.size

  // Get hair asset
  let hairAsset = getHairAsset(hairStyle)

  // Apply hair color
  const hairColor = avatarConfig.hair?.color || '#8B4513'
  hairAsset = applyColorToSvgString(hairAsset, hairColor)

  // Get position
  const position = HAIR_LAYER_POSITIONS[hairStyle] || HAIR_LAYER_POSITIONS.short
  const { x, y } = position

  const transformX = avatarSize * x
  const transformY = avatarSize * y
  const scaleFactor = avatarSize / 400

  // Extract inner content of the SVG
  const innerContent = parseSvgContent(hairAsset)

  // Wrap in a new group with transform
  const transformedContent = createSvgElement(
    'g',
    {
      transform: `translate(${transformX} ${transformY}) scale(${scaleFactor})`,
    },
    innerContent,
  )

  // Create layer container
  return createLayerContainer('hair', transformedContent)
}
