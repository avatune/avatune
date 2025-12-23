import {
  AccessoriesHorns,
  BodySanta,
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
  FaceHairBeard,
  HairBobRounded,
  HairBobStraight,
  HairLong,
  HairMedium,
  HairShort,
  HatsSanta,
  HeadOval,
  MouthBigSmile,
  MouthFlat,
  MouthFrown,
  MouthHalfOpen,
  MouthLaugh,
  MouthNervous,
  MouthSmile,
  NoseBig,
  NoseCurve,
  NoseDots,
  NoseHalfOval,
} from '@avatune/nevmstas-assets/vue'
import type { VueAvatarItem, VueTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VueAvatarItem>()
  .withComponents('accessories', {
    horns: { Component: AccessoriesHorns },
  })
  .withComponents('body', {
    santa: { Component: BodySanta },
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
  .withComponents('nose', {
    big: { Component: NoseBig },
    curve: { Component: NoseCurve },
    dots: { Component: NoseDots },
    halfOval: { Component: NoseHalfOval },
  })
  .withComponents('faceHair', {
    beard: { Component: FaceHairBeard },
  })
  .withComponents('hats', {
    santa: { Component: HatsSanta },
  })
  .build() satisfies VueTheme
