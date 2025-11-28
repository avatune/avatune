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
} from '@avatune/kyute-assets/react-native'
import type { ReactNativeAvatarItem } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<ReactNativeAvatarItem>()
  .withComponents('glasses', {
    aviator: { Component: GlassesAviator },
    harry: { Component: GlassesHarry },
    round: { Component: GlassesRound },
    standard: { Component: GlassesStandard },
  })
  .withComponents('hair', {
    bob: { Component: HairBob },
    curly: { Component: HairCurly },
    curlyMedium: { Component: HairCurlyMedium },
    elvis: { Component: HairElvis },
    long: { Component: HairLong },
    longThick: { Component: HairLongThick },
    longWavy: { Component: HairLongWavy },
    ponyTail: { Component: HairPonyTail },
    rapunzel: { Component: HairRapunzel },
    short: { Component: HairShort },
    stylish: { Component: HairStylish },
    thick: { Component: HairThick },
    topKnot: { Component: HairTopKnot },
  })
  .withComponents('faceDetails', {
    blushes: { Component: FaceDetailsBlushes },
    freckles: { Component: FaceDetailsFreckles },
  })
  .withComponents('body', {
    casual: { Component: BodyCasual },
    shirt: { Component: BodyShirt },
    tshirt: { Component: BodyTshirt },
    turtleneck: { Component: BodyTurtleneck },
  })
  .withComponents('ears', {
    standard: { Component: EarsStandard },
  })
  .withComponents('eyes', {
    big: { Component: EyesBig },
    huge: { Component: EyesHuge },
    medium: { Component: EyesMedium },
    oval: { Component: EyesOval },
    standard: { Component: EyesStandard },
  })
  .withComponents('eyebrows', {
    thick1: { Component: EyebrowsThick1 },
    thick2: { Component: EyebrowsThick2 },
    thickSad: { Component: EyebrowsThickSad },
    thin: { Component: EyebrowsThin },
    thinCurly: { Component: EyebrowsThinCurly },
    thinWide: { Component: EyebrowsThinWide },
  })
  .withComponents('faceHair', {
    beard: { Component: FaceHairBeard },
    bigBeard: { Component: FaceHairBigBeard },
    mustache: { Component: FaceHairMustache },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    lips1: { Component: MouthLips1 },
    lips2: { Component: MouthLips2 },
    lipsSmile: { Component: MouthLipsSmile },
    open: { Component: MouthOpen },
    openDimples: { Component: MouthOpenDimples },
    smile1: { Component: MouthSmile1 },
    smile2: { Component: MouthSmile2 },
    smileOpen: { Component: MouthSmileOpen },
    smirk: { Component: MouthSmirk },
    wideOpen: { Component: MouthWideOpen },
  })
  .build()
