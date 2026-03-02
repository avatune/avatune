import type { AngularAvatarItem } from '@avatune/types'
import {
  BodyBlouse,
  BodyFlowerCardigan,
  BodySimpleCardigan,
  BodySimpleOverall,
  BodyStriped,
  BodySweaterVest,
  BodySweaterWavy,
  BodyTeeBasic,
  BodyTeeButtoned,
  BodyTeePocket,
  BodyTeeRound,
  EarsStandard,
  EyesStandard,
  FaceDetailsBlushes,
  FaceHairBigBeard,
  FaceHairChevronMustache,
  FaceHairMustache,
  ForelockBubble,
  ForelockCurve,
  ForelockShort,
  ForelockSplit,
  ForelockStraight,
  ForelockUnderCut,
  GlassesGlass,
  HairBraids,
  HairHijab,
  HairMedium,
  HairPuff,
  HairStraightLong,
  HairStraightMedium,
  HatsBeanie,
  HatsHat,
  HeadStandard,
  MouthSmile,
  NeckStandard,
  NoseStandard,
} from '@avatune/yanliu-assets/angular'
import shared from './shared'

const toAngularItem = (asset: {
  template: string | ((color: string, uid: string) => string)
}) => ({
  template: asset.template,
  Component: null,
})

export default shared
  .toFramework<AngularAvatarItem>()
  .withComponents('glasses', {
    glass: toAngularItem(GlassesGlass),
  })
  .withComponents('hats', {
    beanie: toAngularItem(HatsBeanie),
    hat: toAngularItem(HatsHat),
  })
  .withComponents('hair', {
    braids: toAngularItem(HairBraids),
    hijab: toAngularItem(HairHijab),
    medium: toAngularItem(HairMedium),
    puff: toAngularItem(HairPuff),
    straightLong: toAngularItem(HairStraightLong),
    straightMedium: toAngularItem(HairStraightMedium),
  })
  .withComponents('faceDetails', {
    blushes: toAngularItem(FaceDetailsBlushes),
  })
  .withComponents('body', {
    blouse: toAngularItem(BodyBlouse),
    flowerCardigan: toAngularItem(BodyFlowerCardigan),
    simpleCardigan: toAngularItem(BodySimpleCardigan),
    simpleOverall: toAngularItem(BodySimpleOverall),
    striped: toAngularItem(BodyStriped),
    sweaterVest: toAngularItem(BodySweaterVest),
    sweaterWavy: toAngularItem(BodySweaterWavy),
    teeBasic: toAngularItem(BodyTeeBasic),
    teeButtoned: toAngularItem(BodyTeeButtoned),
    teePocket: toAngularItem(BodyTeePocket),
    teeRound: toAngularItem(BodyTeeRound),
  })
  .withComponents('ears', {
    standard: toAngularItem(EarsStandard),
  })
  .withComponents('eyes', {
    standard: toAngularItem(EyesStandard),
  })
  .withComponents('faceHair', {
    bigBeard: toAngularItem(FaceHairBigBeard),
    chevronMustache: toAngularItem(FaceHairChevronMustache),
    mustache: toAngularItem(FaceHairMustache),
  })
  .withComponents('forelock', {
    bubble: toAngularItem(ForelockBubble),
    curve: toAngularItem(ForelockCurve),
    short: toAngularItem(ForelockShort),
    split: toAngularItem(ForelockSplit),
    straight: toAngularItem(ForelockStraight),
    underCut: toAngularItem(ForelockUnderCut),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    smile: toAngularItem(MouthSmile),
  })
  .withComponents('neck', {
    standard: toAngularItem(NeckStandard),
  })
  .withComponents('nose', {
    standard: toAngularItem(NoseStandard),
  })
  .build()
