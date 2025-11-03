import {
  bodyShirt,
  bodySweater,
  bodyTurtleneck,
  earsStandard,
  eyebrowsFunny,
  eyesDots,
  hairLong,
  hairShort,
  headOval,
  mouthLaugh,
  mouthNervous,
  mouthSmile,
  nosesCurve,
} from '@avatune/modern-cartoon-assets'
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
    funny: {
      ...shared.eyebrows.funny,
      code: eyebrowsFunny,
    },
  },
  eyes: {
    ...shared.eyes,
    dots: {
      ...shared.eyes.dots,
      code: eyesDots,
    },
  },
  hair: {
    ...shared.hair,
    long: {
      ...shared.hair.long,
      code: hairLong,
    },
    short: {
      ...shared.hair.short,
      code: hairShort,
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
    nervous: {
      ...shared.mouth.nervous,
      code: mouthNervous,
    },
    smile: {
      ...shared.mouth.smile,
      code: mouthSmile,
    },
  },
  noses: {
    ...shared.noses,
    curve: {
      ...shared.noses.curve,
      code: nosesCurve,
    },
  },
} as const satisfies VanillaTheme
