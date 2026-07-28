import {
  BodyArmor,
  BodyFurJacket,
  BodyHoodie,
  BodyOpenJacket,
  BodyStuddedVest,
  BodyTunic,
  BodyWrapTunic,
  EyebrowsAngry,
  EyebrowsCalm,
  EyebrowsConfident,
  EyebrowsDefault,
  EyebrowsNeutral,
  EyesDefault,
  EyesScared,
  EyesTired,
  HairBraid,
  HairBraids,
  HairBun,
  HairDreadlocks,
  HairLong,
  HairMohawk,
  HairShort,
  HairSideForelock,
  HeadDefault,
  HeadLarge,
  HeadSqaure,
  MouthDracula,
  MouthHooky,
  MouthNeutral,
  MouthOpen,
  MouthOpenTusks,
  MouthSmile,
  NoseDefault,
} from '@avatune/orks-assets/angular'
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
    armor: toAngularItem(BodyArmor),
    furJacket: toAngularItem(BodyFurJacket),
    hoodie: toAngularItem(BodyHoodie),
    openJacket: toAngularItem(BodyOpenJacket),
    studdedVest: toAngularItem(BodyStuddedVest),
    tunic: toAngularItem(BodyTunic),
    wrapTunic: toAngularItem(BodyWrapTunic),
  })
  .withComponents('eyebrows', {
    angry: toAngularItem(EyebrowsAngry),
    calm: toAngularItem(EyebrowsCalm),
    confident: toAngularItem(EyebrowsConfident),
    default: toAngularItem(EyebrowsDefault),
    neutral: toAngularItem(EyebrowsNeutral),
  })
  .withComponents('eyes', {
    default: toAngularItem(EyesDefault),
    scared: toAngularItem(EyesScared),
    tired: toAngularItem(EyesTired),
  })
  .withComponents('hair', {
    braid: toAngularItem(HairBraid),
    braids: toAngularItem(HairBraids),
    bun: toAngularItem(HairBun),
    dreadlocks: toAngularItem(HairDreadlocks),
    long: toAngularItem(HairLong),
    mohawk: toAngularItem(HairMohawk),
    short: toAngularItem(HairShort),
    sideForelock: toAngularItem(HairSideForelock),
  })
  .withComponents('head', {
    default: toAngularItem(HeadDefault),
    large: toAngularItem(HeadLarge),
    sqaure: toAngularItem(HeadSqaure),
  })
  .withComponents('mouth', {
    dracula: toAngularItem(MouthDracula),
    hooky: toAngularItem(MouthHooky),
    neutral: toAngularItem(MouthNeutral),
    open: toAngularItem(MouthOpen),
    openTusks: toAngularItem(MouthOpenTusks),
    smile: toAngularItem(MouthSmile),
  })
  .withComponents('nose', {
    default: toAngularItem(NoseDefault),
  })
  .build() satisfies AngularTheme
