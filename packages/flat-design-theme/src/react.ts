import {
  BodySweater,
  EarsStandard,
  EyebrowsStadard,
  EyesBoring,
  EyesDots,
  HairLong,
  HairMedium,
  HairShort,
  HeadOval,
  MouthLaugh,
  MouthNervous,
  MouthSmile,
  NosesCurve,
  NosesDots,
} from '@avatune/flat-design-assets/react'
import type { ReactTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    sweater: {
      ...shared.body.sweater,
      Component: BodySweater,
    },
  },
  ears: {
    ...shared.ears,
    standard: {
      ...shared.ears.standard,
      Component: EarsStandard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    standard: {
      ...shared.eyebrows.standard,
      Component: EyebrowsStadard,
    },
  },
  eyes: {
    ...shared.eyes,
    boring: {
      ...shared.eyes.boring,
      Component: EyesBoring,
    },
    dots: {
      ...shared.eyes.dots,
      Component: EyesDots,
    },
  },
  hair: {
    ...shared.hair,
    short: {
      ...shared.hair.short,
      Component: HairShort,
    },
    long: {
      ...shared.hair.long,
      Component: HairLong,
    },
    medium: {
      ...shared.hair.medium,
      Component: HairMedium,
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
    laugh: {
      ...shared.mouth.laugh,
      Component: MouthLaugh,
    },
    smile: {
      ...shared.mouth.smile,
      Component: MouthSmile,
    },
    nervous: {
      ...shared.mouth.nervous,
      Component: MouthNervous,
    },
  },
  noses: {
    ...shared.noses,
    curve: {
      ...shared.noses.curve,
      Component: NosesCurve,
    },
    dots: {
      ...shared.noses.dots,
      Component: NosesDots,
    },
  },
} as const satisfies ReactTheme
