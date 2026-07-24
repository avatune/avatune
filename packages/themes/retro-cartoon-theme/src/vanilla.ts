import {
  bodyBlazer,
  bodyCollaredShirt,
  bodyCrewneckSweater,
  bodyHoodie,
  bodyTurtleneckSweater,
  bodyVNeckSweater,
  eyebrowsAngled,
  eyebrowsFlat,
  eyebrowsRaised,
  eyebrowsSoft,
  eyebrowsThick,
  eyesHappy,
  eyesNeutral,
  eyesSleepy,
  eyesSurprised,
  eyesWinking,
  hairAfro,
  hairBob,
  hairBuzzCut,
  hairCurlyBob,
  hairLongCurly,
  hairLongStraight,
  hairLongWavy,
  hairSideSwept,
  headStandard,
  mouthLips,
  mouthNeutral,
  mouthOpenedSmile,
  mouthSad,
  mouthSmirk,
  mouthTeethSmile,
  noseCurve,
} from '@avatune/retro-cartoon-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    crewneckSweater: { code: bodyCrewneckSweater },
    collaredShirt: { code: bodyCollaredShirt },
    hoodie: { code: bodyHoodie },
    turtleneckSweater: { code: bodyTurtleneckSweater },
    blazer: { code: bodyBlazer },
    vNeckSweater: { code: bodyVNeckSweater },
  })
  .withComponents('eyebrows', {
    soft: { code: eyebrowsSoft },
    thick: { code: eyebrowsThick },
    angled: { code: eyebrowsAngled },
    flat: { code: eyebrowsFlat },
    raised: { code: eyebrowsRaised },
  })
  .withComponents('eyes', {
    neutral: { code: eyesNeutral },
    happy: { code: eyesHappy },
    winking: { code: eyesWinking },
    surprised: { code: eyesSurprised },
    sleepy: { code: eyesSleepy },
  })
  .withComponents('hair', {
    curlyBob: { code: hairCurlyBob },
    longWavy: { code: hairLongWavy },
    longStraight: { code: hairLongStraight },
    longCurly: { code: hairLongCurly },
    bob: { code: hairBob },
    sideSwept: { code: hairSideSwept },
    afro: { code: hairAfro },
    buzzCut: { code: hairBuzzCut },
  })
  .withComponents('head', { standard: { code: headStandard } })
  .withComponents('mouth', {
    teethSmile: { code: mouthTeethSmile },
    lips: { code: mouthLips },
    openedSmile: { code: mouthOpenedSmile },
    smirk: { code: mouthSmirk },
    neutral: { code: mouthNeutral },
    sad: { code: mouthSad },
  })
  .withComponents('nose', { curve: { code: noseCurve } })
  .build() satisfies VanillaTheme
