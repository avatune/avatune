import {
  AccessoriesHoopEarRing,
  AccessoriesStudEarRing,
  BodyCollaredShirt,
  BodyCrewShirt,
  BodyOpenShirt,
  EarsMedium,
  EarsSmall,
  EyebrowsDown,
  EyebrowsEyelashesDown,
  EyebrowsEyelashesUp,
  EyebrowsUp,
  EyesEyeshadow,
  EyesRound,
  EyesSmiling,
  EyesStandard,
  FaceHairBeard,
  FaceHairScruff,
  GlassesRound,
  GlassesSquare,
  HairDannyPhantom,
  HairDougFunny,
  HairFonze,
  HairFull,
  HairMrT,
  HairPixie,
  HairTurban,
  HeadStandard,
  MouthFrown,
  MouthLaughing,
  MouthNervous,
  MouthPucker,
  MouthSad,
  MouthSmile,
  MouthSmirk,
  MouthSurprised,
  NoseCurve,
  NosePointed,
  NoseRound,
} from '@avatune/micah-assets/angular'
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
    studEarRing: toAngularItem(AccessoriesStudEarRing),
    hoopEarRing: toAngularItem(AccessoriesHoopEarRing),
  })
  .withComponents('body', {
    collaredShirt: toAngularItem(BodyCollaredShirt),
    crewShirt: toAngularItem(BodyCrewShirt),
    openShirt: toAngularItem(BodyOpenShirt),
  })
  .withComponents('ears', {
    medium: toAngularItem(EarsMedium),
    small: toAngularItem(EarsSmall),
  })
  .withComponents('eyebrows', {
    down: toAngularItem(EyebrowsDown),
    eyelashesDown: toAngularItem(EyebrowsEyelashesDown),
    eyelashesUp: toAngularItem(EyebrowsEyelashesUp),
    up: toAngularItem(EyebrowsUp),
  })
  .withComponents('eyes', {
    eyeshadow: toAngularItem(EyesEyeshadow),
    round: toAngularItem(EyesRound),
    smiling: toAngularItem(EyesSmiling),
    standard: toAngularItem(EyesStandard),
  })
  .withComponents('faceHair', {
    beard: toAngularItem(FaceHairBeard),
    scruff: toAngularItem(FaceHairScruff),
  })
  .withComponents('glasses', {
    round: toAngularItem(GlassesRound),
    square: toAngularItem(GlassesSquare),
  })
  .withComponents('hair', {
    dannyPhantom: toAngularItem(HairDannyPhantom),
    dougFunny: toAngularItem(HairDougFunny),
    fonze: toAngularItem(HairFonze),
    full: toAngularItem(HairFull),
    mrT: toAngularItem(HairMrT),
    pixie: toAngularItem(HairPixie),
    turban: toAngularItem(HairTurban),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    frown: toAngularItem(MouthFrown),
    laughing: toAngularItem(MouthLaughing),
    nervous: toAngularItem(MouthNervous),
    pucker: toAngularItem(MouthPucker),
    sad: toAngularItem(MouthSad),
    smile: toAngularItem(MouthSmile),
    smirk: toAngularItem(MouthSmirk),
    surprised: toAngularItem(MouthSurprised),
  })
  .withComponents('nose', {
    curve: toAngularItem(NoseCurve),
    pointed: toAngularItem(NosePointed),
    round: toAngularItem(NoseRound),
  })
  .build()
