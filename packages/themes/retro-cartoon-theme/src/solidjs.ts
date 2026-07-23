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
} from '@avatune/retro-cartoon-assets/solid'
import type { SolidJsAvatarItem, SolidJsTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SolidJsAvatarItem>()
  .withComponents('body', {
    pasted1: { Component: BodyPasted1 },
    pasted2: { Component: BodyPasted2 },
    pasted3: { Component: BodyPasted3 },
    pasted4: { Component: BodyPasted4 },
    pasted5: { Component: BodyPasted5 },
    pasted6: { Component: BodyPasted6 },
  })
  .withComponents('eyebrows', {
    pasted1: { Component: EyebrowsPasted1 },
    pasted2: { Component: EyebrowsPasted2 },
    pasted3: { Component: EyebrowsPasted3 },
    pasted4: { Component: EyebrowsPasted4 },
    pasted5: { Component: EyebrowsPasted5 },
  })
  .withComponents('eyes', {
    pasted1: { Component: EyesPasted1 },
    pasted2: { Component: EyesPasted2 },
    pasted3: { Component: EyesPasted3 },
    pasted4: { Component: EyesPasted4 },
    pasted5: { Component: EyesPasted5 },
  })
  .withComponents('hair', {
    pasted2: { Component: HairPasted2 },
    pasted3: { Component: HairPasted3 },
    pasted4: { Component: HairPasted4 },
    pasted5: { Component: HairPasted5 },
    pasted6: { Component: HairPasted6 },
    pasted7: { Component: HairPasted7 },
    pasted8: { Component: HairPasted8 },
    pasted9: { Component: HairPasted9 },
  })
  .withComponents('head', {
    pasted2: { Component: HeadPasted2 },
  })
  .withComponents('mouth', {
    pasted1: { Component: MouthPasted1 },
    pasted2: { Component: MouthPasted2 },
    pasted3: { Component: MouthPasted3 },
    pasted4: { Component: MouthPasted4 },
    pasted5: { Component: MouthPasted5 },
    pasted6: { Component: MouthPasted6 },
  })
  .withComponents('nose', {
    pasted1: { Component: NosePasted1 },
  })
  .build() satisfies SolidJsTheme
