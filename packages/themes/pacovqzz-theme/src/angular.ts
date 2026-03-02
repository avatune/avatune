import {
  BodyHoodie,
  BodyOverall,
  BodyOvershirt1,
  BodyOvershirt2,
  BodyPufferJacket,
  BodyTshirt1,
  BodyTshirt2,
  EyesApathetic,
  EyesGlasses,
  EyesHeartSunglasses,
  EyesMatrixSunglasses,
  EyesOpened,
  EyesRoundSunglasses,
  EyesStandard,
  HairCurly,
  HairCurlyBandana,
  HairLong,
  HairLongBeanie,
  HairMedium,
  HairMediumCap,
  HairMohawk,
  HairShort,
  HeadStandard,
  MouthApathetic,
  MouthBeard,
  MouthBristle1,
  MouthBristle2,
  MouthConfused,
  MouthHappt,
  MouthMeh,
  MouthMustache,
} from '@avatune/pacovqzz-assets/angular'
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
    hoodie: toAngularItem(BodyHoodie),
    overall: toAngularItem(BodyOverall),
    overshirt1: toAngularItem(BodyOvershirt1),
    overshirt2: toAngularItem(BodyOvershirt2),
    pufferJacket: toAngularItem(BodyPufferJacket),
    tshirt1: toAngularItem(BodyTshirt1),
    tshirt2: toAngularItem(BodyTshirt2),
  })
  .withComponents('eyes', {
    apathetic: toAngularItem(EyesApathetic),
    glasses: toAngularItem(EyesGlasses),
    heartSunglasses: toAngularItem(EyesHeartSunglasses),
    matrixSunglasses: toAngularItem(EyesMatrixSunglasses),
    opened: toAngularItem(EyesOpened),
    roundSunglasses: toAngularItem(EyesRoundSunglasses),
    standard: toAngularItem(EyesStandard),
  })
  .withComponents('hair', {
    curly: toAngularItem(HairCurly),
    curlyBandana: toAngularItem(HairCurlyBandana),
    long: toAngularItem(HairLong),
    longBeanie: toAngularItem(HairLongBeanie),
    medium: toAngularItem(HairMedium),
    mediumCap: toAngularItem(HairMediumCap),
    mohawk: toAngularItem(HairMohawk),
    short: toAngularItem(HairShort),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
  })
  .withComponents('mouth', {
    apathetic: toAngularItem(MouthApathetic),
    beard: toAngularItem(MouthBeard),
    bristle1: toAngularItem(MouthBristle1),
    bristle2: toAngularItem(MouthBristle2),
    confused: toAngularItem(MouthConfused),
    happy: toAngularItem(MouthHappt),
    meh: toAngularItem(MouthMeh),
    mustache: toAngularItem(MouthMustache),
  })
  .build()
