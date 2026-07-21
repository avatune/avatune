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
} from '@avatune/cyberpunk-assets/angular'
import type { AngularAvatarItem, AngularTheme } from '@avatune/types'
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
    hoodie: toAngularItem(BodyHoodie),
    jacket1: toAngularItem(BodyJacket1),
    jacket2: toAngularItem(BodyJacket2),
    jacket3: toAngularItem(BodyJacket3),
    jacket4: toAngularItem(BodyJacket4),
    poncho: toAngularItem(BodyPoncho),
    poncho1: toAngularItem(BodyPoncho1),
  })
  .withComponents('eyes', {
    anxious: toAngularItem(EyesAnxious),
    brave: toAngularItem(EyesBrave),
    curious: toAngularItem(EyesCurious),
    focused: toAngularItem(EyesFocused),
    husky: toAngularItem(EyesHusky),
    round: toAngularItem(EyesRound),
    sharp: toAngularItem(EyesSharp),
  })
  .withComponents('hair', {
    bob: toAngularItem(HairBob),
    braids: toAngularItem(HairBraids),
    forehead: toAngularItem(HairForehead),
    medium: toAngularItem(HairMedium),
    short: toAngularItem(HairShort),
    stylish: toAngularItem(HairStylish),
  })
  .withComponents('head', {
    oval: toAngularItem(HeadOval),
    rhombus: toAngularItem(HeadRhombus),
    robot: toAngularItem(HeadRobot),
    squaredOval: toAngularItem(HeadSquaredOval),
  })
  .withComponents('mouth', {
    hooky: toAngularItem(MouthHooky),
    lips: toAngularItem(MouthLips),
    nervous: toAngularItem(MouthNervous),
    open: toAngularItem(MouthOpen),
    smiling: toAngularItem(MouthSmiling),
  })
  .withComponents('nose', {
    clothespin: toAngularItem(NoseClothespin),
    metal: toAngularItem(NoseMetal),
    narrow: toAngularItem(NoseNarrow),
    standard: toAngularItem(NoseStandard),
    wide1: toAngularItem(NoseWide1),
    wide2: toAngularItem(NoseWide2),
  })
  .build() satisfies AngularTheme
