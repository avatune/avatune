import {
  bodyHoodie,
  bodyOverall,
  bodyOvershirt1,
  bodyOvershirt2,
  bodyPufferJacket,
  bodyTshirt1,
  bodyTshirt2,
  eyesApathetic,
  eyesGlasses,
  eyesHeartSunglasses,
  eyesMatrixSunglasses,
  eyesOpened,
  eyesRoundSunglasses,
  eyesStandard,
  hairCurly,
  hairCurlyBandana,
  hairLong,
  hairLongBeanie,
  hairMedium,
  hairMediumCap,
  hairMohawk,
  hairShort,
  headStandard,
  mouthApathetic,
  mouthBeard,
  mouthBristle1,
  mouthBristle2,
  mouthConfused,
  mouthHappt,
  mouthMeh,
  mouthMustache,
} from '@avatune/pacovqzz-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    hoodie: { code: bodyHoodie },
    overall: { code: bodyOverall },
    overshirt1: { code: bodyOvershirt1 },
    overshirt2: { code: bodyOvershirt2 },
    pufferJacket: { code: bodyPufferJacket },
    tshirt1: { code: bodyTshirt1 },
    tshirt2: { code: bodyTshirt2 },
  })
  .withComponents('eyes', {
    apathetic: { code: eyesApathetic },
    glasses: { code: eyesGlasses },
    heartSunglasses: { code: eyesHeartSunglasses },
    matrixSunglasses: { code: eyesMatrixSunglasses },
    opened: { code: eyesOpened },
    roundSunglasses: { code: eyesRoundSunglasses },
    standard: { code: eyesStandard },
  })
  .withComponents('hair', {
    curly: { code: hairCurly },
    curlyBandana: { code: hairCurlyBandana },
    long: { code: hairLong },
    longBeanie: { code: hairLongBeanie },
    medium: { code: hairMedium },
    mediumCap: { code: hairMediumCap },
    mohawk: { code: hairMohawk },
    short: { code: hairShort },
  })
  .withComponents('head', {
    standard: { code: headStandard },
  })
  .withComponents('mouth', {
    apathetic: { code: mouthApathetic },
    beard: { code: mouthBeard },
    bristle1: { code: mouthBristle1 },
    bristle2: { code: mouthBristle2 },
    confused: { code: mouthConfused },
    happy: { code: mouthHappt },
    meh: { code: mouthMeh },
    mustache: { code: mouthMustache },
  })
  .build() satisfies VanillaTheme
