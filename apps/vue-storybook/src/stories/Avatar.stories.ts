import ashleyseoTheme from '@avatune/ashley-seo-theme/vue'
import fatinverseTheme from '@avatune/fatin-verse-theme/vue'
import kyuteTheme from '@avatune/kyute-theme/vue'
import micahTheme from '@avatune/micah-theme/vue'
import miniavsTheme from '@avatune/miniavs-theme/vue'
import nevmstasTheme from '@avatune/nevmstas-theme/vue'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vue'
import pawelolekmanTheme from '@avatune/pawel-olek-man-theme/vue'
import pawelolekwomanTheme from '@avatune/pawel-olek-woman-theme/vue'
import type { Theme, VueAvatarItem } from '@avatune/types'
import type { AvatarProps } from '@avatune/vue'
import { Avatar } from '@avatune/vue'
import yanliuTheme from '@avatune/yanliu-theme/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type AshleySeoArgs = Omit<AvatarProps<typeof ashleyseoTheme>, 'theme'>
type FatinVerseArgs = Omit<AvatarProps<typeof fatinverseTheme>, 'theme'>
type KyuteArgs = Omit<AvatarProps<typeof kyuteTheme>, 'theme'>
type MicahArgs = Omit<AvatarProps<typeof micahTheme>, 'theme'>
type MiniavsArgs = Omit<AvatarProps<typeof miniavsTheme>, 'theme'>
type NevmstasArgs = Omit<AvatarProps<typeof nevmstasTheme>, 'theme'>
type PacovqzzArgs = Omit<AvatarProps<typeof pacovqzzTheme>, 'theme'>
type PawelOlekManArgs = Omit<AvatarProps<typeof pawelolekmanTheme>, 'theme'>
type PawelOlekWomanArgs = Omit<AvatarProps<typeof pawelolekwomanTheme>, 'theme'>
type YanliuArgs = Omit<AvatarProps<typeof yanliuTheme>, 'theme'>

const getArgTypes = <T extends Theme<VueAvatarItem>>(theme: T) => {
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
  render: (args: AshleySeoArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: ashleyseoTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const FatinVerse: StoryObj<FatinVerseArgs> = {
  argTypes: getArgTypes(fatinverseTheme),
  render: (args: FatinVerseArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: fatinverseTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Kyute: StoryObj<KyuteArgs> = {
  argTypes: getArgTypes(kyuteTheme),
  render: (args: KyuteArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: kyuteTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Micah: StoryObj<MicahArgs> = {
  argTypes: getArgTypes(micahTheme),
  render: (args: MicahArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: micahTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Miniavs: StoryObj<MiniavsArgs> = {
  argTypes: getArgTypes(miniavsTheme),
  render: (args: MiniavsArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: miniavsTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Nevmstas: StoryObj<NevmstasArgs> = {
  argTypes: getArgTypes(nevmstasTheme),
  render: (args: NevmstasArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: nevmstasTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Pacovqzz: StoryObj<PacovqzzArgs> = {
  argTypes: getArgTypes(pacovqzzTheme),
  render: (args: PacovqzzArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: pacovqzzTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const PawelOlekMan: StoryObj<PawelOlekManArgs> = {
  argTypes: getArgTypes(pawelolekmanTheme),
  render: (args: PawelOlekManArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: pawelolekmanTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const PawelOlekWoman: StoryObj<PawelOlekWomanArgs> = {
  argTypes: getArgTypes(pawelolekwomanTheme),
  render: (args: PawelOlekWomanArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: pawelolekwomanTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}

export const Yanliu: StoryObj<YanliuArgs> = {
  argTypes: getArgTypes(yanliuTheme),
  render: (args: YanliuArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: yanliuTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
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
  }) => ({
    components: { Avatar },
    setup: () => ({
      theme: themes[themeName],
      seed,
      size,
    }),
    template: '<Avatar :theme="theme" :seed="seed" :size="size" />',
  }),
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
