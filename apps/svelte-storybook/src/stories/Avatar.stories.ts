import ashleyseoTheme from '@avatune/ashley-seo-theme/svelte'
import ashleyyTheme from '@avatune/ashleyy-theme/svelte'
import fatinverseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import pawelolekmanTheme from '@avatune/pawel-olek-man-theme/svelte'
import pawelolekwomanTheme from '@avatune/pawel-olek-woman-theme/svelte'
import type { AvatarProps } from '@avatune/svelte'
import { Avatar } from '@avatune/svelte'
import type { SvelteAvatarItem, Theme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import type { Meta, StoryObj } from '@storybook/svelte-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type ExtractStoryArgs<T extends Theme<SvelteAvatarItem>> = Omit<
  AvatarProps<T>,
  'theme'
>

type AshleySeoArgs = ExtractStoryArgs<typeof ashleyseoTheme>
type AshleyyArgs = ExtractStoryArgs<typeof ashleyyTheme>
type FatinVerseArgs = ExtractStoryArgs<typeof fatinverseTheme>
type KyuteArgs = ExtractStoryArgs<typeof kyuteTheme>
type MicahArgs = ExtractStoryArgs<typeof micahTheme>
type MiniavsArgs = ExtractStoryArgs<typeof miniavsTheme>
type NevmstasArgs = ExtractStoryArgs<typeof nevmstasTheme>
type PacovqzzArgs = ExtractStoryArgs<typeof pacovqzzTheme>
type PawelOlekManArgs = ExtractStoryArgs<typeof pawelolekmanTheme>
type PawelOlekWomanArgs = ExtractStoryArgs<typeof pawelolekwomanTheme>
type YanliuArgs = ExtractStoryArgs<typeof yanliuTheme>

const getArgTypes = <T extends Theme<SvelteAvatarItem>>(theme: T) => {
  type Args = ExtractStoryArgs<T>
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

  return argTypes as StoryObj<Args>['argTypes']
}

export const AshleySeo: StoryObj<AshleySeoArgs> = {
  argTypes: getArgTypes(ashleyseoTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: ashleyseoTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Ashleyy: StoryObj<AshleyyArgs> = {
  argTypes: getArgTypes(ashleyyTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: ashleyyTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const FatinVerse: StoryObj<FatinVerseArgs> = {
  argTypes: getArgTypes(fatinverseTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: fatinverseTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Kyute: StoryObj<KyuteArgs> = {
  argTypes: getArgTypes(kyuteTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: kyuteTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Micah: StoryObj<MicahArgs> = {
  argTypes: getArgTypes(micahTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: micahTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Miniavs: StoryObj<MiniavsArgs> = {
  argTypes: getArgTypes(miniavsTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: miniavsTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Nevmstas: StoryObj<NevmstasArgs> = {
  argTypes: getArgTypes(nevmstasTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: nevmstasTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Pacovqzz: StoryObj<PacovqzzArgs> = {
  argTypes: getArgTypes(pacovqzzTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: pacovqzzTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const PawelOlekMan: StoryObj<PawelOlekManArgs> = {
  argTypes: getArgTypes(pawelolekmanTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: pawelolekmanTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const PawelOlekWoman: StoryObj<PawelOlekWomanArgs> = {
  argTypes: getArgTypes(pawelolekwomanTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: pawelolekwomanTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const Yanliu: StoryObj<YanliuArgs> = {
  argTypes: getArgTypes(yanliuTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: yanliuTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

const themes = {
  'Ashley Seo': ashleyseoTheme,
  Ashleyy: ashleyyTheme,
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

export const Seed: StoryObj = {
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: Object.keys(themes),
    },
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args) => ({
    Component: Avatar,
    props: {
      theme: themes[args.theme as keyof typeof themes],
      seed: args.seed,
      size: args.size,
    },
  }),
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
