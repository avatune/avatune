import {
  EarsManBig,
  EarsManBiten,
  EarsManRingEarring,
  EarsManSmall,
  EarsManStandard,
  EarsManStudEarrings,
  EyesManBig,
  EyesManEyelashes,
  EyesManEyelids,
  EyesManHappy,
  EyesManSmall,
  EyesManStandard,
  FaceDetailsChinDimple1,
  FaceDetailsChinDimple2,
  FaceDetailsChinDimple3,
  FaceDetailsChinDimple4,
  GlassesManBrow,
  GlassesManPatch,
  GlassesManRound,
  GlassesManSquare,
  GlassesManStylish,
  HairBeanie,
  HairManBald,
  HairManCurly,
  HairManElvis,
  HairManMediumTopknot,
  HairManMessy,
  HairManShortTopknot,
  HairManStylish,
  HeadManBeardMustache,
  HeadManBeardSharp,
  HeadManBeardSlim,
  HeadManBeardStandard,
  HeadManBristle,
  HeadManBristleMustache,
  HeadManChin,
  HeadManSharp,
  HeadManStandard,
  MouthChin,
  MouthPhiltrum1,
  MouthPhiltrum2,
  MouthSad,
  MouthSmall,
  MouthSmile,
  MouthTongue1,
  MouthTongue2,
  MouthVampire,
  NoseManBig,
  NoseManBigWide,
  NoseManSmall,
  NoseManStandard,
  NoseManWide,
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
    big: toAngularItem(EarsManBig),
    biten: toAngularItem(EarsManBiten),
    ringEarring: toAngularItem(EarsManRingEarring),
    small: toAngularItem(EarsManSmall),
    standard: toAngularItem(EarsManStandard),
    studEarrings: toAngularItem(EarsManStudEarrings),
  })
  .withComponents('eyes', {
    big: toAngularItem(EyesManBig),
    happy: toAngularItem(EyesManHappy),
    small: toAngularItem(EyesManSmall),
    standard: toAngularItem(EyesManStandard),
    eyelashes: toAngularItem(EyesManEyelashes),
    eyelids: toAngularItem(EyesManEyelids),
  })
  .withComponents('faceDetails', {
    chinDimple1: toAngularItem(FaceDetailsChinDimple1),
    chinDimple2: toAngularItem(FaceDetailsChinDimple2),
    chinDimple3: toAngularItem(FaceDetailsChinDimple3),
    chinDimple4: toAngularItem(FaceDetailsChinDimple4),
  })
  .withComponents('glasses', {
    brow: toAngularItem(GlassesManBrow),
    patch: toAngularItem(GlassesManPatch),
    round: toAngularItem(GlassesManRound),
    square: toAngularItem(GlassesManSquare),
    stylish: toAngularItem(GlassesManStylish),
  })
  .withComponents('hair', {
    bald: toAngularItem(HairManBald),
    curly: toAngularItem(HairManCurly),
    elvis: toAngularItem(HairManElvis),
    mediumTopknot: toAngularItem(HairManMediumTopknot),
    messy: toAngularItem(HairManMessy),
    shortTopknot: toAngularItem(HairManShortTopknot),
    stylish: toAngularItem(HairManStylish),
    beanie: toAngularItem(HairBeanie),
  })
  .withComponents('head', {
    beardMustache: toAngularItem(HeadManBeardMustache),
    beardSharp: toAngularItem(HeadManBeardSharp),
    beardSlim: toAngularItem(HeadManBeardSlim),
    beardStandard: toAngularItem(HeadManBeardStandard),
    bristle: toAngularItem(HeadManBristle),
    bristleMustache: toAngularItem(HeadManBristleMustache),
    chin: toAngularItem(HeadManChin),
    sharp: toAngularItem(HeadManSharp),
    standard: toAngularItem(HeadManStandard),
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
    big: toAngularItem(NoseManBig),
    bigWide: toAngularItem(NoseManBigWide),
    small: toAngularItem(NoseManSmall),
    standard: toAngularItem(NoseManStandard),
    wide: toAngularItem(NoseManWide),
  })
  .build()
