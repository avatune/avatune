import {
  AccessoriesHorns,
  BodySanta,
  BodyShirt,
  BodySweater,
  BodyTshirt,
  BodyTurtleneck,
  EarsStandard,
  EyebrowsAngry,
  EyebrowsSmall,
  EyebrowsStandard,
  EyesBoring,
  EyesDots,
  EyesOpenCircle,
  EyesOpenRounded,
  FaceHairBeard,
  HairBobRounded,
  HairBobStraight,
  HairLong,
  HairMedium,
  HairShort,
  HatsSanta,
  HeadOval,
  MouthBigSmile,
  MouthFlat,
  MouthFrown,
  MouthHalfOpen,
  MouthLaugh,
  MouthNervous,
  MouthSmile,
  NoseBig,
  NoseCurve,
  NoseDots,
  NoseHalfOval,
} from '@avatune/nevmstas-assets/angular'
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
  .withComponents('accessories', {
    horns: toAngularItem(AccessoriesHorns),
  })
  .withComponents('body', {
    santa: toAngularItem(BodySanta),
    shirt: toAngularItem(BodyShirt),
    sweater: toAngularItem(BodySweater),
    tshirt: toAngularItem(BodyTshirt),
    turtleneck: toAngularItem(BodyTurtleneck),
  })
  .withComponents('ears', {
    standard: toAngularItem(EarsStandard),
  })
  .withComponents('eyebrows', {
    angry: toAngularItem(EyebrowsAngry),
    small: toAngularItem(EyebrowsSmall),
    standard: toAngularItem(EyebrowsStandard),
  })
  .withComponents('eyes', {
    boring: toAngularItem(EyesBoring),
    dots: toAngularItem(EyesDots),
    openCircle: toAngularItem(EyesOpenCircle),
    openRounded: toAngularItem(EyesOpenRounded),
  })
  .withComponents('hair', {
    bobRounded: toAngularItem(HairBobRounded),
    bobStraight: toAngularItem(HairBobStraight),
    short: toAngularItem(HairShort),
    long: toAngularItem(HairLong),
    medium: toAngularItem(HairMedium),
  })
  .withComponents('head', {
    oval: toAngularItem(HeadOval),
  })
  .withComponents('mouth', {
    bigSmile: toAngularItem(MouthBigSmile),
    flat: toAngularItem(MouthFlat),
    frown: toAngularItem(MouthFrown),
    halfOpen: toAngularItem(MouthHalfOpen),
    laugh: toAngularItem(MouthLaugh),
    nervous: toAngularItem(MouthNervous),
    smile: toAngularItem(MouthSmile),
  })
  .withComponents('nose', {
    big: toAngularItem(NoseBig),
    curve: toAngularItem(NoseCurve),
    dots: toAngularItem(NoseDots),
    halfOval: toAngularItem(NoseHalfOval),
  })
  .withComponents('faceHair', {
    beard: toAngularItem(FaceHairBeard),
  })
  .withComponents('hats', {
    santa: toAngularItem(HatsSanta),
  })
  .build() satisfies AngularTheme
