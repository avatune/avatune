import type { VanillaTheme } from '@avatune/types'
import {
  shirt,
  sweater,
  turtleneck,
  earsDefault,
  funny,
  dots,
  long,
  short,
  oval,
  laugh,
  nervous,
  smile,
  сurve,
} from '@avatune/modern-cartoon-assets/svg'

/**
 * Default vanilla theme with SVG code strings
 */
export const vanillaTheme: VanillaTheme = {
  body: {
    shirt: {
      code: shirt,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['casual', 'basic'],
    },
    sweater: {
      code: sweater,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['warm', 'cozy'],
    },
    turtleneck: {
      code: turtleneck,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['formal', 'warm'],
    },
  },
  ears: {
    default: {
      code: earsDefault,
      position: { x: 0.22, y: 0.55 },
      layer: 5,
      tags: ['basic'],
    },
  },
  eyebrows: {
    funny: {
      code: funny,
      position: { x: 0.28, y: 0.4 },
      layer: 30,
      tags: ['expressive', 'playful'],
    },
  },
  eyes: {
    dots: {
      code: dots,
      position: { x: 0.35, y: 0.45 },
      layer: 20,
      tags: ['simple', 'cute'],
    },
  },
  hair: {
    long: {
      code: long,
      position: { x: 0.06, y: 0.2 },
      layer: 50,
      tags: ['long', 'flowing'],
    },
    short: {
      code: short,
      position: { x: 0.13, y: 0.16 },
      layer: 50,
      tags: ['short', 'neat'],
    },
  },
  head: {
    oval: {
      code: oval,
      position: { x: 0.21, y: 0.2 },
      layer: 1,
      tags: ['basic', 'neutral'],
    },
  },
  mouth: {
    laugh: {
      code: laugh,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy', 'expressive'],
    },
    nervous: {
      code: nervous,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['anxious', 'subtle'],
    },
    smile: {
      code: smile,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy', 'friendly'],
    },
  },
  noses: {
    curve: {
      code: сurve,
      position: { x: 0.45, y: 0.53 },
      layer: 15,
      tags: ['simple', 'curved'],
    },
  },
}
