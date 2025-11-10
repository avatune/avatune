import {
  BodyShirt,
  BodySweater,
  BodyTshort,
  BodyTurtleneck,
  EarsStandard,
  EyebrowsAngry,
  EyebrowsSmall,
  EyebrowsStadard,
  EyesBoring,
  EyesDots,
  EyesOpenCircle,
  EyesOpenRounded,
  HairBobRounded,
  HairBobStraight,
  HairCupCurly,
  HairLong,
  HairMedium,
  HairShort,
  HeadOval,
  MouthBigSmile,
  MouthFlat,
  MouthFrown,
  MouthHalfOpen,
  MouthLaugh,
  MouthNervous,
  MouthSmile,
  NosesBig,
  NosesCurve,
  NosesDots,
  NosesHalfOval,
} from '@avatune/flat-design-assets/react'
import type { ReactTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    shirt: {
      ...shared.body.shirt,
      Component: BodyShirt,
    },
    sweater: {
      ...shared.body.sweater,
      Component: BodySweater,
    },
    tshort: {
      ...shared.body.tshort,
      Component: BodyTshort,
    },
    turtleneck: {
      ...shared.body.turtleneck,
      Component: BodyTurtleneck,
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
    angry: {
      ...shared.eyebrows.angry,
      Component: EyebrowsAngry,
    },
    small: {
      ...shared.eyebrows.small,
      Component: EyebrowsSmall,
    },
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
    openCircle: {
      ...shared.eyes.openCircle,
      Component: EyesOpenCircle,
    },
    openRounded: {
      ...shared.eyes.openRounded,
      Component: EyesOpenRounded,
    },
  },
  hair: {
    ...shared.hair,
    bobRounded: {
      ...shared.hair.bobRounded,
      Component: HairBobRounded,
    },
    bobStraight: {
      ...shared.hair.bobStraight,
      Component: HairBobStraight,
    },
    cupCurly: {
      ...shared.hair.cupCurly,
      Component: HairCupCurly,
    },
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
    bigSmile: {
      ...shared.mouth.bigSmile,
      Component: MouthBigSmile,
    },
    flat: {
      ...shared.mouth.flat,
      Component: MouthFlat,
    },
    frown: {
      ...shared.mouth.frown,
      Component: MouthFrown,
    },
    halfOpen: {
      ...shared.mouth.halfOpen,
      Component: MouthHalfOpen,
    },
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
    big: {
      ...shared.noses.big,
      Component: NosesBig,
    },
    curve: {
      ...shared.noses.curve,
      Component: NosesCurve,
    },
    dots: {
      ...shared.noses.dots,
      Component: NosesDots,
    },
    halfOval: {
      ...shared.noses.halfOval,
      Component: NosesHalfOval,
    },
  },
} as const satisfies ReactTheme
