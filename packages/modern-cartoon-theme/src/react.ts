import {
  BodyShirt,
  BodySweater,
  BodyTurtleneck,
  EarsStandard,
  EyebrowsFunny,
  EyesDots,
  HairLong,
  HairShort,
  HeadOval,
  MouthLaugh,
  MouthNervous,
  MouthSmile,
  NosesCurve,
} from '@avatune/modern-cartoon-assets/react'
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
    funny: {
      ...shared.eyebrows.funny,
      Component: EyebrowsFunny,
    },
  },
  eyes: {
    ...shared.eyes,
    dots: {
      ...shared.eyes.dots,
      Component: EyesDots,
    },
  },
  hair: {
    ...shared.hair,
    long: {
      ...shared.hair.long,
      Component: HairLong,
    },
    short: {
      ...shared.hair.short,
      Component: HairShort,
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
    nervous: {
      ...shared.mouth.nervous,
      Component: MouthNervous,
    },
    smile: {
      ...shared.mouth.smile,
      Component: MouthSmile,
    },
  },
  noses: {
    ...shared.noses,
    curve: {
      ...shared.noses.curve,
      Component: NosesCurve,
    },
  },
} as const satisfies ReactTheme
