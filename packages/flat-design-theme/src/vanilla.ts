import {
  bodyShirt,
  bodySweater,
  bodyTshort,
  bodyTurtleneck,
  earsStandard,
  eyebrowsAngry,
  eyebrowsSmall,
  eyebrowsStandard,
  eyesBoring,
  eyesDots,
  eyesOpenCircle,
  eyesOpenRounded,
  hairBobRounded,
  hairBobStraight,
  hairCupCurly,
  hairLong,
  hairMedium,
  hairShort,
  headOval,
  mouthBigSmile,
  mouthFlat,
  mouthFrown,
  mouthHalfOpen,
  mouthLaugh,
  mouthNervous,
  mouthSmile,
  nosesBig,
  nosesCurve,
  nosesDots,
  nosesHalfOval,
} from '@avatune/flat-design-assets'
import type { VanillaTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    shirt: {
      ...shared.body.shirt,
      code: bodyShirt,
    },
    sweater: {
      ...shared.body.sweater,
      code: bodySweater,
    },
    tshort: {
      ...shared.body.tshort,
      code: bodyTshort,
    },
    turtleneck: {
      ...shared.body.turtleneck,
      code: bodyTurtleneck,
    },
  },
  ears: {
    ...shared.ears,
    standard: {
      ...shared.ears.standard,
      code: earsStandard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    angry: {
      ...shared.eyebrows.angry,
      code: eyebrowsAngry,
    },
    small: {
      ...shared.eyebrows.small,
      code: eyebrowsSmall,
    },
    standard: {
      ...shared.eyebrows.standard,
      code: eyebrowsStandard,
    },
  },
  eyes: {
    ...shared.eyes,
    boring: {
      ...shared.eyes.boring,
      code: eyesBoring,
    },
    dots: {
      ...shared.eyes.dots,
      code: eyesDots,
    },
    openCircle: {
      ...shared.eyes.openCircle,
      code: eyesOpenCircle,
    },
    openRounded: {
      ...shared.eyes.openRounded,
      code: eyesOpenRounded,
    },
  },
  hair: {
    ...shared.hair,
    bobRounded: {
      ...shared.hair.bobRounded,
      code: hairBobRounded,
    },
    bobStraight: {
      ...shared.hair.bobStraight,
      code: hairBobStraight,
    },
    cupCurly: {
      ...shared.hair.cupCurly,
      code: hairCupCurly,
    },
    short: {
      ...shared.hair.short,
      code: hairShort,
    },
    long: {
      ...shared.hair.long,
      code: hairLong,
    },
    medium: {
      ...shared.hair.medium,
      code: hairMedium,
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
    bigSmile: {
      ...shared.mouth.bigSmile,
      code: mouthBigSmile,
    },
    flat: {
      ...shared.mouth.flat,
      code: mouthFlat,
    },
    frown: {
      ...shared.mouth.frown,
      code: mouthFrown,
    },
    halfOpen: {
      ...shared.mouth.halfOpen,
      code: mouthHalfOpen,
    },
    laugh: {
      ...shared.mouth.laugh,
      code: mouthLaugh,
    },
    smile: {
      ...shared.mouth.smile,
      code: mouthSmile,
    },
    nervous: {
      ...shared.mouth.nervous,
      code: mouthNervous,
    },
  },
  noses: {
    ...shared.noses,
    big: {
      ...shared.noses.big,
      code: nosesBig,
    },
    curve: {
      ...shared.noses.curve,
      code: nosesCurve,
    },
    dots: {
      ...shared.noses.dots,
      code: nosesDots,
    },
    halfOval: {
      ...shared.noses.halfOval,
      code: nosesHalfOval,
    },
  },
} as const satisfies VanillaTheme
