import {
  EarsRound,
  EarsStandard,
  EyebrowsBold,
  EyebrowsRaiesd,
  EyebrowsSharp,
  EyesArrows,
  EyesCute,
  EyesSharp,
  EyesStandard,
  HairBoom,
  HairBundled,
  HairCute,
  HairRocket,
  HairStar,
  HeadOval,
  MouthLips,
  MouthSmile,
  MouthSmirk,
  NosesSharp,
  NosesStandard,
  NosesWide,
} from '@avatune/sketch-black-white-assets/react'
import type { ReactTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: shared.body,
  ears: {
    ...shared.ears,
    round: {
      ...shared.ears.round,
      Component: EarsRound,
    },
    standard: {
      ...shared.ears.standard,
      Component: EarsStandard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    bold: {
      ...shared.eyebrows.bold,
      Component: EyebrowsBold,
    },
    raised: {
      ...shared.eyebrows.raised,
      Component: EyebrowsRaiesd,
    },
    sharp: {
      ...shared.eyebrows.sharp,
      Component: EyebrowsSharp,
    },
  },
  eyes: {
    ...shared.eyes,
    arrows: {
      ...shared.eyes.arrows,
      Component: EyesArrows,
    },
    cute: {
      ...shared.eyes.cute,
      Component: EyesCute,
    },
    sharp: {
      ...shared.eyes.sharp,
      Component: EyesSharp,
    },
    standard: {
      ...shared.eyes.standard,
      Component: EyesStandard,
    },
  },
  hair: {
    ...shared.hair,
    boom: {
      ...shared.hair.boom,
      Component: HairBoom,
    },
    bundle: {
      ...shared.hair.bundle,
      Component: HairBundled,
    },
    cute: {
      ...shared.hair.cute,
      Component: HairCute,
    },
    rocket: {
      ...shared.hair.rocket,
      Component: HairRocket,
    },
    star: {
      ...shared.hair.star,
      Component: HairStar,
    },
  },
  head: {
    ...shared.head,
    oval: {
      ...shared.head.oval,
      Component: HeadOval,
    },
  },
  mouth: {
    ...shared.mouth,
    lips: {
      ...shared.mouth.lips,
      Component: MouthLips,
    },
    smile: {
      ...shared.mouth.smile,
      Component: MouthSmile,
    },
    smirk: {
      ...shared.mouth.smirk,
      Component: MouthSmirk,
    },
  },
  noses: {
    ...shared.noses,
    sharp: {
      ...shared.noses.sharp,
      Component: NosesSharp,
    },
    standard: {
      ...shared.noses.standard,
      Component: NosesStandard,
    },
    wide: {
      ...shared.noses.wide,
      Component: NosesWide,
    },
  },
} as const satisfies ReactTheme
