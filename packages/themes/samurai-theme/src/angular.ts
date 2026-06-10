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
} from '@avatune/samurai-assets/angular'
import type { AngularAvatarItem } from '@avatune/types'
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
    kimono: toAngularItem(BodyKimono),
    katana: toAngularItem(BodyKatana),
    armor: toAngularItem(BodyArmor),
  })
  .withComponents('faceDetails', {
    scar: toAngularItem(FaceDetailsScar),
    warpaint: toAngularItem(FaceDetailsWarpaint),
  })
  .withComponents('eyes', {
    stern: toAngularItem(EyesStern),
    fierce: toAngularItem(EyesFierce),
    calm: toAngularItem(EyesCalm),
    focused: toAngularItem(EyesFocused),
  })
  .withComponents('faceHair', {
    mustache: toAngularItem(FaceHairMustache),
    beard: toAngularItem(FaceHairBeard),
  })
  .withComponents('accessories', {
    oniMask: toAngularItem(AccessoriesOniMask),
    menpo: toAngularItem(AccessoriesMenpo),
  })
  .withComponents('hats', {
    kasa: toAngularItem(HatsKasa),
    kabuto: toAngularItem(HatsKabuto),
  })
  .withComponents('hair', {
    topknot: toAngularItem(HairTopknot),
    chonmage: toAngularItem(HairChonmage),
    bun: toAngularItem(HairBun),
    ronin: toAngularItem(HairRonin),
    warriorTail: toAngularItem(HairWarriorTail),
    shaved: toAngularItem(HairShaved),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
    broad: toAngularItem(HeadBroad),
  })
  .withComponents('mouth', {
    stern: toAngularItem(MouthStern),
    grim: toAngularItem(MouthGrim),
    shout: toAngularItem(MouthShout),
  })
  .build()
