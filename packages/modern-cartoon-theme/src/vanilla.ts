import {
  curve,
  dots,
  funny,
  laugh,
  long,
  nervous,
  oval,
  shirt,
  short,
  smile,
  standard,
  sweater,
  turtleneck,
} from '@avatune/modern-cartoon-assets/svg'
import type { VanillaTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    shirt: {
      ...shared.body.shirt,
      code: shirt,
    },
    sweater: {
      ...shared.body.sweater,
      code: sweater,
    },
    turtleneck: {
      ...shared.body.turtleneck,
      code: turtleneck,
    },
  },
  ears: {
    ...shared.ears,
    standard: {
      ...shared.ears.standard,
      code: standard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    funny: {
      ...shared.eyebrows.funny,
      code: funny,
    },
  },
  eyes: {
    ...shared.eyes,
    dots: {
      ...shared.eyes.dots,
      code: dots,
    },
  },
  hair: {
    ...shared.hair,
    long: {
      ...shared.hair.long,
      code: long,
    },
    short: {
      ...shared.hair.short,
      code: short,
    },
  },
  head: {
    ...shared.head,
    oval: {
      ...shared.head.oval,
      code: oval,
    },
  },
  mouth: {
    ...shared.mouth,
    laugh: {
      ...shared.mouth.laugh,
      code: laugh,
    },
    nervous: {
      ...shared.mouth.nervous,
      code: nervous,
    },
    smile: {
      ...shared.mouth.smile,
      code: smile,
    },
  },
  noses: {
    ...shared.noses,
    curve: {
      ...shared.noses.curve,
      code: curve,
    },
  },
} satisfies VanillaTheme
