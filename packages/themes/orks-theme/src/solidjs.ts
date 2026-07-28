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
} from '@avatune/orks-assets/solid'
import type { SolidJsAvatarItem, SolidJsTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SolidJsAvatarItem>()
  .withComponents('body', {
    armor: { Component: BodyArmor },
    furJacket: { Component: BodyFurJacket },
    hoodie: { Component: BodyHoodie },
    openJacket: { Component: BodyOpenJacket },
    studdedVest: { Component: BodyStuddedVest },
    tunic: { Component: BodyTunic },
    wrapTunic: { Component: BodyWrapTunic },
  })
  .withComponents('eyebrows', {
    angry: { Component: EyebrowsAngry },
    calm: { Component: EyebrowsCalm },
    confident: { Component: EyebrowsConfident },
    default: { Component: EyebrowsDefault },
    neutral: { Component: EyebrowsNeutral },
  })
  .withComponents('eyes', {
    default: { Component: EyesDefault },
    scared: { Component: EyesScared },
    tired: { Component: EyesTired },
  })
  .withComponents('hair', {
    braid: { Component: HairBraid },
    braids: { Component: HairBraids },
    bun: { Component: HairBun },
    dreadlocks: { Component: HairDreadlocks },
    long: { Component: HairLong },
    mohawk: { Component: HairMohawk },
    short: { Component: HairShort },
    sideForelock: { Component: HairSideForelock },
  })
  .withComponents('head', {
    default: { Component: HeadDefault },
    large: { Component: HeadLarge },
    sqaure: { Component: HeadSqaure },
  })
  .withComponents('mouth', {
    dracula: { Component: MouthDracula },
    hooky: { Component: MouthHooky },
    neutral: { Component: MouthNeutral },
    open: { Component: MouthOpen },
    openTusks: { Component: MouthOpenTusks },
    smile: { Component: MouthSmile },
  })
  .withComponents('nose', {
    default: { Component: NoseDefault },
  })
  .build() satisfies SolidJsTheme
