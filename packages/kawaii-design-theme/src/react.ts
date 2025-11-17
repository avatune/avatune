import {
  AccessoriesBeanie,
  AccessoriesGlass,
  AccessoriesHat,
  BackHairBraids,
  BackHairHijab,
  BackHairMedium,
  BackHairPuff,
  BackHairStraightLong,
  BackHairStraightMedium,
  BlushesStandart,
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
  EarsStandart,
  EyesStandart,
  FaceHairBigBeard,
  FaceHairChevronMustache,
  FaceHairMustache,
  FrontHairBubble,
  FrontHairCurve,
  FrontHairShort,
  FrontHairSplit,
  FrontHairStraight,
  FrontHairUnderCut,
  HeadStandart,
  MouthSmile,
  NeckStandart,
  NosesStandart,
} from '@avatune/kawaii-design-assets/react'
import type { ReactAvatarItem, ReactTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<ReactAvatarItem>()
  .withComponents('accessories', {
    beanie: { Component: AccessoriesBeanie },
    glass: { Component: AccessoriesGlass },
    hat: { Component: AccessoriesHat },
  })
  .withComponents('backHair', {
    braids: { Component: BackHairBraids },
    hijab: { Component: BackHairHijab },
    medium: { Component: BackHairMedium },
    puff: { Component: BackHairPuff },
    straightLong: { Component: BackHairStraightLong },
    straightMedium: { Component: BackHairStraightMedium },
  })
  .withComponents('blushes', {
    standart: { Component: BlushesStandart },
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
    standart: { Component: EarsStandart },
  })
  .withComponents('eyes', {
    standart: { Component: EyesStandart },
  })
  .withComponents('faceHair', {
    bigBeard: { Component: FaceHairBigBeard },
    chevronMustache: { Component: FaceHairChevronMustache },
    mustache: { Component: FaceHairMustache },
  })
  .withComponents('hair', {
    bubble: { Component: FrontHairBubble },
    curve: { Component: FrontHairCurve },
    short: { Component: FrontHairShort },
    split: { Component: FrontHairSplit },
    straight: { Component: FrontHairStraight },
    underCut: { Component: FrontHairUnderCut },
  })
  .withComponents('head', {
    standart: { Component: HeadStandart },
  })
  .withComponents('mouth', {
    smile: { Component: MouthSmile },
  })
  .withComponents('neck', {
    standart: { Component: NeckStandart },
  })
  .withComponents('noses', {
    standart: { Component: NosesStandart },
  })
  .build() satisfies ReactTheme
