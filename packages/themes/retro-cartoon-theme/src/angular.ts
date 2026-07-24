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
} from '@avatune/retro-cartoon-assets/angular'
import type { AngularAvatarItem, AngularTheme } from '@avatune/types'
import shared from './shared'

const toAngularItem = (asset: {
  template: string | ((color: string, uid: string) => string)
}) => ({
  template: asset.template,
  Component: null,
})

export default shared
  .toFramework<AngularAvatarItem>()
  .withComponents('body', {
    crewneckSweater: toAngularItem(BodyCrewneckSweater),
    collaredShirt: toAngularItem(BodyCollaredShirt),
    hoodie: toAngularItem(BodyHoodie),
    turtleneckSweater: toAngularItem(BodyTurtleneckSweater),
    blazer: toAngularItem(BodyBlazer),
    vNeckSweater: toAngularItem(BodyVNeckSweater),
  })
  .withComponents('eyebrows', {
    soft: toAngularItem(EyebrowsSoft),
    thick: toAngularItem(EyebrowsThick),
    angled: toAngularItem(EyebrowsAngled),
    flat: toAngularItem(EyebrowsFlat),
    raised: toAngularItem(EyebrowsRaised),
  })
  .withComponents('eyes', {
    neutral: toAngularItem(EyesNeutral),
    happy: toAngularItem(EyesHappy),
    winking: toAngularItem(EyesWinking),
    surprised: toAngularItem(EyesSurprised),
    sleepy: toAngularItem(EyesSleepy),
  })
  .withComponents('hair', {
    curlyBob: toAngularItem(HairCurlyBob),
    longWavy: toAngularItem(HairLongWavy),
    longStraight: toAngularItem(HairLongStraight),
    longCurly: toAngularItem(HairLongCurly),
    bob: toAngularItem(HairBob),
    sideSwept: toAngularItem(HairSideSwept),
    afro: toAngularItem(HairAfro),
    buzzCut: toAngularItem(HairBuzzCut),
  })
  .withComponents('head', { standard: toAngularItem(HeadStandard) })
  .withComponents('mouth', {
    teethSmile: toAngularItem(MouthTeethSmile),
    lips: toAngularItem(MouthLips),
    openedSmile: toAngularItem(MouthOpenedSmile),
    smirk: toAngularItem(MouthSmirk),
    neutral: toAngularItem(MouthNeutral),
    sad: toAngularItem(MouthSad),
  })
  .withComponents('nose', { curve: toAngularItem(NoseCurve) })
  .build() satisfies AngularTheme
