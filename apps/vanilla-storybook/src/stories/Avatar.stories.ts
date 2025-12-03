import ashleyseoTheme from '@avatune/ashley-seo-theme/vanilla'
import fatinverseTheme from '@avatune/fatin-verse-theme/vanilla'
import kyuteTheme from '@avatune/kyute-theme/vanilla'
import micahTheme from '@avatune/micah-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vanilla'
import pawelolekmanTheme from '@avatune/pawel-olek-man-theme/vanilla'
import pawelolekwomanTheme from '@avatune/pawel-olek-woman-theme/vanilla'
import type { Theme, VanillaAvatarItem } from '@avatune/types'
import { type AvatarArgs, avatar } from '@avatune/vanilla'
import yanliuTheme from '@avatune/yanliu-theme/vanilla'
import type { Meta, StoryObj } from '@storybook/html-vite'

const meta = {
  title: 'Avatar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta

type AshleySeoArgs = Omit<AvatarArgs<typeof ashleyseoTheme>, 'theme'>
type FatinVerseArgs = Omit<AvatarArgs<typeof fatinverseTheme>, 'theme'>
type KyuteArgs = Omit<AvatarArgs<typeof kyuteTheme>, 'theme'>
type MicahArgs = Omit<AvatarArgs<typeof micahTheme>, 'theme'>
type MiniavsArgs = Omit<AvatarArgs<typeof miniavsTheme>, 'theme'>
type NevmstasArgs = Omit<AvatarArgs<typeof nevmstasTheme>, 'theme'>
type PacovqzzArgs = Omit<AvatarArgs<typeof pacovqzzTheme>, 'theme'>
type PawelOlekManArgs = Omit<AvatarArgs<typeof pawelolekmanTheme>, 'theme'>
type PawelOlekWomanArgs = Omit<AvatarArgs<typeof pawelolekwomanTheme>, 'theme'>
type YanliuArgs = Omit<AvatarArgs<typeof yanliuTheme>, 'theme'>

const getArgTypes = <T extends Theme<VanillaAvatarItem>>(theme: T) => {
  const argTypes: Record<string, unknown> = {
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  }

  const colorPalettes = theme.colorPalettes
  for (const [category, items] of Object.entries(theme)) {
    const excludeCategories = [
      'style',
      'predictorMappings',
      'colorPalettes',
      'connectedColors',
    ]
    if (excludeCategories.includes(category)) continue

    const presetColors = colorPalettes[category as keyof typeof colorPalettes]
    argTypes[`${category}Color`] = { control: { type: 'color', presetColors } }
    argTypes[category] = {
      control: { type: 'select' },
      options: Object.keys(items),
    }
  }
  argTypes.backgroundColor = {
    control: { type: 'color', presetColors: colorPalettes.background },
  } as const

  return argTypes
}

export const AshleySeo: StoryObj<AshleySeoArgs> = {
  argTypes: getArgTypes(ashleyseoTheme),
  render: (args: AshleySeoArgs) => {
    return avatar({ theme: ashleyseoTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const FatinVerse: StoryObj<FatinVerseArgs> = {
  argTypes: getArgTypes(fatinverseTheme),
  render: (args: FatinVerseArgs) => {
    return avatar({ theme: fatinverseTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Kyute: StoryObj<KyuteArgs> = {
  argTypes: getArgTypes(kyuteTheme),
  render: (args: KyuteArgs) => {
    return avatar({ theme: kyuteTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Micah: StoryObj<MicahArgs> = {
  argTypes: getArgTypes(micahTheme),
  render: (args: MicahArgs) => {
    return avatar({ theme: micahTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Miniavs: StoryObj<MiniavsArgs> = {
  argTypes: getArgTypes(miniavsTheme),
  render: (args: MiniavsArgs) => {
    return avatar({ theme: miniavsTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Nevmstas: StoryObj<NevmstasArgs> = {
  argTypes: getArgTypes(nevmstasTheme),
  render: (args: NevmstasArgs) => {
    return avatar({ theme: nevmstasTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Pacovqzz: StoryObj<PacovqzzArgs> = {
  argTypes: getArgTypes(pacovqzzTheme),
  render: (args: PacovqzzArgs) => {
    return avatar({ theme: pacovqzzTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const PawelOlekMan: StoryObj<PawelOlekManArgs> = {
  argTypes: getArgTypes(pawelolekmanTheme),
  render: (args: PawelOlekManArgs) => {
    return avatar({ theme: pawelolekmanTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const PawelOlekWoman: StoryObj<PawelOlekWomanArgs> = {
  argTypes: getArgTypes(pawelolekwomanTheme),
  render: (args: PawelOlekWomanArgs) => {
    return avatar({ theme: pawelolekwomanTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const Yanliu: StoryObj<YanliuArgs> = {
  argTypes: getArgTypes(yanliuTheme),
  render: (args: YanliuArgs) => {
    return avatar({ theme: yanliuTheme, ...args })
  },
  args: {
    size: 300,
  },
}

const themes = {
  'Ashley Seo': ashleyseoTheme,
  'Fatin Verse': fatinverseTheme,
  Kyute: kyuteTheme,
  Micah: micahTheme,
  Miniavs: miniavsTheme,
  Nevmstas: nevmstasTheme,
  Pacovqzz: pacovqzzTheme,
  'Pawel Olek Man': pawelolekmanTheme,
  'Pawel Olek Woman': pawelolekwomanTheme,
  Yanliu: yanliuTheme,
} as const

export const Seed: StoryObj<{
  theme: keyof typeof themes
  seed?: string | number
  size?: number
}> = {
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: Object.keys(themes),
    },
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({
    theme: themeName,
    seed,
    size = 300,
  }: {
    theme: keyof typeof themes
    seed?: string | number
    size?: number
  }) => {
    return avatar({
      theme: themes[themeName],
      seed,
      size,
    })
  },
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
