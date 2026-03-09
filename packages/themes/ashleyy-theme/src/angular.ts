import {
  AccessoriesEarrings,
  AccessoriesMask,
  BodyButtonShirt,
  BodyDoubleCollarShirt,
  BodyKnitSweater,
  BodyPeterPanCollarShirt,
  BodyPolkaDotShirt,
  BodyTieShirt,
  BodyTurtleneckShirt,
  EyesStandard,
  GlassesGlasses,
  HairAfro,
  HairCurlyBun,
  HairLongWavy,
  HairMediumStraigh,
  HairPonyTail,
  HairShort,
  HairShortCurly,
  HairSideSwept,
  HeadStandard,
  MouthSmile,
  MouthStandard,
  NoseStandard,
} from '@avatune/ashleyy-assets/angular'
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
  .withComponents('accessories', {
    earrings: toAngularItem(AccessoriesEarrings),
    mask: toAngularItem(AccessoriesMask),
  })
  .withComponents('body', {
    buttonShirt: toAngularItem(BodyButtonShirt),
    doubleCollarShirt: toAngularItem(BodyDoubleCollarShirt),
    knitSweater: toAngularItem(BodyKnitSweater),
    peterPanCollarShirt: toAngularItem(BodyPeterPanCollarShirt),
    polkaDotShirt: toAngularItem(BodyPolkaDotShirt),
    tieShirt: toAngularItem(BodyTieShirt),
    turtleneckShirt: toAngularItem(BodyTurtleneckShirt),
  })
  .withComponents('eyes', {
    standard: toAngularItem(EyesStandard),
  })
  .withComponents('glasses', {
    glasses: toAngularItem(GlassesGlasses),
  })
  .withComponents('hair', {
    afro: toAngularItem(HairAfro),
    curlyBun: toAngularItem(HairCurlyBun),
    longWavy: toAngularItem(HairLongWavy),
    mediumStraigh: toAngularItem(HairMediumStraigh),
    ponyTail: toAngularItem(HairPonyTail),
    short: toAngularItem(HairShort),
    shortCurly: toAngularItem(HairShortCurly),
    sideSwept: toAngularItem(HairSideSwept),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    smile: toAngularItem(MouthSmile),
    standard: toAngularItem(MouthStandard),
  })
  .withComponents('nose', {
    standard: toAngularItem(NoseStandard),
  })
  .build() satisfies AngularTheme
