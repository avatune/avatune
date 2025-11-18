import {
  BodyGolf,
  BodyStandard,
  EyesConfident,
  EyesHappy,
  EyesStandard,
  FaceDetailsBlushes,
  FaceHairFreddy,
  FaceHairHorshoe,
  FaceHairPencilThin,
  FaceHairPencilThinBeard,
  GlassesGlasses,
  HairBaldness,
  HairClassic1,
  HairClassic2,
  HairCurly,
  HairElvis,
  HairLong,
  HairPonyTail,
  HairSlaughter,
  HairStylish,
  HeadStandard,
  HeadThin,
  HeadWide,
  MouthStandard,
  MouthToothless,
} from '@avatune/miniavs-assets/vue'
import type { VueAvatarItem, VueTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VueAvatarItem>()
  .withComponents('body', {
    standard: { Component: BodyStandard },
    golf: { Component: BodyGolf },
  })
  .withComponents('faceDetails', {
    standard: { Component: FaceDetailsBlushes },
  })
  .withComponents('eyes', {
    standard: { Component: EyesStandard },
    confident: { Component: EyesConfident },
    happy: { Component: EyesHappy },
  })
  .withComponents('faceHair', {
    freddy: { Component: FaceHairFreddy },
    horshoe: { Component: FaceHairHorshoe },
    pencilThin: { Component: FaceHairPencilThin },
    pencilThinBeard: { Component: FaceHairPencilThinBeard },
  })
  .withComponents('glasses', {
    glasses: { Component: GlassesGlasses },
  })
  .withComponents('hair', {
    baldness: { Component: HairBaldness },
    classic1: { Component: HairClassic1 },
    classic2: { Component: HairClassic2 },
    curly: { Component: HairCurly },
    elvis: { Component: HairElvis },
    long: { Component: HairLong },
    ponyTail: { Component: HairPonyTail },
    slaughter: { Component: HairSlaughter },
    stylish: { Component: HairStylish },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
    thin: { Component: HeadThin },
    wide: { Component: HeadWide },
  })
  .withComponents('mouth', {
    standard: { Component: MouthStandard },
    toothless: { Component: MouthToothless },
  })
  .build() satisfies VueTheme
