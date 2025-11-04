import {
  bodySweater,
  earsStandard,
  eyebrowsStandard,
  eyesBoring,
  eyesDots,
  hairLong,
  hairMedium,
  hairShort,
  headOval,
  mouthLaugh,
  mouthNervous,
  mouthSmile,
  nosesCurve,
  nosesDots,
} from '@avatune/flat-design-assets'
import type { VanillaTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    sweater: {
      ...shared.body.sweater,
      code: bodySweater,
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
  },
  hair: {
    ...shared.hair,
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
    curve: {
      ...shared.noses.curve,
      code: nosesCurve,
    },
    dots: {
      ...shared.noses.dots,
      code: nosesDots,
    },
  },
} as const satisfies VanillaTheme
