import {
  bodyHalfZip,
  bodyHoodie,
  bodyJacket,
  bodyShirt,
  bodySweater,
  bodyTshirt,
  bodyTurtleneck,
  bodyVest,
  eyesAlmond,
  eyesBig,
  eyesNarrow,
  hairBeanie,
  hairBowlerHat,
  hairBun,
  hairDreads,
  hairMessy,
  hairPonyTail,
  hairShort,
  hairSidePart,
  headStandard,
  mouthFlat,
  mouthLaugh,
  mouthOpenSmile,
  mouthSmile,
  mouthSmirk,
  noseCurve,
  noseFlat,
  noseThin,
} from '@avatune/toon-flat-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    halfZip: { code: bodyHalfZip },
    hoodie: { code: bodyHoodie },
    jacket: { code: bodyJacket },
    shirt: { code: bodyShirt },
    sweater: { code: bodySweater },
    tshirt: { code: bodyTshirt },
    turtleneck: { code: bodyTurtleneck },
    vest: { code: bodyVest },
  })
  .withComponents('eyes', {
    almond: { code: eyesAlmond },
    big: { code: eyesBig },
    narrow: { code: eyesNarrow },
  })
  .withComponents('hair', {
    beanie: { code: hairBeanie },
    bowlerHat: { code: hairBowlerHat },
    bun: { code: hairBun },
    dreads: { code: hairDreads },
    messy: { code: hairMessy },
    ponyTail: { code: hairPonyTail },
    short: { code: hairShort },
    sidePart: { code: hairSidePart },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    flat: { code: mouthFlat },
    laugh: { code: mouthLaugh },
    openSmile: { code: mouthOpenSmile },
    smile: { code: mouthSmile },
    smirk: { code: mouthSmirk },
  })
  .withComponents('nose', {
    curve: { code: noseCurve },
    flat: { code: noseFlat },
    thin: { code: noseThin },
  })
  .build() satisfies VanillaTheme
