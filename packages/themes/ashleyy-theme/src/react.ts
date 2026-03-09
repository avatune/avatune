import {
  AccessoriesEarrings,
  AccessoriesMask,
  BodyButtonShirt,
  BodyDoubleCollarShirt,
  BodyKnitSweater,
  BodyPeterPanCollarShirt,
  BodyPolkaDotShirt,
  BodyTieShirt,
  BodyTurtleneckShirt,
  EyesStandard,
  GlassesGlasses,
  HairAfro,
  HairCurlyBun,
  HairLongWavy,
  HairMediumStraigh,
  HairPonyTail,
  HairShort,
  HairShortCurly,
  HairSideSwept,
  HeadStandard,
  MouthSmile,
  MouthStandard,
  NoseStandard,
} from '@avatune/ashleyy-assets/react'
import type { ReactAvatarItem, ReactTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<ReactAvatarItem>()
  .withComponents('accessories', {
    earrings: { Component: AccessoriesEarrings },
    mask: { Component: AccessoriesMask },
  })
  .withComponents('body', {
    buttonShirt: { Component: BodyButtonShirt },
    doubleCollarShirt: { Component: BodyDoubleCollarShirt },
    knitSweater: { Component: BodyKnitSweater },
    peterPanCollarShirt: { Component: BodyPeterPanCollarShirt },
    polkaDotShirt: { Component: BodyPolkaDotShirt },
    tieShirt: { Component: BodyTieShirt },
    turtleneckShirt: { Component: BodyTurtleneckShirt },
  })
  .withComponents('eyes', {
    standard: { Component: EyesStandard },
  })
  .withComponents('glasses', {
    glasses: { Component: GlassesGlasses },
  })
  .withComponents('hair', {
    afro: { Component: HairAfro },
    curlyBun: { Component: HairCurlyBun },
    longWavy: { Component: HairLongWavy },
    mediumStraigh: { Component: HairMediumStraigh },
    ponyTail: { Component: HairPonyTail },
    short: { Component: HairShort },
    shortCurly: { Component: HairShortCurly },
    sideSwept: { Component: HairSideSwept },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    smile: { Component: MouthSmile },
    standard: { Component: MouthStandard },
  })
  .withComponents('nose', {
    standard: { Component: NoseStandard },
  })
  .build() satisfies ReactTheme
