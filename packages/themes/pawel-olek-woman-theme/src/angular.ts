import {
  EarsWomanDropEarrings,
  EarsWomanSharp,
  EarsWomanStandard,
  EyesWomanBig,
  EyesWomanHappy,
  EyesWomanSmall,
  EyesWomanStandard,
  FaceDetailsChinDimple1,
  FaceDetailsChinDimple2,
  FaceDetailsChinDimple3,
  FaceDetailsChinDimple4,
  GlassesWomanPatch,
  GlassesWomanRound,
  GlassesWomanSquare,
  GlassesWomanStylish,
  HairHijab,
  HairWomanBob,
  HairWomanLowBun,
  HairWomanlong,
  HairWomanMedium,
  HairWomanStickBun,
  HeadWomanChin,
  HeadWomanStandard,
  MouthChin,
  MouthPhiltrum1,
  MouthPhiltrum2,
  MouthSad,
  MouthSmall,
  MouthSmile,
  MouthTongue1,
  MouthTongue2,
  MouthVampire,
  NoseWomanBig,
  NoseWomanSmall,
  NoseWomanStandard,
} from '@avatune/pawel-olek-assets/angular'
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
  .withComponents('ears', {
    dropEarrings: toAngularItem(EarsWomanDropEarrings),
    sharp: toAngularItem(EarsWomanSharp),
    standard: toAngularItem(EarsWomanStandard),
  })
  .withComponents('eyes', {
    big: toAngularItem(EyesWomanBig),
    happy: toAngularItem(EyesWomanHappy),
    small: toAngularItem(EyesWomanSmall),
    standard: toAngularItem(EyesWomanStandard),
  })
  .withComponents('faceDetails', {
    chinDimple1: toAngularItem(FaceDetailsChinDimple1),
    chinDimple2: toAngularItem(FaceDetailsChinDimple2),
    chinDimple3: toAngularItem(FaceDetailsChinDimple3),
    chinDimple4: toAngularItem(FaceDetailsChinDimple4),
  })
  .withComponents('glasses', {
    patch: toAngularItem(GlassesWomanPatch),
    round: toAngularItem(GlassesWomanRound),
    square: toAngularItem(GlassesWomanSquare),
    stylish: toAngularItem(GlassesWomanStylish),
  })
  .withComponents('hair', {
    bob: toAngularItem(HairWomanBob),
    long: toAngularItem(HairWomanlong),
    lowBun: toAngularItem(HairWomanLowBun),
    medium: toAngularItem(HairWomanMedium),
    stickBun: toAngularItem(HairWomanStickBun),
    hijab: toAngularItem(HairHijab),
  })
  .withComponents('head', {
    chin: toAngularItem(HeadWomanChin),
    standard: toAngularItem(HeadWomanStandard),
  })
  .withComponents('mouth', {
    chin: toAngularItem(MouthChin),
    philtrum1: toAngularItem(MouthPhiltrum1),
    philtrum2: toAngularItem(MouthPhiltrum2),
    sad: toAngularItem(MouthSad),
    small: toAngularItem(MouthSmall),
    smile: toAngularItem(MouthSmile),
    tongue1: toAngularItem(MouthTongue1),
    tongue2: toAngularItem(MouthTongue2),
    vampire: toAngularItem(MouthVampire),
  })
  .withComponents('nose', {
    big: toAngularItem(NoseWomanBig),
    small: toAngularItem(NoseWomanSmall),
    standard: toAngularItem(NoseWomanStandard),
  })
  .build()
