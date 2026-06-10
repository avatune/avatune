import {
  accessoriesMenpo,
  accessoriesOniMask,
  bodyArmor,
  bodyKatana,
  bodyKimono,
  eyesCalm,
  eyesFierce,
  eyesFocused,
  eyesStern,
  faceDetailsScar,
  faceDetailsWarpaint,
  faceHairBeard,
  faceHairMustache,
  hairBun,
  hairChonmage,
  hairRonin,
  hairShaved,
  hairTopknot,
  hairWarriorTail,
  hatsKabuto,
  hatsKasa,
  headBroad,
  headStandard,
  mouthGrim,
  mouthShout,
  mouthStern,
} from '@avatune/samurai-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    kimono: { code: bodyKimono },
    katana: { code: bodyKatana },
    armor: { code: bodyArmor },
  })
  .withComponents('faceDetails', {
    scar: { code: faceDetailsScar },
    warpaint: { code: faceDetailsWarpaint },
  })
  .withComponents('eyes', {
    stern: { code: eyesStern },
    fierce: { code: eyesFierce },
    calm: { code: eyesCalm },
    focused: { code: eyesFocused },
  })
  .withComponents('faceHair', {
    mustache: { code: faceHairMustache },
    beard: { code: faceHairBeard },
  })
  .withComponents('accessories', {
    oniMask: { code: accessoriesOniMask },
    menpo: { code: accessoriesMenpo },
  })
  .withComponents('hats', {
    kasa: { code: hatsKasa },
    kabuto: { code: hatsKabuto },
  })
  .withComponents('hair', {
    topknot: { code: hairTopknot },
    chonmage: { code: hairChonmage },
    bun: { code: hairBun },
    ronin: { code: hairRonin },
    warriorTail: { code: hairWarriorTail },
    shaved: { code: hairShaved },
  })
  .withComponents('head', {
    standard: { code: headStandard },
    broad: { code: headBroad },
  })
  .withComponents('mouth', {
    stern: { code: mouthStern },
    grim: { code: mouthGrim },
    shout: { code: mouthShout },
  })
  .build() satisfies VanillaTheme
