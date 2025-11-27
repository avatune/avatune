import fatinVerseTheme from '@avatune/fatin-verse-theme/vue'
import kyuteTheme from '@avatune/kyute-theme/vue'
import micahTheme from '@avatune/micah-theme/vue'
import miniavsTheme from '@avatune/miniavs-theme/vue'
import nevmstasTheme from '@avatune/nevmstas-theme/vue'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vue'
import type { Theme, VueAvatarItem } from '@avatune/types'
import type { AvatarProps } from '@avatune/vue'
import { Avatar } from '@avatune/vue'
import yanliuTheme from '@avatune/yanliu-theme/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed } from 'vue'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type FatinVerseArgs = Omit<AvatarProps<typeof fatinVerseTheme>, 'theme'>
type KyuteArgs = Omit<AvatarProps<typeof kyuteTheme>, 'theme'>
type MicahArgs = Omit<AvatarProps<typeof micahTheme>, 'theme'>
type MiniavsArgs = Omit<AvatarProps<typeof miniavsTheme>, 'theme'>
type NevmstasArgs = Omit<AvatarProps<typeof nevmstasTheme>, 'theme'>
type PacovqzzArgs = Omit<AvatarProps<typeof pacovqzzTheme>, 'theme'>
type YanliuArgs = Omit<AvatarProps<typeof yanliuTheme>, 'theme'>

const getArgTypes = <T extends Theme<VueAvatarItem>>(theme: T) => {
  const argTypes: Record<string, unknown> = {
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  }

  for (const [category, items] of Object.entries(theme)) {
    const excludeCategories = [
      'style',
      'predictorMappings',
      'colorPalettes',
      'connectedColors',
    ]
    if (excludeCategories.includes(category)) continue

    argTypes[`${category}Color`] = { control: { type: 'color' } }
    argTypes[category] = {
      control: { type: 'select' },
      options: Object.keys(items),
    }
  }

  return argTypes
}

export const FatinVerse: StoryObj<FatinVerseArgs> = {
  argTypes: getArgTypes(fatinVerseTheme),
  render: (args: FatinVerseArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: fatinVerseTheme }),
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
  FatinVerse: fatinVerseTheme,
  Kyute: kyuteTheme,
  Micah: micahTheme,
  Miniavs: miniavsTheme,
  Nevmstas: nevmstasTheme,
  Pacovqzz: pacovqzzTheme,
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
  render: (args: {
    theme: keyof typeof themes
    seed?: string | number
    size?: number
  }) => ({
    components: { Avatar },
    setup: () => {
      const theme = computed(() => themes[args.theme])
      const size = computed(() => args.size ?? 300)

      return { args, theme, size }
    },
    template: '<Avatar :theme="theme" :seed="args.seed" :size="size" />',
  }),
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
