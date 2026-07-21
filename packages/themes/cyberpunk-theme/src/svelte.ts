import {
  BodyHoodie,
  BodyJacket1,
  BodyJacket2,
  BodyJacket3,
  BodyJacket4,
  BodyPoncho,
  BodyPoncho1,
  EyesAnxious,
  EyesBrave,
  EyesCurious,
  EyesFocused,
  EyesHusky,
  EyesRound,
  EyesSharp,
  HairBob,
  HairBraids,
  HairForehead,
  HairMedium,
  HairShort,
  HairStylish,
  HeadOval,
  HeadRhombus,
  HeadRobot,
  HeadSquaredOval,
  MouthHooky,
  MouthLips,
  MouthNervous,
  MouthOpen,
  MouthSmiling,
  NoseClothespin,
  NoseMetal,
  NoseNarrow,
  NoseStandard,
  NoseWide1,
  NoseWide2,
} from '@avatune/cyberpunk-assets/svelte'
import type { SvelteAvatarItem, SvelteTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<SvelteAvatarItem>()
  .withComponents('body', {
    hoodie: { Component: BodyHoodie },
    jacket1: { Component: BodyJacket1 },
    jacket2: { Component: BodyJacket2 },
    jacket3: { Component: BodyJacket3 },
    jacket4: { Component: BodyJacket4 },
    poncho: { Component: BodyPoncho },
    poncho1: { Component: BodyPoncho1 },
  })
  .withComponents('eyes', {
    anxious: { Component: EyesAnxious },
    brave: { Component: EyesBrave },
    curious: { Component: EyesCurious },
    focused: { Component: EyesFocused },
    husky: { Component: EyesHusky },
    round: { Component: EyesRound },
    sharp: { Component: EyesSharp },
  })
  .withComponents('hair', {
    bob: { Component: HairBob },
    braids: { Component: HairBraids },
    forehead: { Component: HairForehead },
    medium: { Component: HairMedium },
    short: { Component: HairShort },
    stylish: { Component: HairStylish },
  })
  .withComponents('head', {
    oval: { Component: HeadOval },
    rhombus: { Component: HeadRhombus },
    robot: { Component: HeadRobot },
    squaredOval: { Component: HeadSquaredOval },
  })
  .withComponents('mouth', {
    hooky: { Component: MouthHooky },
    lips: { Component: MouthLips },
    nervous: { Component: MouthNervous },
    open: { Component: MouthOpen },
    smiling: { Component: MouthSmiling },
  })
  .withComponents('nose', {
    clothespin: { Component: NoseClothespin },
    metal: { Component: NoseMetal },
    narrow: { Component: NoseNarrow },
    standard: { Component: NoseStandard },
    wide1: { Component: NoseWide1 },
    wide2: { Component: NoseWide2 },
  })
  .build() satisfies SvelteTheme
