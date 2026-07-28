import {
  bodyArmor,
  bodyFurJacket,
  bodyHoodie,
  bodyOpenJacket,
  bodyStuddedVest,
  bodyTunic,
  bodyWrapTunic,
  eyebrowsAngry,
  eyebrowsCalm,
  eyebrowsConfident,
  eyebrowsDefault,
  eyebrowsNeutral,
  eyesDefault,
  eyesScared,
  eyesTired,
  hairBraid,
  hairBraids,
  hairBun,
  hairDreadlocks,
  hairLong,
  hairMohawk,
  hairShort,
  hairSideForelock,
  headDefault,
  headLarge,
  headSqaure,
  mouthDracula,
  mouthHooky,
  mouthNeutral,
  mouthOpen,
  mouthOpenTusks,
  mouthSmile,
  noseDefault,
} from '@avatune/orks-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    armor: { code: bodyArmor },
    furJacket: { code: bodyFurJacket },
    hoodie: { code: bodyHoodie },
    openJacket: { code: bodyOpenJacket },
    studdedVest: { code: bodyStuddedVest },
    tunic: { code: bodyTunic },
    wrapTunic: { code: bodyWrapTunic },
  })
  .withComponents('eyebrows', {
    angry: { code: eyebrowsAngry },
    calm: { code: eyebrowsCalm },
    confident: { code: eyebrowsConfident },
    default: { code: eyebrowsDefault },
    neutral: { code: eyebrowsNeutral },
  })
  .withComponents('eyes', {
    default: { code: eyesDefault },
    scared: { code: eyesScared },
    tired: { code: eyesTired },
  })
  .withComponents('hair', {
    braid: { code: hairBraid },
    braids: { code: hairBraids },
    bun: { code: hairBun },
    dreadlocks: { code: hairDreadlocks },
    long: { code: hairLong },
    mohawk: { code: hairMohawk },
    short: { code: hairShort },
    sideForelock: { code: hairSideForelock },
  })
  .withComponents('head', {
    default: { code: headDefault },
    large: { code: headLarge },
    sqaure: { code: headSqaure },
  })
  .withComponents('mouth', {
    dracula: { code: mouthDracula },
    hooky: { code: mouthHooky },
    neutral: { code: mouthNeutral },
    open: { code: mouthOpen },
    openTusks: { code: mouthOpenTusks },
    smile: { code: mouthSmile },
  })
  .withComponents('nose', {
    default: { code: noseDefault },
  })
  .build() satisfies VanillaTheme
