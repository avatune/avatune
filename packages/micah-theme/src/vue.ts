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
  NosesCurve,
  NosesPointed,
  NosesRound,
} from '@avatune/micah-assets/vue'
import type { VueAvatarItem, VueTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VueAvatarItem>()
  .withComponents('accessories', {
    studEarRing: { Component: AccessoriesStudEarRing },
    hoopEarRing: { Component: AccessoriesHoopEarRing },
  })
  .withComponents('body', {
    collaredShirt: { Component: BodyCollaredShirt },
    crewShirt: { Component: BodyCrewShirt },
    openShirt: { Component: BodyOpenShirt },
  })
  .withComponents('ears', {
    medium: { Component: EarsMedium },
    small: { Component: EarsSmall },
  })
  .withComponents('eyebrows', {
    down: { Component: EyebrowsDown },
    eyelashesDown: { Component: EyebrowsEyelashesDown },
    eyelashesUp: { Component: EyebrowsEyelashesUp },
    up: { Component: EyebrowsUp },
  })
  .withComponents('eyes', {
    eyeshadow: { Component: EyesEyeshadow },
    round: { Component: EyesRound },
    smiling: { Component: EyesSmiling },
    standard: { Component: EyesStandard },
  })
  .withComponents('faceHair', {
    beard: { Component: FaceHairBeard },
    scruff: { Component: FaceHairScruff },
  })
  .withComponents('glasses', {
    round: { Component: GlassesRound },
    square: { Component: GlassesSquare },
  })
  .withComponents('hair', {
    dannyPhantom: { Component: HairDannyPhantom },
    dougFunny: { Component: HairDougFunny },
    fonze: { Component: HairFonze },
    full: { Component: HairFull },
    mrT: { Component: HairMrT },
    pixie: { Component: HairPixie },
    turban: { Component: HairTurban },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    frown: { Component: MouthFrown },
    laughing: { Component: MouthLaughing },
    nervous: { Component: MouthNervous },
    pucker: { Component: MouthPucker },
    sad: { Component: MouthSad },
    smile: { Component: MouthSmile },
    smirk: { Component: MouthSmirk },
    surprised: { Component: MouthSurprised },
  })
  .withComponents('noses', {
    curve: { Component: NosesCurve },
    pointed: { Component: NosesPointed },
    round: { Component: NosesRound },
  })
  .build() satisfies VueTheme
