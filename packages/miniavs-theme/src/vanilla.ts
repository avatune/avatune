import {
  bodyGolf,
  bodyStandard,
  eyesConfident,
  eyesHappy,
  eyesStandard,
  faceDetailsBlushes,
  faceHairFreddy,
  faceHairHorshoe,
  faceHairPencilThin,
  faceHairPencilThinBeard,
  glassesGlasses,
  hairBaldness,
  hairClassic1,
  hairClassic2,
  hairCurly,
  hairElvis,
  hairLong,
  hairPonyTail,
  hairSlaughter,
  hairStylish,
  headStandard,
  headThin,
  headWide,
  mouthStandard,
  mouthToothless,
} from '@avatune/miniavs-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    standard: { code: bodyStandard },
    golf: { code: bodyGolf },
  })
  .withComponents('faceDetails', {
    standard: { code: faceDetailsBlushes },
  })
  .withComponents('eyes', {
    standard: { code: eyesStandard },
    confident: { code: eyesConfident },
    happy: { code: eyesHappy },
  })
  .withComponents('faceHair', {
    freddy: { code: faceHairFreddy },
    horshoe: { code: faceHairHorshoe },
    pencilThin: { code: faceHairPencilThin },
    pencilThinBeard: { code: faceHairPencilThinBeard },
  })
  .withComponents('glasses', {
    glasses: { code: glassesGlasses },
  })
  .withComponents('hair', {
    baldness: { code: hairBaldness },
    classic1: { code: hairClassic1 },
    classic2: { code: hairClassic2 },
    curly: { code: hairCurly },
    elvis: { code: hairElvis },
    long: { code: hairLong },
    ponyTail: { code: hairPonyTail },
    slaughter: { code: hairSlaughter },
    stylish: { code: hairStylish },
  })
  .withComponents('head', {
    standard: { code: headStandard },
    thin: { code: headThin },
    wide: { code: headWide },
  })
  .withComponents('mouth', {
    standard: { code: mouthStandard },
    toothless: { code: mouthToothless },
  })
  .build() satisfies VanillaTheme
