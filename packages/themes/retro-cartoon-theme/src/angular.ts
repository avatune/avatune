import {
  BodyPasted1,
  BodyPasted2,
  BodyPasted3,
  BodyPasted4,
  BodyPasted5,
  BodyPasted6,
  EyebrowsPasted1,
  EyebrowsPasted2,
  EyebrowsPasted3,
  EyebrowsPasted4,
  EyebrowsPasted5,
  EyesPasted1,
  EyesPasted2,
  EyesPasted3,
  EyesPasted4,
  EyesPasted5,
  HairPasted2,
  HairPasted3,
  HairPasted4,
  HairPasted5,
  HairPasted6,
  HairPasted7,
  HairPasted8,
  HairPasted9,
  HeadPasted2,
  MouthPasted1,
  MouthPasted2,
  MouthPasted3,
  MouthPasted4,
  MouthPasted5,
  MouthPasted6,
  NosePasted1,
} from '@avatune/retro-cartoon-assets/angular'
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
    pasted1: toAngularItem(BodyPasted1),
    pasted2: toAngularItem(BodyPasted2),
    pasted3: toAngularItem(BodyPasted3),
    pasted4: toAngularItem(BodyPasted4),
    pasted5: toAngularItem(BodyPasted5),
    pasted6: toAngularItem(BodyPasted6),
  })
  .withComponents('eyebrows', {
    pasted1: toAngularItem(EyebrowsPasted1),
    pasted2: toAngularItem(EyebrowsPasted2),
    pasted3: toAngularItem(EyebrowsPasted3),
    pasted4: toAngularItem(EyebrowsPasted4),
    pasted5: toAngularItem(EyebrowsPasted5),
  })
  .withComponents('eyes', {
    pasted1: toAngularItem(EyesPasted1),
    pasted2: toAngularItem(EyesPasted2),
    pasted3: toAngularItem(EyesPasted3),
    pasted4: toAngularItem(EyesPasted4),
    pasted5: toAngularItem(EyesPasted5),
  })
  .withComponents('hair', {
    pasted2: toAngularItem(HairPasted2),
    pasted3: toAngularItem(HairPasted3),
    pasted4: toAngularItem(HairPasted4),
    pasted5: toAngularItem(HairPasted5),
    pasted6: toAngularItem(HairPasted6),
    pasted7: toAngularItem(HairPasted7),
    pasted8: toAngularItem(HairPasted8),
    pasted9: toAngularItem(HairPasted9),
  })
  .withComponents('head', {
    pasted2: toAngularItem(HeadPasted2),
  })
  .withComponents('mouth', {
    pasted1: toAngularItem(MouthPasted1),
    pasted2: toAngularItem(MouthPasted2),
    pasted3: toAngularItem(MouthPasted3),
    pasted4: toAngularItem(MouthPasted4),
    pasted5: toAngularItem(MouthPasted5),
    pasted6: toAngularItem(MouthPasted6),
  })
  .withComponents('nose', {
    pasted1: toAngularItem(NosePasted1),
  })
  .build() satisfies AngularTheme
