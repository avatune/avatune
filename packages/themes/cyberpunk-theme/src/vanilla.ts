import {
  bodyHoodie,
  bodyJacket,
  bodyVest,
  eyesCyber,
  eyesDetermined,
  eyesHappy,
  eyesStandard,
  faceDetailsBlush,
  faceDetailsCircuits,
  faceDetailsScar,
  faceHairGoatee,
  faceHairStubble,
  glassesGoggles,
  glassesVisor,
  hairBob,
  hairBuzz,
  hairMohawk,
  hairPonytail,
  hairShaved,
  hairSlicked,
  hairSpikes,
  hairUndercut,
  headAngular,
  headStandard,
  mouthGrin,
  mouthNeutral,
  mouthSmirk,
} from '@avatune/cyberpunk-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    jacket: { code: bodyJacket },
    hoodie: { code: bodyHoodie },
    vest: { code: bodyVest },
  })
  .withComponents('faceDetails', {
    circuits: { code: faceDetailsCircuits },
    scar: { code: faceDetailsScar },
    blush: { code: faceDetailsBlush },
  })
  .withComponents('eyes', {
    standard: { code: eyesStandard },
    cyber: { code: eyesCyber },
    determined: { code: eyesDetermined },
    happy: { code: eyesHappy },
  })
  .withComponents('faceHair', {
    stubble: { code: faceHairStubble },
    goatee: { code: faceHairGoatee },
  })
  .withComponents('glasses', {
    visor: { code: glassesVisor },
    goggles: { code: glassesGoggles },
  })
  .withComponents('hair', {
    mohawk: { code: hairMohawk },
    undercut: { code: hairUndercut },
    bob: { code: hairBob },
    spikes: { code: hairSpikes },
    slicked: { code: hairSlicked },
    buzz: { code: hairBuzz },
    ponytail: { code: hairPonytail },
    shaved: { code: hairShaved },
  })
  .withComponents('head', {
    standard: { code: headStandard },
    angular: { code: headAngular },
  })
  .withComponents('mouth', {
    neutral: { code: mouthNeutral },
    smirk: { code: mouthSmirk },
    grin: { code: mouthGrin },
  })
  .build() satisfies VanillaTheme
