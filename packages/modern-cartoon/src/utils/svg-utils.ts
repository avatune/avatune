import { createSvgElement, parseSvgContent } from './svg-helpers'

// Common SVG positioning and scaling utilities
export interface LayerPosition {
  x: number // Position as percentage of canvas (0-1)
  y: number // Position as percentage of canvas (0-1)
  scale?: number // Scale factor (default: 1)
}

// Helper function to create layer container as string
export const createLayerContainer = (
  layerName: string,
  content: string,
): string => {
  return createSvgElement('g', { 'data-layer': layerName }, content)
}

// Helper function to apply transform to SVG content string
export const applyTransformToString = (
  svgContent: string,
  avatarSize: number,
  position: LayerPosition,
): string => {
  const { x, y, scale = 1 } = position
  const transformX = avatarSize * x
  const transformY = avatarSize * y
  const scaleFactor = (avatarSize / 400) * scale

  // Extract inner content of the SVG
  const innerContent = parseSvgContent(svgContent)

  // Wrap in a new group with transform
  return createSvgElement(
    'g',
    {
      transform: `translate(${transformX} ${transformY}) scale(${scaleFactor})`,
    },
    innerContent,
  )
}

// Helper function to create and position a layer as string
export const createPositionedLayer = (
  layerName: string,
  svgAsset: string,
  avatarSize: number,
  position: LayerPosition,
): string => {
  const transformedSvg = applyTransformToString(svgAsset, avatarSize, position)
  return createLayerContainer(layerName, transformedSvg)
}
