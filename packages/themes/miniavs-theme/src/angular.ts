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
} from '@avatune/miniavs-assets/angular'
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
    standard: toAngularItem(BodyStandard),
    golf: toAngularItem(BodyGolf),
  })
  .withComponents('faceDetails', {
    standard: toAngularItem(FaceDetailsBlushes),
  })
  .withComponents('eyes', {
    standard: toAngularItem(EyesStandard),
    confident: toAngularItem(EyesConfident),
    happy: toAngularItem(EyesHappy),
  })
  .withComponents('faceHair', {
    freddy: toAngularItem(FaceHairFreddy),
    horshoe: toAngularItem(FaceHairHorshoe),
    pencilThin: toAngularItem(FaceHairPencilThin),
    pencilThinBeard: toAngularItem(FaceHairPencilThinBeard),
  })
  .withComponents('glasses', {
    glasses: toAngularItem(GlassesGlasses),
  })
  .withComponents('hair', {
    baldness: toAngularItem(HairBaldness),
    classic1: toAngularItem(HairClassic1),
    classic2: toAngularItem(HairClassic2),
    curly: toAngularItem(HairCurly),
    elvis: toAngularItem(HairElvis),
    long: toAngularItem(HairLong),
    ponyTail: toAngularItem(HairPonyTail),
    slaughter: toAngularItem(HairSlaughter),
    stylish: toAngularItem(HairStylish),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
    thin: toAngularItem(HeadThin),
    wide: toAngularItem(HeadWide),
  })
  .withComponents('mouth', {
    standard: toAngularItem(MouthStandard),
    toothless: toAngularItem(MouthToothless),
  })
  .build()
