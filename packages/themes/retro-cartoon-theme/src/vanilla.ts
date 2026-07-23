import {
  bodyPasted1,
  bodyPasted2,
  bodyPasted3,
  bodyPasted4,
  bodyPasted5,
  bodyPasted6,
  eyebrowsPasted1,
  eyebrowsPasted2,
  eyebrowsPasted3,
  eyebrowsPasted4,
  eyebrowsPasted5,
  eyesPasted1,
  eyesPasted2,
  eyesPasted3,
  eyesPasted4,
  eyesPasted5,
  hairPasted2,
  hairPasted3,
  hairPasted4,
  hairPasted5,
  hairPasted6,
  hairPasted7,
  hairPasted8,
  hairPasted9,
  headPasted2,
  mouthPasted1,
  mouthPasted2,
  mouthPasted3,
  mouthPasted4,
  mouthPasted5,
  mouthPasted6,
  nosePasted1,
} from '@avatune/retro-cartoon-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    pasted1: { code: bodyPasted1 },
    pasted2: { code: bodyPasted2 },
    pasted3: { code: bodyPasted3 },
    pasted4: { code: bodyPasted4 },
    pasted5: { code: bodyPasted5 },
    pasted6: { code: bodyPasted6 },
  })
  .withComponents('eyebrows', {
    pasted1: { code: eyebrowsPasted1 },
    pasted2: { code: eyebrowsPasted2 },
    pasted3: { code: eyebrowsPasted3 },
    pasted4: { code: eyebrowsPasted4 },
    pasted5: { code: eyebrowsPasted5 },
  })
  .withComponents('eyes', {
    pasted1: { code: eyesPasted1 },
    pasted2: { code: eyesPasted2 },
    pasted3: { code: eyesPasted3 },
    pasted4: { code: eyesPasted4 },
    pasted5: { code: eyesPasted5 },
  })
  .withComponents('hair', {
    pasted2: { code: hairPasted2 },
    pasted3: { code: hairPasted3 },
    pasted4: { code: hairPasted4 },
    pasted5: { code: hairPasted5 },
    pasted6: { code: hairPasted6 },
    pasted7: { code: hairPasted7 },
    pasted8: { code: hairPasted8 },
    pasted9: { code: hairPasted9 },
  })
  .withComponents('head', {
    pasted2: { code: headPasted2 },
  })
  .withComponents('mouth', {
    pasted1: { code: mouthPasted1 },
    pasted2: { code: mouthPasted2 },
    pasted3: { code: mouthPasted3 },
    pasted4: { code: mouthPasted4 },
    pasted5: { code: mouthPasted5 },
    pasted6: { code: mouthPasted6 },
  })
  .withComponents('nose', {
    pasted1: { code: nosePasted1 },
  })
  .build() satisfies VanillaTheme
