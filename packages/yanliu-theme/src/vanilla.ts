import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import {
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
  earsStandard,
  eyesStandard,
  faceDetailsBlushes,
  faceHairBigBeard,
  faceHairChevronMustache,
  faceHairMustache,
  forelockBubble,
  forelockCurve,
  forelockShort,
  forelockSplit,
  forelockStraight,
  forelockUnderCut,
  glassesGlass,
  hairBraids,
  hairHijab,
  hairMedium,
  hairPuff,
  hairStraightLong,
  hairStraightMedium,
  hatsBeanie,
  hatsHat,
  headStandard,
  mouthSmile,
  neckStandard,
  nosesStandard,
} from '@avatune/yanliu-assets'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('glasses', {
    glass: { code: glassesGlass },
  })
  .withComponents('hats', {
    beanie: { code: hatsBeanie },
    hat: { code: hatsHat },
  })
  .withComponents('hair', {
    braids: { code: hairBraids },
    hijab: { code: hairHijab },
    medium: { code: hairMedium },
    puff: { code: hairPuff },
    straightLong: { code: hairStraightLong },
    straightMedium: { code: hairStraightMedium },
  })
  .withComponents('faceDetails', {
    blushes: { code: faceDetailsBlushes },
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
    standard: { code: earsStandard },
  })
  .withComponents('eyes', {
    standard: { code: eyesStandard },
  })
  .withComponents('faceHair', {
    bigBeard: { code: faceHairBigBeard },
    chevronMustache: { code: faceHairChevronMustache },
    mustache: { code: faceHairMustache },
  })
  .withComponents('forelock', {
    bubble: { code: forelockBubble },
    curve: { code: forelockCurve },
    short: { code: forelockShort },
    split: { code: forelockSplit },
    straight: { code: forelockStraight },
    underCut: { code: forelockUnderCut },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    smile: { code: mouthSmile },
  })
  .withComponents('neck', {
    standard: { code: neckStandard },
  })
  .withComponents('noses', {
    standard: { code: nosesStandard },
  })
  .build() satisfies VanillaTheme
