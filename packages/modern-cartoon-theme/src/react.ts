import {
  Curve,
  Dots,
  Funny,
  Laugh,
  Long,
  Nervous,
  Oval,
  Shirt,
  Short,
  Smile,
  Standard,
  Sweater,
  Turtleneck,
} from '@avatune/modern-cartoon-assets/react'
import type { ReactTheme } from '@avatune/types'
import shared from './shared'

export default {
  ...shared,
  body: {
    ...shared.body,
    shirt: {
      ...shared.body.shirt,
      Component: Shirt,
    },
    sweater: {
      ...shared.body.sweater,
      Component: Sweater,
    },
    turtleneck: {
      ...shared.body.turtleneck,
      Component: Turtleneck,
    },
  },
  ears: {
    ...shared.ears,
    standard: {
      ...shared.ears.standard,
      Component: Standard,
    },
  },
  eyebrows: {
    ...shared.eyebrows,
    funny: {
      ...shared.eyebrows.funny,
      Component: Funny,
    },
  },
  eyes: {
    ...shared.eyes,
    dots: {
      ...shared.eyes.dots,
      Component: Dots,
    },
  },
  hair: {
    ...shared.hair,
    long: {
      ...shared.hair.long,
      Component: Long,
    },
    short: {
      ...shared.hair.short,
      Component: Short,
    },
  },
  head: {
    ...shared.head,
    oval: {
      ...shared.head.oval,
      Component: Oval,
    },
  },
  mouth: {
    ...shared.mouth,
    laugh: {
      ...shared.mouth.laugh,
      Component: Laugh,
    },
    nervous: {
      ...shared.mouth.nervous,
      Component: Nervous,
    },
    smile: {
      ...shared.mouth.smile,
      Component: Smile,
    },
  },
  noses: {
    ...shared.noses,
    curve: {
      ...shared.noses.curve,
      Component: Curve,
    },
  },
} as const satisfies ReactTheme
