import type { ReactAvatarItem } from '@avatune/types'
import {
  AccessoriesBats,
  AccessoriesHeartGlasses,
  AccessoriesHoopEarring,
  AccessoriesHorns,
  AccessoriesMask,
  AccessoriesMonocle,
  BodyBatCape,
  BodyBikerJacket,
  BodyCloak,
  BodyCorset,
  BodyDenimVest,
  BodyRuffleShirt,
  BodyTailcoat,
  EyebrowsCurved,
  EyebrowsStern,
  EyebrowsStraight,
  EyebrowsThin,
  EyesArched,
  EyesClosed,
  EyesDot,
  EyesDroopy,
  EyesGlare,
  EyesHappy,
  EyesLidded,
  EyesWide,
  HairBobBangs,
  HairLongStraight,
  HairLongWavy,
  HairPigtails,
  HairShaggy,
  HairSlickedBack,
  HairSpiky,
  HairWavyBob,
  HairWidowsPeak,
  HatsBeanie,
  HatsTopHat,
  HeadStandard,
  MouthFangGrin,
  MouthFlat,
  MouthHiss,
  MouthLaugh,
  MouthSmile,
  MouthSmirk,
  NoseNostrils,
  NoseWide,
} from '@avatune/vampire-skin-assets/react'
import shared from './shared'

export default shared
  .toFramework<ReactAvatarItem>()
  .withComponents('accessories', {
    bats: { Component: AccessoriesBats },
    heartGlasses: { Component: AccessoriesHeartGlasses },
    hoopEarring: { Component: AccessoriesHoopEarring },
    horns: { Component: AccessoriesHorns },
    mask: { Component: AccessoriesMask },
    monocle: { Component: AccessoriesMonocle },
  })
  .withComponents('body', {
    batCape: { Component: BodyBatCape },
    bikerJacket: { Component: BodyBikerJacket },
    cloak: { Component: BodyCloak },
    corset: { Component: BodyCorset },
    denimVest: { Component: BodyDenimVest },
    ruffleShirt: { Component: BodyRuffleShirt },
    tailcoat: { Component: BodyTailcoat },
  })
  .withComponents('eyebrows', {
    curved: { Component: EyebrowsCurved },
    stern: { Component: EyebrowsStern },
    straight: { Component: EyebrowsStraight },
    thin: { Component: EyebrowsThin },
  })
  .withComponents('eyes', {
    arched: { Component: EyesArched },
    closed: { Component: EyesClosed },
    dot: { Component: EyesDot },
    droopy: { Component: EyesDroopy },
    glare: { Component: EyesGlare },
    happy: { Component: EyesHappy },
    lidded: { Component: EyesLidded },
    wide: { Component: EyesWide },
  })
  .withComponents('hair', {
    bobBangs: { Component: HairBobBangs },
    longStraight: { Component: HairLongStraight },
    longWavy: { Component: HairLongWavy },
    pigtails: { Component: HairPigtails },
    shaggy: { Component: HairShaggy },
    slickedBack: { Component: HairSlickedBack },
    spiky: { Component: HairSpiky },
    wavyBob: { Component: HairWavyBob },
    widowsPeak: { Component: HairWidowsPeak },
  })
  .withComponents('hats', {
    beanie: { Component: HatsBeanie },
    topHat: { Component: HatsTopHat },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    fangGrin: { Component: MouthFangGrin },
    flat: { Component: MouthFlat },
    hiss: { Component: MouthHiss },
    laugh: { Component: MouthLaugh },
    smile: { Component: MouthSmile },
    smirk: { Component: MouthSmirk },
  })
  .withComponents('nose', {
    nostrils: { Component: NoseNostrils },
    wide: { Component: NoseWide },
  })
  .build()
