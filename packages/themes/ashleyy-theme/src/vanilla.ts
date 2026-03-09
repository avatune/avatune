import {
  accessoriesEarrings,
  accessoriesMask,
  bodyButtonShirt,
  bodyDoubleCollarShirt,
  bodyKnitSweater,
  bodyPeterPanCollarShirt,
  bodyPolkaDotShirt,
  bodyTieShirt,
  bodyTurtleneckShirt,
  eyesStandard,
  glassesGlasses,
  hairAfro,
  hairCurlyBun,
  hairLongWavy,
  hairMediumStraigh,
  hairPonyTail,
  hairShort,
  hairShortCurly,
  hairSideSwept,
  headStandard,
  mouthSmile,
  mouthStandard,
  noseStandard,
} from '@avatune/ashleyy-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('accessories', {
    earrings: { code: accessoriesEarrings },
    mask: { code: accessoriesMask },
  })
  .withComponents('body', {
    buttonShirt: { code: bodyButtonShirt },
    doubleCollarShirt: { code: bodyDoubleCollarShirt },
    knitSweater: { code: bodyKnitSweater },
    peterPanCollarShirt: { code: bodyPeterPanCollarShirt },
    polkaDotShirt: { code: bodyPolkaDotShirt },
    tieShirt: { code: bodyTieShirt },
    turtleneckShirt: { code: bodyTurtleneckShirt },
  })
  .withComponents('eyes', {
    standard: { code: eyesStandard },
  })
  .withComponents('glasses', {
    glasses: { code: glassesGlasses },
  })
  .withComponents('hair', {
    afro: { code: hairAfro },
    curlyBun: { code: hairCurlyBun },
    longWavy: { code: hairLongWavy },
    mediumStraigh: { code: hairMediumStraigh },
    ponyTail: { code: hairPonyTail },
    short: { code: hairShort },
    shortCurly: { code: hairShortCurly },
    sideSwept: { code: hairSideSwept },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    smile: { code: mouthSmile },
    standard: { code: mouthStandard },
  })
  .withComponents('nose', {
    standard: { code: noseStandard },
  })
  .build() satisfies VanillaTheme
