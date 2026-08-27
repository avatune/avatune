import type { VanillaAvatarItem } from '@avatune/types'
import {
  accessoriesBats,
  accessoriesHeartGlasses,
  accessoriesHoopEarring,
  accessoriesHorns,
  accessoriesMask,
  accessoriesMonocle,
  bodyBatCape,
  bodyBikerJacket,
  bodyCloak,
  bodyCorset,
  bodyDenimVest,
  bodyRuffleShirt,
  bodyTailcoat,
  eyebrowsCurved,
  eyebrowsStern,
  eyebrowsStraight,
  eyebrowsThin,
  eyesArched,
  eyesClosed,
  eyesDot,
  eyesDroopy,
  eyesGlare,
  eyesHappy,
  eyesLidded,
  eyesWide,
  hairBobBangs,
  hairLongStraight,
  hairLongWavy,
  hairPigtails,
  hairShaggy,
  hairSlickedBack,
  hairSpiky,
  hairWavyBob,
  hairWidowsPeak,
  hatsBeanie,
  hatsTopHat,
  headStandard,
  mouthFangGrin,
  mouthFlat,
  mouthHiss,
  mouthLaugh,
  mouthSmile,
  mouthSmirk,
  noseNostrils,
  noseWide,
} from '@avatune/vampire-skin-assets'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('accessories', {
    bats: { code: accessoriesBats },
    heartGlasses: { code: accessoriesHeartGlasses },
    hoopEarring: { code: accessoriesHoopEarring },
    horns: { code: accessoriesHorns },
    mask: { code: accessoriesMask },
    monocle: { code: accessoriesMonocle },
  })
  .withComponents('body', {
    batCape: { code: bodyBatCape },
    bikerJacket: { code: bodyBikerJacket },
    cloak: { code: bodyCloak },
    corset: { code: bodyCorset },
    denimVest: { code: bodyDenimVest },
    ruffleShirt: { code: bodyRuffleShirt },
    tailcoat: { code: bodyTailcoat },
  })
  .withComponents('eyebrows', {
    curved: { code: eyebrowsCurved },
    stern: { code: eyebrowsStern },
    straight: { code: eyebrowsStraight },
    thin: { code: eyebrowsThin },
  })
  .withComponents('eyes', {
    arched: { code: eyesArched },
    closed: { code: eyesClosed },
    dot: { code: eyesDot },
    droopy: { code: eyesDroopy },
    glare: { code: eyesGlare },
    happy: { code: eyesHappy },
    lidded: { code: eyesLidded },
    wide: { code: eyesWide },
  })
  .withComponents('hair', {
    bobBangs: { code: hairBobBangs },
    longStraight: { code: hairLongStraight },
    longWavy: { code: hairLongWavy },
    pigtails: { code: hairPigtails },
    shaggy: { code: hairShaggy },
    slickedBack: { code: hairSlickedBack },
    spiky: { code: hairSpiky },
    wavyBob: { code: hairWavyBob },
    widowsPeak: { code: hairWidowsPeak },
  })
  .withComponents('hats', {
    beanie: { code: hatsBeanie },
    topHat: { code: hatsTopHat },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    fangGrin: { code: mouthFangGrin },
    flat: { code: mouthFlat },
    hiss: { code: mouthHiss },
    laugh: { code: mouthLaugh },
    smile: { code: mouthSmile },
    smirk: { code: mouthSmirk },
  })
  .withComponents('nose', {
    nostrils: { code: noseNostrils },
    wide: { code: noseWide },
  })
  .build()
