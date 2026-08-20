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
} from '@avatune/toon-flat-assets/angular'
import type { AngularAvatarItem, AngularTheme } from '@avatune/types'
import shared from './shared'

const toAngularItem = (asset: {
  template: string | ((color: string, uid: string) => string)
}) => ({
  template: asset.template,
  Component: null,
})

export default shared
  .toFramework<AngularAvatarItem>()
  .withComponents('body', {
    halfZip: toAngularItem(BodyHalfZip),
    hoodie: toAngularItem(BodyHoodie),
    jacket: toAngularItem(BodyJacket),
    shirt: toAngularItem(BodyShirt),
    sweater: toAngularItem(BodySweater),
    tshirt: toAngularItem(BodyTshirt),
    turtleneck: toAngularItem(BodyTurtleneck),
    vest: toAngularItem(BodyVest),
  })
  .withComponents('eyes', {
    almond: toAngularItem(EyesAlmond),
    big: toAngularItem(EyesBig),
    narrow: toAngularItem(EyesNarrow),
  })
  .withComponents('hair', {
    beanie: toAngularItem(HairBeanie),
    bowlerHat: toAngularItem(HairBowlerHat),
    bun: toAngularItem(HairBun),
    dreads: toAngularItem(HairDreads),
    messy: toAngularItem(HairMessy),
    ponyTail: toAngularItem(HairPonyTail),
    short: toAngularItem(HairShort),
    sidePart: toAngularItem(HairSidePart),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    flat: toAngularItem(MouthFlat),
    laugh: toAngularItem(MouthLaugh),
    openSmile: toAngularItem(MouthOpenSmile),
    smile: toAngularItem(MouthSmile),
    smirk: toAngularItem(MouthSmirk),
  })
  .withComponents('nose', {
    curve: toAngularItem(NoseCurve),
    flat: toAngularItem(NoseFlat),
    thin: toAngularItem(NoseThin),
  })
  .build() satisfies AngularTheme
