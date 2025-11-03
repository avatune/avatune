import {
  earsRound,
  earsStandard,
  eyebrowsBold,
  eyebrowsRaiesd,
  eyebrowsSharp,
  eyesArrows,
  eyesCute,
  eyesSharp,
  eyesStandard,
  hairBoom,
  hairBundled,
  hairCute,
  hairRocket,
  hairStar,
  headOval,
  mouthLips,
  mouthSmile,
  mouthSmirk,
  nosesSharp,
  nosesStandard,
  nosesWide,
} from '@avatune/sketch-black-white-assets'
import type { VanillaTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: shared.body,
  ears: {
    ...shared.ears,
    round: {
      ...shared.ears.round,
      code: earsRound,
    },
    standard: {
      ...shared.ears.standard,
      code: earsStandard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    bold: {
      ...shared.eyebrows.bold,
      code: eyebrowsBold,
    },
    raised: {
      ...shared.eyebrows.raised,
      code: eyebrowsRaiesd,
    },
    sharp: {
      ...shared.eyebrows.sharp,
      code: eyebrowsSharp,
    },
  },
  eyes: {
    ...shared.eyes,
    arrows: {
      ...shared.eyes.arrows,
      code: eyesArrows,
    },
    cute: {
      ...shared.eyes.cute,
      code: eyesCute,
    },
    sharp: {
      ...shared.eyes.sharp,
      code: eyesSharp,
    },
    standard: {
      ...shared.eyes.standard,
      code: eyesStandard,
    },
  },
  hair: {
    ...shared.hair,
    boom: {
      ...shared.hair.boom,
      code: hairBoom,
    },
    bundle: {
      ...shared.hair.bundle,
      code: hairBundled,
    },
    cute: {
      ...shared.hair.cute,
      code: hairCute,
    },
    rocket: {
      ...shared.hair.rocket,
      code: hairRocket,
    },
    star: {
      ...shared.hair.star,
      code: hairStar,
    },
  },
  head: {
    ...shared.head,
    oval: {
      ...shared.head.oval,
      code: headOval,
    },
  },
  mouth: {
    ...shared.mouth,
    lips: {
      ...shared.mouth.lips,
      code: mouthLips,
    },
    smile: {
      ...shared.mouth.smile,
      code: mouthSmile,
    },
    smirk: {
      ...shared.mouth.smirk,
      code: mouthSmirk,
    },
  },
  noses: {
    ...shared.noses,
    sharp: {
      ...shared.noses.sharp,
      code: nosesSharp,
    },
    standard: {
      ...shared.noses.standard,
      code: nosesStandard,
    },
    wide: {
      ...shared.noses.wide,
      code: nosesWide,
    },
  },
} as const satisfies VanillaTheme
