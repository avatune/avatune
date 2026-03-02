import {
  AccessoriesCatEars,
  AccessoriesClownNose,
  AccessoriesFaceMask,
  AccessoriesGlasses,
  AccessoriesMustache,
  AccessoriesSailormoonCrown,
  AccessoriesSleepMask,
  AccessoriesSunglasses,
  EyesAngry,
  EyesCherry,
  EyesConfused,
  EyesNormal,
  EyesSad,
  EyesSleepy,
  EyesStarstruck,
  EyesWinking,
  FaceHairBeard,
  FaceHairChinHair,
  FaceHairFuzz,
  FaceHairMustache,
  HairBangs,
  HairBowlCutHair,
  HairBraids,
  HairBunHair,
  HairCurlyBob,
  HairCurlyShortHair,
  HairDreads,
  HairFroBun,
  HairHalfShavedHead,
  HairHijab,
  HairMohawk,
  HairShavedHead,
  HairShortHair,
  HairStraightHair,
  HairWavyBob,
  HeadStandart,
  MouthAwkwardSmile,
  MouthBraces,
  MouthGapSmile,
  MouthKawaii,
  MouthOpenedSmile,
  MouthOpenSad,
  MouthTeethSmile,
  MouthUnimpressed,
} from '@avatune/ashley-seo-assets/angular'
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
    catEars: toAngularItem(AccessoriesCatEars),
    clownNose: toAngularItem(AccessoriesClownNose),
    faceMask: toAngularItem(AccessoriesFaceMask),
    glasses: toAngularItem(AccessoriesGlasses),
    mustache: toAngularItem(AccessoriesMustache),
    sailormoonCrown: toAngularItem(AccessoriesSailormoonCrown),
    sleepMask: toAngularItem(AccessoriesSleepMask),
    sunglasses: toAngularItem(AccessoriesSunglasses),
  })
  .withComponents('eyes', {
    angry: toAngularItem(EyesAngry),
    cherry: toAngularItem(EyesCherry),
    confused: toAngularItem(EyesConfused),
    normal: toAngularItem(EyesNormal),
    sad: toAngularItem(EyesSad),
    sleepy: toAngularItem(EyesSleepy),
    starstruck: toAngularItem(EyesStarstruck),
    winking: toAngularItem(EyesWinking),
  })
  .withComponents('faceHair', {
    beard: toAngularItem(FaceHairBeard),
    chinHair: toAngularItem(FaceHairChinHair),
    fuzz: toAngularItem(FaceHairFuzz),
    mustache: toAngularItem(FaceHairMustache),
  })
  .withComponents('hair', {
    bangs: toAngularItem(HairBangs),
    bowlCutHair: toAngularItem(HairBowlCutHair),
    braids: toAngularItem(HairBraids),
    bunHair: toAngularItem(HairBunHair),
    curlyBob: toAngularItem(HairCurlyBob),
    curlyShortHair: toAngularItem(HairCurlyShortHair),
    dreads: toAngularItem(HairDreads),
    froBun: toAngularItem(HairFroBun),
    halfShavedHead: toAngularItem(HairHalfShavedHead),
    hijab: toAngularItem(HairHijab),
    mohawk: toAngularItem(HairMohawk),
    shavedHead: toAngularItem(HairShavedHead),
    shortHair: toAngularItem(HairShortHair),
    straightHair: toAngularItem(HairStraightHair),
    wavyBob: toAngularItem(HairWavyBob),
  })
  .withComponents('head', {
    standart: toAngularItem(HeadStandart),
  })
  .withComponents('mouth', {
    awkwardSmile: toAngularItem(MouthAwkwardSmile),
    braces: toAngularItem(MouthBraces),
    gapSmile: toAngularItem(MouthGapSmile),
    kawaii: toAngularItem(MouthKawaii),
    openedSmile: toAngularItem(MouthOpenedSmile),
    openSad: toAngularItem(MouthOpenSad),
    teethSmile: toAngularItem(MouthTeethSmile),
    unimpressed: toAngularItem(MouthUnimpressed),
  })
  .build()
