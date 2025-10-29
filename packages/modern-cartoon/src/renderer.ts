import { renderBody } from './layers/body-bundled'
import { renderEars } from './layers/ears-bundled'
import { renderEyebrows } from './layers/eyebrows-bundled'
import { renderEyes } from './layers/eyes-bundled'
import { renderHair } from './layers/hair-bundled'
import { renderHead } from './layers/head-bundled'
import { renderMouth } from './layers/mouth-bundled'
import { renderNose } from './layers/nose-bundled'
import { type NormalizedConfig, normalizeConfig } from './normalize'
import type { AvatarConfig } from './types/avatar-config'
import { createSvgElement } from './utils/svg-helpers'

type LayerName =
  | 'background'
  | 'body'
  | 'head'
  | 'ears'
  | 'hair'
  | 'eyebrows'
  | 'eyes'
  | 'nose'
  | 'mouth'

const DRAW_ORDER: LayerName[] = [
  'background',
  'head',
  'eyebrows',
  'eyes',
  'nose',
  'mouth',
  'hair',
  'ears',
  'body',
]

type Renderer = (cfg: NormalizedConfig) => string

const RENDERERS: Record<Exclude<LayerName, 'background'>, Renderer> = {
  body: renderBody,
  head: renderHead,
  ears: renderEars,
  eyebrows: renderEyebrows,
  eyes: renderEyes,
  nose: renderNose,
  mouth: renderMouth,
  hair: renderHair,
}

export const renderAvatar = (cfgIn: AvatarConfig): string => {
  const cfg = normalizeConfig(cfgIn)
  const s = cfg.size

  // Build layers
  const layers: string[] = []

  // Add background if specified
  if (cfg.backgroundColor && cfg.backgroundColor !== 'transparent') {
    layers.push(
      createSvgElement('rect', {
        x: 0,
        y: 0,
        width: s,
        height: s,
        fill: cfg.backgroundColor,
        'data-layer': 'background',
      }),
    )
  }

  // Add all other layers in draw order
  for (const layer of DRAW_ORDER) {
    if (layer === 'background') continue
    const layerContent = RENDERERS[layer](cfg)
    layers.push(layerContent)
  }

  // Combine all layers
  const svgContent = layers.join('\n')

  // Create the main SVG element
  return createSvgElement(
    'svg',
    {
      width: s,
      height: s,
      viewBox: `0 0 ${s} ${s}`,
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    svgContent,
  )
}
