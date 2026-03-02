import {
  BodyCasual,
  BodyShirt,
  BodyTshirt,
  BodyTurtleneck,
  EarsStandard,
  EyebrowsThick1,
  EyebrowsThick2,
  EyebrowsThickSad,
  EyebrowsThin,
  EyebrowsThinCurly,
  EyebrowsThinWide,
  EyesBig,
  EyesHuge,
  EyesMedium,
  EyesOval,
  EyesStandard,
  FaceDetailsBlushes,
  FaceDetailsFreckles,
  FaceHairBeard,
  FaceHairBigBeard,
  FaceHairMustache,
  GlassesAviator,
  GlassesHarry,
  GlassesRound,
  GlassesStandard,
  HairBob,
  HairCurly,
  HairCurlyMedium,
  HairElvis,
  HairLong,
  HairLongThick,
  HairLongWavy,
  HairPonyTail,
  HairRapunzel,
  HairShort,
  HairStylish,
  HairThick,
  HairTopKnot,
  HeadStandard,
  MouthLips1,
  MouthLips2,
  MouthLipsSmile,
  MouthOpen,
  MouthOpenDimples,
  MouthSmile1,
  MouthSmile2,
  MouthSmileOpen,
  MouthSmirk,
  MouthWideOpen,
} from '@avatune/kyute-assets/angular'
import type { AngularAvatarItem } from '@avatune/types'
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
    aviator: toAngularItem(GlassesAviator),
    harry: toAngularItem(GlassesHarry),
    round: toAngularItem(GlassesRound),
    standard: toAngularItem(GlassesStandard),
  })
  .withComponents('hair', {
    bob: toAngularItem(HairBob),
    curly: toAngularItem(HairCurly),
    curlyMedium: toAngularItem(HairCurlyMedium),
    elvis: toAngularItem(HairElvis),
    long: toAngularItem(HairLong),
    longThick: toAngularItem(HairLongThick),
    longWavy: toAngularItem(HairLongWavy),
    ponyTail: toAngularItem(HairPonyTail),
    rapunzel: toAngularItem(HairRapunzel),
    short: toAngularItem(HairShort),
    stylish: toAngularItem(HairStylish),
    thick: toAngularItem(HairThick),
    topKnot: toAngularItem(HairTopKnot),
  })
  .withComponents('faceDetails', {
    blushes: toAngularItem(FaceDetailsBlushes),
    freckles: toAngularItem(FaceDetailsFreckles),
  })
  .withComponents('body', {
    casual: toAngularItem(BodyCasual),
    shirt: toAngularItem(BodyShirt),
    tshirt: toAngularItem(BodyTshirt),
    turtleneck: toAngularItem(BodyTurtleneck),
  })
  .withComponents('ears', {
    standard: toAngularItem(EarsStandard),
  })
  .withComponents('eyes', {
    big: toAngularItem(EyesBig),
    huge: toAngularItem(EyesHuge),
    medium: toAngularItem(EyesMedium),
    oval: toAngularItem(EyesOval),
    standard: toAngularItem(EyesStandard),
  })
  .withComponents('eyebrows', {
    thick1: toAngularItem(EyebrowsThick1),
    thick2: toAngularItem(EyebrowsThick2),
    thickSad: toAngularItem(EyebrowsThickSad),
    thin: toAngularItem(EyebrowsThin),
    thinCurly: toAngularItem(EyebrowsThinCurly),
    thinWide: toAngularItem(EyebrowsThinWide),
  })
  .withComponents('faceHair', {
    beard: toAngularItem(FaceHairBeard),
    bigBeard: toAngularItem(FaceHairBigBeard),
    mustache: toAngularItem(FaceHairMustache),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    lips1: toAngularItem(MouthLips1),
    lips2: toAngularItem(MouthLips2),
    lipsSmile: toAngularItem(MouthLipsSmile),
    open: toAngularItem(MouthOpen),
    openDimples: toAngularItem(MouthOpenDimples),
    smile1: toAngularItem(MouthSmile1),
    smile2: toAngularItem(MouthSmile2),
    smileOpen: toAngularItem(MouthSmileOpen),
    smirk: toAngularItem(MouthSmirk),
    wideOpen: toAngularItem(MouthWideOpen),
  })
  .build()
