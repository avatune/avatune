import {
  bodyHoodie,
  bodyJacket1,
  bodyJacket2,
  bodyJacket3,
  bodyJacket4,
  bodyPoncho,
  bodyPoncho1,
  eyesAnxious,
  eyesBrave,
  eyesCurious,
  eyesFocused,
  eyesHusky,
  eyesRound,
  eyesSharp,
  hairBob,
  hairBraids,
  hairForehead,
  hairMedium,
  hairShort,
  hairStylish,
  headOval,
  headRhombus,
  headRobot,
  headSquaredOval,
  mouthHooky,
  mouthLips,
  mouthNervous,
  mouthOpen,
  mouthSmiling,
  noseClothespin,
  noseMetal,
  noseNarrow,
  noseStandard,
  noseWide1,
  noseWide2,
} from '@avatune/cyberpunk-assets'
import type { VanillaAvatarItem, VanillaTheme } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<VanillaAvatarItem>()
  .withComponents('body', {
    hoodie: { code: bodyHoodie },
    jacket1: { code: bodyJacket1 },
    jacket2: { code: bodyJacket2 },
    jacket3: { code: bodyJacket3 },
    jacket4: { code: bodyJacket4 },
    poncho: { code: bodyPoncho },
    poncho1: { code: bodyPoncho1 },
  })
  .withComponents('eyes', {
    anxious: { code: eyesAnxious },
    brave: { code: eyesBrave },
    curious: { code: eyesCurious },
    focused: { code: eyesFocused },
    husky: { code: eyesHusky },
    round: { code: eyesRound },
    sharp: { code: eyesSharp },
  })
  .withComponents('hair', {
    bob: { code: hairBob },
    braids: { code: hairBraids },
    forehead: { code: hairForehead },
    medium: { code: hairMedium },
    short: { code: hairShort },
    stylish: { code: hairStylish },
  })
  .withComponents('head', {
    oval: { code: headOval },
    rhombus: { code: headRhombus },
    robot: { code: headRobot },
    squaredOval: { code: headSquaredOval },
  })
  .withComponents('mouth', {
    hooky: { code: mouthHooky },
    lips: { code: mouthLips },
    nervous: { code: mouthNervous },
    open: { code: mouthOpen },
    smiling: { code: mouthSmiling },
  })
  .withComponents('nose', {
    clothespin: { code: noseClothespin },
    metal: { code: noseMetal },
    narrow: { code: noseNarrow },
    standard: { code: noseStandard },
    wide1: { code: noseWide1 },
    wide2: { code: noseWide2 },
  })
  .build() satisfies VanillaTheme
