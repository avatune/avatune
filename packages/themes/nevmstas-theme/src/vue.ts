import {
  BodyShirt,
  BodySweater,
  BodyTshirt,
  BodyTurtleneck,
  EarsStandard,
  EyebrowsAngry,
  EyebrowsSmall,
  EyebrowsStandard,
  EyesBoring,
  EyesDots,
  EyesOpenCircle,
  EyesOpenRounded,
  HairBobRounded,
  HairBobStraight,
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
} from '@avatune/nevmstas-assets/vue'
import type { VueAvatarItem, VueTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VueAvatarItem>()
  .withComponents('body', {
    shirt: { Component: BodyShirt },
    sweater: { Component: BodySweater },
    tshirt: { Component: BodyTshirt },
    turtleneck: { Component: BodyTurtleneck },
  })
  .withComponents('ears', {
    standard: { Component: EarsStandard },
  })
  .withComponents('eyebrows', {
    angry: { Component: EyebrowsAngry },
    small: { Component: EyebrowsSmall },
    standard: { Component: EyebrowsStandard },
  })
  .withComponents('eyes', {
    boring: { Component: EyesBoring },
    dots: { Component: EyesDots },
    openCircle: { Component: EyesOpenCircle },
    openRounded: { Component: EyesOpenRounded },
  })
  .withComponents('hair', {
    bobRounded: { Component: HairBobRounded },
    bobStraight: { Component: HairBobStraight },
    short: { Component: HairShort },
    long: { Component: HairLong },
    medium: { Component: HairMedium },
  })
  .withComponents('head', {
    oval: { Component: HeadOval },
  })
  .withComponents('mouth', {
    bigSmile: { Component: MouthBigSmile },
    flat: { Component: MouthFlat },
    frown: { Component: MouthFrown },
    halfOpen: { Component: MouthHalfOpen },
    laugh: { Component: MouthLaugh },
    nervous: { Component: MouthNervous },
    smile: { Component: MouthSmile },
  })
  .withComponents('noses', {
    big: { Component: NosesBig },
    curve: { Component: NosesCurve },
    dots: { Component: NosesDots },
    halfOval: { Component: NosesHalfOval },
  })
  .build() satisfies VueTheme
