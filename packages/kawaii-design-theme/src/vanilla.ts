import {
  accessoriesBeanie,
  accessoriesGlass,
  accessoriesHat,
  backHairBraids,
  backHairHijab,
  backHairMedium,
  backHairPuff,
  backHairStraightLong,
  backHairStraightMedium,
  blushesStandart,
  bodyBlouse,
  bodyFlowerCardigan,
  bodySimpleCardigan,
  bodySimpleOverall,
  bodyStriped,
  bodySweaterVest,
  bodySweaterWavy,
  bodyTeeBasic,
  bodyTeeButtoned,
  bodyTeePocket,
  bodyTeeRound,
  earsStandart,
  eyesStandart,
  faceHairBigBeard,
  faceHairChevronMustache,
  faceHairMustache,
  frontHairBubble,
  frontHairCurve,
  frontHairShort,
  frontHairSplit,
  frontHairStraight,
  frontHairUnderCut,
  headStandart,
  mouthSmile,
  neckStandart,
  nosesStandart,
} from '@avatune/kawaii-design-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('accessories', {
    beanie: { code: accessoriesBeanie },
    glass: { code: accessoriesGlass },
    hat: { code: accessoriesHat },
  })
  .withComponents('backHair', {
    braids: { code: backHairBraids },
    hijab: { code: backHairHijab },
    medium: { code: backHairMedium },
    puff: { code: backHairPuff },
    straightLong: { code: backHairStraightLong },
    straightMedium: { code: backHairStraightMedium },
  })
  .withComponents('blushes', {
    standart: { code: blushesStandart },
  })
  .withComponents('body', {
    blouse: { code: bodyBlouse },
    flowerCardigan: { code: bodyFlowerCardigan },
    simpleCardigan: { code: bodySimpleCardigan },
    simpleOverall: { code: bodySimpleOverall },
    striped: { code: bodyStriped },
    sweaterVest: { code: bodySweaterVest },
    sweaterWavy: { code: bodySweaterWavy },
    teeBasic: { code: bodyTeeBasic },
    teeButtoned: { code: bodyTeeButtoned },
    teePocket: { code: bodyTeePocket },
    teeRound: { code: bodyTeeRound },
  })
  .withComponents('ears', {
    standart: { code: earsStandart },
  })
  .withComponents('eyes', {
    standart: { code: eyesStandart },
  })
  .withComponents('faceHair', {
    bigBeard: { code: faceHairBigBeard },
    chevronMustache: { code: faceHairChevronMustache },
    mustache: { code: faceHairMustache },
  })
  .withComponents('hair', {
    bubble: { code: frontHairBubble },
    curve: { code: frontHairCurve },
    short: { code: frontHairShort },
    split: { code: frontHairSplit },
    straight: { code: frontHairStraight },
    underCut: { code: frontHairUnderCut },
  })
  .withComponents('head', {
    standart: { code: headStandart },
  })
  .withComponents('mouth', {
    smile: { code: mouthSmile },
  })
  .withComponents('neck', {
    standart: { code: neckStandart },
  })
  .withComponents('noses', {
    standart: { code: nosesStandart },
  })
  .build() satisfies VanillaTheme
