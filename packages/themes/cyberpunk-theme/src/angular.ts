import {
  BodyHoodie,
  BodyJacket,
  BodyVest,
  EyesCyber,
  EyesDetermined,
  EyesHappy,
  EyesStandard,
  FaceDetailsBlush,
  FaceDetailsCircuits,
  FaceDetailsScar,
  FaceHairGoatee,
  FaceHairStubble,
  GlassesGoggles,
  GlassesVisor,
  HairBob,
  HairBuzz,
  HairMohawk,
  HairPonytail,
  HairShaved,
  HairSlicked,
  HairSpikes,
  HairUndercut,
  HeadAngular,
  HeadStandard,
  MouthGrin,
  MouthNeutral,
  MouthSmirk,
} from '@avatune/cyberpunk-assets/angular'
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
    jacket: toAngularItem(BodyJacket),
    hoodie: toAngularItem(BodyHoodie),
    vest: toAngularItem(BodyVest),
  })
  .withComponents('faceDetails', {
    circuits: toAngularItem(FaceDetailsCircuits),
    scar: toAngularItem(FaceDetailsScar),
    blush: toAngularItem(FaceDetailsBlush),
  })
  .withComponents('eyes', {
    standard: toAngularItem(EyesStandard),
    cyber: toAngularItem(EyesCyber),
    determined: toAngularItem(EyesDetermined),
    happy: toAngularItem(EyesHappy),
  })
  .withComponents('faceHair', {
    stubble: toAngularItem(FaceHairStubble),
    goatee: toAngularItem(FaceHairGoatee),
  })
  .withComponents('glasses', {
    visor: toAngularItem(GlassesVisor),
    goggles: toAngularItem(GlassesGoggles),
  })
  .withComponents('hair', {
    mohawk: toAngularItem(HairMohawk),
    undercut: toAngularItem(HairUndercut),
    bob: toAngularItem(HairBob),
    spikes: toAngularItem(HairSpikes),
    slicked: toAngularItem(HairSlicked),
    buzz: toAngularItem(HairBuzz),
    ponytail: toAngularItem(HairPonytail),
    shaved: toAngularItem(HairShaved),
  })
  .withComponents('head', {
    standard: toAngularItem(HeadStandard),
    angular: toAngularItem(HeadAngular),
  })
  .withComponents('mouth', {
    neutral: toAngularItem(MouthNeutral),
    smirk: toAngularItem(MouthSmirk),
    grin: toAngularItem(MouthGrin),
  })
  .build()
