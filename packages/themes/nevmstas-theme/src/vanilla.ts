import {
  bodyShirt,
  bodySweater,
  bodyTshirt,
  bodyTurtleneck,
  earsStandard,
  eyebrowsAngry,
  eyebrowsSmall,
  eyebrowsStandard,
  eyesBoring,
  eyesDots,
  eyesOpenCircle,
  eyesOpenRounded,
  hairBobRounded,
  hairBobStraight,
  hairLong,
  hairMedium,
  hairShort,
  headOval,
  mouthBigSmile,
  mouthFlat,
  mouthFrown,
  mouthHalfOpen,
  mouthLaugh,
  mouthNervous,
  mouthSmile,
  nosesBig,
  nosesCurve,
  nosesDots,
  nosesHalfOval,
} from '@avatune/nevmstas-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    shirt: { code: bodyShirt },
    sweater: { code: bodySweater },
    tshirt: { code: bodyTshirt },
    turtleneck: { code: bodyTurtleneck },
  })
  .withComponents('ears', {
    standard: { code: earsStandard },
  })
  .withComponents('eyebrows', {
    angry: { code: eyebrowsAngry },
    small: { code: eyebrowsSmall },
    standard: { code: eyebrowsStandard },
  })
  .withComponents('eyes', {
    boring: { code: eyesBoring },
    dots: { code: eyesDots },
    openCircle: { code: eyesOpenCircle },
    openRounded: { code: eyesOpenRounded },
  })
  .withComponents('hair', {
    bobRounded: { code: hairBobRounded },
    bobStraight: { code: hairBobStraight },
    short: { code: hairShort },
    long: { code: hairLong },
    medium: { code: hairMedium },
  })
  .withComponents('head', {
    oval: { code: headOval },
  })
  .withComponents('mouth', {
    bigSmile: { code: mouthBigSmile },
    flat: { code: mouthFlat },
    frown: { code: mouthFrown },
    halfOpen: { code: mouthHalfOpen },
    laugh: { code: mouthLaugh },
    nervous: { code: mouthNervous },
    smile: { code: mouthSmile },
  })
  .withComponents('noses', {
    big: { code: nosesBig },
    curve: { code: nosesCurve },
    dots: { code: nosesDots },
    halfOval: { code: nosesHalfOval },
  })
  .build() satisfies VanillaTheme
