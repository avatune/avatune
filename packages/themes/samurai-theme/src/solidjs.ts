import {
  AccessoriesMenpo,
  AccessoriesOniMask,
  BodyArmor,
  BodyKatana,
  BodyKimono,
  EyesCalm,
  EyesFierce,
  EyesFocused,
  EyesStern,
  FaceDetailsScar,
  FaceDetailsWarpaint,
  FaceHairBeard,
  FaceHairMustache,
  HairBun,
  HairChonmage,
  HairRonin,
  HairShaved,
  HairTopknot,
  HairWarriorTail,
  HatsKabuto,
  HatsKasa,
  HeadBroad,
  HeadStandard,
  MouthGrim,
  MouthShout,
  MouthStern,
} from '@avatune/samurai-assets/solid'
import type { SolidJsAvatarItem, SolidJsTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SolidJsAvatarItem>()
  .withComponents('body', {
    kimono: { Component: BodyKimono },
    katana: { Component: BodyKatana },
    armor: { Component: BodyArmor },
  })
  .withComponents('faceDetails', {
    scar: { Component: FaceDetailsScar },
    warpaint: { Component: FaceDetailsWarpaint },
  })
  .withComponents('eyes', {
    stern: { Component: EyesStern },
    fierce: { Component: EyesFierce },
    calm: { Component: EyesCalm },
    focused: { Component: EyesFocused },
  })
  .withComponents('faceHair', {
    mustache: { Component: FaceHairMustache },
    beard: { Component: FaceHairBeard },
  })
  .withComponents('accessories', {
    oniMask: { Component: AccessoriesOniMask },
    menpo: { Component: AccessoriesMenpo },
  })
  .withComponents('hats', {
    kasa: { Component: HatsKasa },
    kabuto: { Component: HatsKabuto },
  })
  .withComponents('hair', {
    topknot: { Component: HairTopknot },
    chonmage: { Component: HairChonmage },
    bun: { Component: HairBun },
    ronin: { Component: HairRonin },
    warriorTail: { Component: HairWarriorTail },
    shaved: { Component: HairShaved },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
    broad: { Component: HeadBroad },
  })
  .withComponents('mouth', {
    stern: { Component: MouthStern },
    grim: { Component: MouthGrim },
    shout: { Component: MouthShout },
  })
  .build() satisfies SolidJsTheme
