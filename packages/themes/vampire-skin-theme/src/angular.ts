import type { AngularAvatarItem } from '@avatune/types'
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
} from '@avatune/vampire-skin-assets/angular'
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
    bats: toAngularItem(AccessoriesBats),
    heartGlasses: toAngularItem(AccessoriesHeartGlasses),
    hoopEarring: toAngularItem(AccessoriesHoopEarring),
    horns: toAngularItem(AccessoriesHorns),
    mask: toAngularItem(AccessoriesMask),
    monocle: toAngularItem(AccessoriesMonocle),
  })
  .withComponents('body', {
    batCape: toAngularItem(BodyBatCape),
    bikerJacket: toAngularItem(BodyBikerJacket),
    cloak: toAngularItem(BodyCloak),
    corset: toAngularItem(BodyCorset),
    denimVest: toAngularItem(BodyDenimVest),
    ruffleShirt: toAngularItem(BodyRuffleShirt),
    tailcoat: toAngularItem(BodyTailcoat),
  })
  .withComponents('eyebrows', {
    curved: toAngularItem(EyebrowsCurved),
    stern: toAngularItem(EyebrowsStern),
    straight: toAngularItem(EyebrowsStraight),
    thin: toAngularItem(EyebrowsThin),
  })
  .withComponents('eyes', {
    arched: toAngularItem(EyesArched),
    closed: toAngularItem(EyesClosed),
    dot: toAngularItem(EyesDot),
    droopy: toAngularItem(EyesDroopy),
    glare: toAngularItem(EyesGlare),
    happy: toAngularItem(EyesHappy),
    lidded: toAngularItem(EyesLidded),
    wide: toAngularItem(EyesWide),
  })
  .withComponents('hair', {
    bobBangs: toAngularItem(HairBobBangs),
    longStraight: toAngularItem(HairLongStraight),
    longWavy: toAngularItem(HairLongWavy),
    pigtails: toAngularItem(HairPigtails),
    shaggy: toAngularItem(HairShaggy),
    slickedBack: toAngularItem(HairSlickedBack),
    spiky: toAngularItem(HairSpiky),
    wavyBob: toAngularItem(HairWavyBob),
    widowsPeak: toAngularItem(HairWidowsPeak),
  })
  .withComponents('hats', {
    beanie: toAngularItem(HatsBeanie),
    topHat: toAngularItem(HatsTopHat),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    fangGrin: toAngularItem(MouthFangGrin),
    flat: toAngularItem(MouthFlat),
    hiss: toAngularItem(MouthHiss),
    laugh: toAngularItem(MouthLaugh),
    smile: toAngularItem(MouthSmile),
    smirk: toAngularItem(MouthSmirk),
  })
  .withComponents('nose', {
    nostrils: toAngularItem(NoseNostrils),
    wide: toAngularItem(NoseWide),
  })
  .build()
