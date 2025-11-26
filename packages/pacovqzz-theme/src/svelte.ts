import {
  BodyHoodie,
  BodyOverall,
  BodyOvershirt1,
  BodyOvershirt2,
  BodyPufferJacket,
  BodyTshirt1,
  BodyTshirt2,
  EyesApathetic,
  EyesGlasses,
  EyesHeartSunglasses,
  EyesMatrixSunglasses,
  EyesOpened,
  EyesRoundSunglasses,
  EyesStandard,
  HairCurly,
  HairCurlyBandana,
  HairLong,
  HairLongBeanie,
  HairMedium,
  HairMediumCap,
  HairMohawk,
  HairShort,
  HeadStandard,
  MouthApathetic,
  MouthBeard,
  MouthBristle1,
  MouthBristle2,
  MouthConfused,
  MouthHappt,
  MouthMeh,
  MouthMustache,
} from '@avatune/pacovqzz-assets/svelte'
import type { SvelteAvatarItem, SvelteTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SvelteAvatarItem>()
  .withComponents('body', {
    hoodie: { Component: BodyHoodie },
    overall: { Component: BodyOverall },
    overshirt1: { Component: BodyOvershirt1 },
    overshirt2: { Component: BodyOvershirt2 },
    pufferJacket: { Component: BodyPufferJacket },
    tshirt1: { Component: BodyTshirt1 },
    tshirt2: { Component: BodyTshirt2 },
  })
  .withComponents('eyes', {
    apathetic: { Component: EyesApathetic },
    glasses: { Component: EyesGlasses },
    heartSunglasses: { Component: EyesHeartSunglasses },
    matrixSunglasses: { Component: EyesMatrixSunglasses },
    opened: { Component: EyesOpened },
    roundSunglasses: { Component: EyesRoundSunglasses },
    standard: { Component: EyesStandard },
  })
  .withComponents('hair', {
    curly: { Component: HairCurly },
    curlyBandana: { Component: HairCurlyBandana },
    long: { Component: HairLong },
    longBeanie: { Component: HairLongBeanie },
    medium: { Component: HairMedium },
    mediumCap: { Component: HairMediumCap },
    mohawk: { Component: HairMohawk },
    short: { Component: HairShort },
  })
  .withComponents('head', {
    standard: { Component: HeadStandard },
  })
  .withComponents('mouth', {
    apathetic: { Component: MouthApathetic },
    beard: { Component: MouthBeard },
    bristle1: { Component: MouthBristle1 },
    bristle2: { Component: MouthBristle2 },
    confused: { Component: MouthConfused },
    happy: { Component: MouthHappt },
    meh: { Component: MouthMeh },
    mustache: { Component: MouthMustache },
  })
  .build() satisfies SvelteTheme
