import {
  BodyBlazer,
  BodyCollaredShirt,
  BodyCrewneckSweater,
  BodyHoodie,
  BodyTurtleneckSweater,
  BodyVNeckSweater,
  EyebrowsAngled,
  EyebrowsFlat,
  EyebrowsRaised,
  EyebrowsSoft,
  EyebrowsThick,
  EyesHappy,
  EyesNeutral,
  EyesSleepy,
  EyesSurprised,
  EyesWinking,
  HairAfro,
  HairBob,
  HairBuzzCut,
  HairCurlyBob,
  HairLongCurly,
  HairLongStraight,
  HairLongWavy,
  HairSideSwept,
  HeadStandard,
  MouthLips,
  MouthNeutral,
  MouthOpenedSmile,
  MouthSad,
  MouthSmirk,
  MouthTeethSmile,
  NoseCurve,
} from '@avatune/retro-cartoon-assets/react-native'
import type { ReactNativeAvatarItem, ReactNativeTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<ReactNativeAvatarItem>()
  .withComponents('body', {
    crewneckSweater: { Component: BodyCrewneckSweater },
    collaredShirt: { Component: BodyCollaredShirt },
    hoodie: { Component: BodyHoodie },
    turtleneckSweater: { Component: BodyTurtleneckSweater },
    blazer: { Component: BodyBlazer },
    vNeckSweater: { Component: BodyVNeckSweater },
  })
  .withComponents('eyebrows', {
    soft: { Component: EyebrowsSoft },
    thick: { Component: EyebrowsThick },
    angled: { Component: EyebrowsAngled },
    flat: { Component: EyebrowsFlat },
    raised: { Component: EyebrowsRaised },
  })
  .withComponents('eyes', {
    neutral: { Component: EyesNeutral },
    happy: { Component: EyesHappy },
    winking: { Component: EyesWinking },
    surprised: { Component: EyesSurprised },
    sleepy: { Component: EyesSleepy },
  })
  .withComponents('hair', {
    curlyBob: { Component: HairCurlyBob },
    longWavy: { Component: HairLongWavy },
    longStraight: { Component: HairLongStraight },
    longCurly: { Component: HairLongCurly },
    bob: { Component: HairBob },
    sideSwept: { Component: HairSideSwept },
    afro: { Component: HairAfro },
    buzzCut: { Component: HairBuzzCut },
  })
  .withComponents('head', { standard: { Component: HeadStandard } })
  .withComponents('mouth', {
    teethSmile: { Component: MouthTeethSmile },
    lips: { Component: MouthLips },
    openedSmile: { Component: MouthOpenedSmile },
    smirk: { Component: MouthSmirk },
    neutral: { Component: MouthNeutral },
    sad: { Component: MouthSad },
  })
  .withComponents('nose', { curve: { Component: NoseCurve } })
  .build() satisfies ReactNativeTheme
