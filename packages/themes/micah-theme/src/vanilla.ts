import {
  accessoriesHoopEarRing,
  accessoriesStudEarRing,
  bodyCollaredShirt,
  bodyCrewShirt,
  bodyOpenShirt,
  earsMedium,
  earsSmall,
  eyebrowsDown,
  eyebrowsEyelashesDown,
  eyebrowsEyelashesUp,
  eyebrowsUp,
  eyesEyeshadow,
  eyesRound,
  eyesSmiling,
  eyesStandard,
  faceHairBeard,
  faceHairScruff,
  glassesRound,
  glassesSquare,
  hairDannyPhantom,
  hairDougFunny,
  hairFonze,
  hairFull,
  hairMrT,
  hairPixie,
  hairTurban,
  headStandard,
  mouthFrown,
  mouthLaughing,
  mouthNervous,
  mouthPucker,
  mouthSad,
  mouthSmile,
  mouthSmirk,
  mouthSurprised,
  noseCurve,
  nosePointed,
  noseRound,
} from '@avatune/micah-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('accessories', {
    studEarRing: { code: accessoriesStudEarRing },
    hoopEarRing: { code: accessoriesHoopEarRing },
  })
  .withComponents('body', {
    collaredShirt: { code: bodyCollaredShirt },
    crewShirt: { code: bodyCrewShirt },
    openShirt: { code: bodyOpenShirt },
  })
  .withComponents('ears', {
    medium: { code: earsMedium },
    small: { code: earsSmall },
  })
  .withComponents('eyebrows', {
    down: { code: eyebrowsDown },
    eyelashesDown: { code: eyebrowsEyelashesDown },
    eyelashesUp: { code: eyebrowsEyelashesUp },
    up: { code: eyebrowsUp },
  })
  .withComponents('eyes', {
    eyeshadow: { code: eyesEyeshadow },
    round: { code: eyesRound },
    smiling: { code: eyesSmiling },
    standard: { code: eyesStandard },
  })
  .withComponents('faceHair', {
    beard: { code: faceHairBeard },
    scruff: { code: faceHairScruff },
  })
  .withComponents('glasses', {
    round: { code: glassesRound },
    square: { code: glassesSquare },
  })
  .withComponents('hair', {
    dannyPhantom: { code: hairDannyPhantom },
    dougFunny: { code: hairDougFunny },
    fonze: { code: hairFonze },
    full: { code: hairFull },
    mrT: { code: hairMrT },
    pixie: { code: hairPixie },
    turban: { code: hairTurban },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    frown: { code: mouthFrown },
    laughing: { code: mouthLaughing },
    nervous: { code: mouthNervous },
    pucker: { code: mouthPucker },
    sad: { code: mouthSad },
    smile: { code: mouthSmile },
    smirk: { code: mouthSmirk },
    surprised: { code: mouthSurprised },
  })
  .withComponents('nose', {
    curve: { code: noseCurve },
    pointed: { code: nosePointed },
    round: { code: noseRound },
  })
  .build() satisfies VanillaTheme
