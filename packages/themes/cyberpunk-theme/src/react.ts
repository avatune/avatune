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
} from '@avatune/cyberpunk-assets/react'
import type { ReactAvatarItem, ReactTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<ReactAvatarItem>()
  .withComponents('body', {
    jacket: { Component: BodyJacket },
    hoodie: { Component: BodyHoodie },
    vest: { Component: BodyVest },
  })
  .withComponents('faceDetails', {
    circuits: { Component: FaceDetailsCircuits },
    scar: { Component: FaceDetailsScar },
    blush: { Component: FaceDetailsBlush },
  })
  .withComponents('eyes', {
    standard: { Component: EyesStandard },
    cyber: { Component: EyesCyber },
    determined: { Component: EyesDetermined },
    happy: { Component: EyesHappy },
  })
  .withComponents('faceHair', {
    stubble: { Component: FaceHairStubble },
    goatee: { Component: FaceHairGoatee },
  })
  .withComponents('glasses', {
    visor: { Component: GlassesVisor },
    goggles: { Component: GlassesGoggles },
  })
  .withComponents('hair', {
    mohawk: { Component: HairMohawk },
    undercut: { Component: HairUndercut },
    bob: { Component: HairBob },
    spikes: { Component: HairSpikes },
    slicked: { Component: HairSlicked },
    buzz: { Component: HairBuzz },
    ponytail: { Component: HairPonytail },
    shaved: { Component: HairShaved },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
    angular: { Component: HeadAngular },
  })
  .withComponents('mouth', {
    neutral: { Component: MouthNeutral },
    smirk: { Component: MouthSmirk },
    grin: { Component: MouthGrin },
  })
  .build() satisfies ReactTheme
