import {
  BodyHalfZip,
  BodyHoodie,
  BodyJacket,
  BodyShirt,
  BodySweater,
  BodyTshirt,
  BodyTurtleneck,
  BodyVest,
  EyesAlmond,
  EyesBig,
  EyesNarrow,
  HairBeanie,
  HairBowlerHat,
  HairBun,
  HairDreads,
  HairMessy,
  HairPonyTail,
  HairShort,
  HairSidePart,
  HeadStandard,
  MouthFlat,
  MouthLaugh,
  MouthOpenSmile,
  MouthSmile,
  MouthSmirk,
  NoseCurve,
  NoseFlat,
  NoseThin,
} from '@avatune/toon-flat-assets/svelte'
import type { SvelteAvatarItem, SvelteTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SvelteAvatarItem>()
  .withComponents('body', {
    halfZip: { Component: BodyHalfZip },
    hoodie: { Component: BodyHoodie },
    jacket: { Component: BodyJacket },
    shirt: { Component: BodyShirt },
    sweater: { Component: BodySweater },
    tshirt: { Component: BodyTshirt },
    turtleneck: { Component: BodyTurtleneck },
    vest: { Component: BodyVest },
  })
  .withComponents('eyes', {
    almond: { Component: EyesAlmond },
    big: { Component: EyesBig },
    narrow: { Component: EyesNarrow },
  })
  .withComponents('hair', {
    beanie: { Component: HairBeanie },
    bowlerHat: { Component: HairBowlerHat },
    bun: { Component: HairBun },
    dreads: { Component: HairDreads },
    messy: { Component: HairMessy },
    ponyTail: { Component: HairPonyTail },
    short: { Component: HairShort },
    sidePart: { Component: HairSidePart },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    flat: { Component: MouthFlat },
    laugh: { Component: MouthLaugh },
    openSmile: { Component: MouthOpenSmile },
    smile: { Component: MouthSmile },
    smirk: { Component: MouthSmirk },
  })
  .withComponents('nose', {
    curve: { Component: NoseCurve },
    flat: { Component: NoseFlat },
    thin: { Component: NoseThin },
  })
  .build() satisfies SvelteTheme
