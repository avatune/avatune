import {
  Curve,
  Dots,
  EarsDefault,
  Funny,
  Laugh,
  Long,
  Nervous,
  Oval,
  Shirt,
  Short,
  Smile,
  Sweater,
  Turtleneck,
} from '@avatune/modern-cartoon-assets'
import type { ReactTheme } from '@avatune/types'

export default {
  body: {
    shirt: {
      Component: Shirt,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['casual', 'basic'],
    },
    sweater: {
      Component: Sweater,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['warm', 'cozy'],
    },
    turtleneck: {
      Component: Turtleneck,
      position: { x: 0.1, y: 0.8 },
      layer: 10,
      tags: ['formal', 'warm'],
    },
  },
  ears: {
    default: {
      Component: EarsDefault,
      position: { x: 0.22, y: 0.55 },
      layer: 100,
      tags: ['basic'],
    },
  },
  eyebrows: {
    funny: {
      Component: Funny,
      position: { x: 0.28, y: 0.4 },
      layer: 30,
      tags: ['expressive', 'playful'],
    },
  },
  eyes: {
    dots: {
      Component: Dots,
      position: { x: 0.35, y: 0.45 },
      layer: 20,
      tags: ['simple', 'cute'],
    },
  },
  hair: {
    long: {
      Component: Long,
      position: { x: 0.06, y: 0.2 },
      layer: 50,
      tags: ['long', 'flowing'],
    },
    short: {
      Component: Short,
      position: { x: 0.13, y: 0.16 },
      layer: 50,
      tags: ['short', 'neat'],
    },
  },
  head: {
    oval: {
      Component: Oval,
      position: { x: 0.21, y: 0.2 },
      layer: 1,
      tags: ['basic', 'neutral'],
    },
  },
  mouth: {
    laugh: {
      Component: Laugh,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy', 'expressive'],
    },
    nervous: {
      Component: Nervous,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['anxious', 'subtle'],
    },
    smile: {
      Component: Smile,
      position: { x: 0.4, y: 0.63 },
      layer: 25,
      tags: ['happy', 'friendly'],
    },
  },
  noses: {
    curve: {
      Component: Curve,
      position: { x: 0.45, y: 0.53 },
      layer: 15,
      tags: ['simple', 'curved'],
    },
  },
} satisfies ReactTheme
