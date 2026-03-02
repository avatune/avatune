import {
  AccessoriesBeautyMark,
  AccessoriesCap,
  AccessoriesEarpieceLeft,
  AccessoriesEarringRight,
  AccessoriesGlassesRound,
  AccessoriesGlassesSquare,
  AccessoriesHeadsetMic,
  AccessoriesMask,
  AccessoriesVisorGlasses,
  BodyHoodie,
  BodyJacket,
  BodyScarfTop,
  BodyShirtTie,
  BodyStripedOverall,
  BodySuit,
  BodyTurtleneck,
  EyebrowsAngled,
  EyebrowsFlat,
  EyebrowsRaised,
  EyebrowsSoft,
  EyebrowsThick,
  EyebrowsThin,
  EyesFocused,
  EyesHappy,
  EyesNeutral,
  EyesSurprised,
  EyesWide,
  FaceHairBeard,
  FaceHairMustache,
  HairCurlyPuff,
  HairCurlyTop,
  HairCurvedLong,
  HairDoubleBuns,
  HairLongBraid,
  HairLongStraight,
  HairLongWave,
  HairLowBun,
  HairShortCurly,
  HairShortFlip,
  HairShortMessy,
  HairShortWave,
  HairSidePonytail,
  HairSideSweep,
  HairSpiky,
  HairTightCurls,
  HairVolumized,
  HeadDiamond,
  HeadHeart,
  HeadOval,
  HeadPear,
  HeadRound,
  HeadSquare,
  HeadThin,
  HeadTriangle,
  HeadWide,
  MouthNeutralLine,
  MouthSmileSmall,
  MouthSmileSoft,
  MouthSmirkLeft,
  MouthSmirkRight,
  MouthTinyDot,
  NoseCurve,
  NoseLong,
  NosePointy,
  NoseRound,
  NoseSmall,
  NoseSoft,
} from '@avatune/fatin-verse-assets/angular'
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
  .withComponents('accessories', {
    beautyMark: toAngularItem(AccessoriesBeautyMark),
    cap: toAngularItem(AccessoriesCap),
    earpieceLeft: toAngularItem(AccessoriesEarpieceLeft),
    earringRight: toAngularItem(AccessoriesEarringRight),
    headsetMic: toAngularItem(AccessoriesHeadsetMic),
    mask: toAngularItem(AccessoriesMask),
  })
  .withComponents('glasses', {
    glassesRound: toAngularItem(AccessoriesGlassesRound),
    glassesSquare: toAngularItem(AccessoriesGlassesSquare),
    visorGlasses: toAngularItem(AccessoriesVisorGlasses),
  })
  .withComponents('hair', {
    curlyPuff: toAngularItem(HairCurlyPuff),
    curlyTop: toAngularItem(HairCurlyTop),
    curvedLong: toAngularItem(HairCurvedLong),
    doubleBuns: toAngularItem(HairDoubleBuns),
    longBraid: toAngularItem(HairLongBraid),
    longStraight: toAngularItem(HairLongStraight),
    longWave: toAngularItem(HairLongWave),
    lowBun: toAngularItem(HairLowBun),
    shortCurly: toAngularItem(HairShortCurly),
    shortFlip: toAngularItem(HairShortFlip),
    shortMessy: toAngularItem(HairShortMessy),
    shortWave: toAngularItem(HairShortWave),
    sidePonytail: toAngularItem(HairSidePonytail),
    sideSweep: toAngularItem(HairSideSweep),
    spiky: toAngularItem(HairSpiky),
    tightCurls: toAngularItem(HairTightCurls),
    volumized: toAngularItem(HairVolumized),
  })
  .withComponents('body', {
    hoodie: toAngularItem(BodyHoodie),
    jacket: toAngularItem(BodyJacket),
    scarfTop: toAngularItem(BodyScarfTop),
    shirtTie: toAngularItem(BodyShirtTie),
    stripedOverall: toAngularItem(BodyStripedOverall),
    suit: toAngularItem(BodySuit),
    turtleneck: toAngularItem(BodyTurtleneck),
  })
  .withComponents('eyes', {
    eyesFocused: toAngularItem(EyesFocused),
    eyesHappy: toAngularItem(EyesHappy),
    eyesNeutral: toAngularItem(EyesNeutral),
    eyesSurprised: toAngularItem(EyesSurprised),
    eyesWide: toAngularItem(EyesWide),
  })
  .withComponents('eyebrows', {
    browAngled: toAngularItem(EyebrowsAngled),
    browFlat: toAngularItem(EyebrowsFlat),
    browRaised: toAngularItem(EyebrowsRaised),
    browSoft: toAngularItem(EyebrowsSoft),
    browThick: toAngularItem(EyebrowsThick),
    browThin: toAngularItem(EyebrowsThin),
  })
  .withComponents('faceHair', {
    beard: toAngularItem(FaceHairBeard),
    mustache: toAngularItem(FaceHairMustache),
  })
  .withComponents('head', {
    diamond: toAngularItem(HeadDiamond),
    heart: toAngularItem(HeadHeart),
    oval: toAngularItem(HeadOval),
    pear: toAngularItem(HeadPear),
    round: toAngularItem(HeadRound),
    square: toAngularItem(HeadSquare),
    thin: toAngularItem(HeadThin),
    triangle: toAngularItem(HeadTriangle),
    wide: toAngularItem(HeadWide),
  })
  .withComponents('mouth', {
    neutralLine: toAngularItem(MouthNeutralLine),
    smileSmall: toAngularItem(MouthSmileSmall),
    smileSoft: toAngularItem(MouthSmileSoft),
    smirkLeft: toAngularItem(MouthSmirkLeft),
    smirkRight: toAngularItem(MouthSmirkRight),
    tinyDot: toAngularItem(MouthTinyDot),
  })
  .withComponents('nose', {
    noseCurve: toAngularItem(NoseCurve),
    noseLong: toAngularItem(NoseLong),
    nosePointy: toAngularItem(NosePointy),
    noseRound: toAngularItem(NoseRound),
    noseSmall: toAngularItem(NoseSmall),
    noseSoft: toAngularItem(NoseSoft),
  })
  .build()
