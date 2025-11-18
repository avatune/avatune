import {
  GlassesGlass,
  HatsBeanie,
  HatsHat,
  HairBraids,
  HairHijab,
  HairMedium,
  HairPuff,
  HairStraightLong,
  HairStraightMedium,
  FaceDetailsBlushes,
  BodyBlouse,
  BodyFlowerCardigan,
  BodySimpleCardigan,
  BodySimpleOverall,
  BodyStriped,
  BodySweaterVest,
  BodySweaterWavy,
  BodyTeeBasic,
  BodyTeeButtoned,
  BodyTeePocket,
  BodyTeeRound,
  EarsStandard,
  EyesStandard,
  FaceHairBigBeard,
  FaceHairChevronMustache,
  FaceHairMustache,
  ForelockBubble,
  ForelockCurve,
  ForelockShort,
  ForelockSplit,
  ForelockStraight,
  ForelockUnderCut,
  HeadStandard,
  MouthSmile,
  NeckStandard,
  NosesStandard,
} from '@avatune/kawaii-design-assets/vue'
import type { VueAvatarItem, VueTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VueAvatarItem>()
  .withComponents('glasses', {
    glass: { Component: GlassesGlass },
  })
  .withComponents('hats', {
    beanie: { Component: HatsBeanie },
    hat: { Component: HatsHat },
  })
  .withComponents('hair', {
    braids: { Component: HairBraids },
    hijab: { Component: HairHijab },
    medium: { Component: HairMedium },
    puff: { Component: HairPuff },
    straightLong: { Component: HairStraightLong },
    straightMedium: { Component: HairStraightMedium },
  })
  .withComponents('faceDetails', {
    blushes: { Component: FaceDetailsBlushes },
  })
  .withComponents('body', {
    blouse: { Component: BodyBlouse },
    flowerCardigan: { Component: BodyFlowerCardigan },
    simpleCardigan: { Component: BodySimpleCardigan },
    simpleOverall: { Component: BodySimpleOverall },
    striped: { Component: BodyStriped },
    sweaterVest: { Component: BodySweaterVest },
    sweaterWavy: { Component: BodySweaterWavy },
    teeBasic: { Component: BodyTeeBasic },
    teeButtoned: { Component: BodyTeeButtoned },
    teePocket: { Component: BodyTeePocket },
    teeRound: { Component: BodyTeeRound },
  })
  .withComponents('ears', {
    standard: { Component: EarsStandard },
  })
  .withComponents('eyes', {
    standard: { Component: EyesStandard },
  })
  .withComponents('faceHair', {
    bigBeard: { Component: FaceHairBigBeard },
    chevronMustache: { Component: FaceHairChevronMustache },
    mustache: { Component: FaceHairMustache },
  })
  .withComponents('forelock', {
    bubble: { Component: ForelockBubble },
    curve: { Component: ForelockCurve },
    short: { Component: ForelockShort },
    split: { Component: ForelockSplit },
    straight: { Component: ForelockStraight },
    underCut: { Component: ForelockUnderCut },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    smile: { Component: MouthSmile },
  })
  .withComponents('neck', {
    standard: { Component: NeckStandard },
  })
  .withComponents('noses', {
    standard: { Component: NosesStandard },
  })
  .build() satisfies VueTheme
