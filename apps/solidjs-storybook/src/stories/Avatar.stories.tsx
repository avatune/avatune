import ashleyseoTheme from '@avatune/ashley-seo-theme/solidjs'
import ashleyyTheme from '@avatune/ashleyy-theme/solidjs'
import fatinverseTheme from '@avatune/fatin-verse-theme/solidjs'
import kyuteTheme from '@avatune/kyute-theme/solidjs'
import micahTheme from '@avatune/micah-theme/solidjs'
import miniavsTheme from '@avatune/miniavs-theme/solidjs'
import nevmstasTheme from '@avatune/nevmstas-theme/solidjs'
import pacovqzzTheme from '@avatune/pacovqzz-theme/solidjs'
import pawelolekmanTheme from '@avatune/pawel-olek-man-theme/solidjs'
import pawelolekwomanTheme from '@avatune/pawel-olek-woman-theme/solidjs'
import type { AvatarProps } from '@avatune/solidjs'
import { Avatar } from '@avatune/solidjs'
import type { SolidJsAvatarItem, Theme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/solidjs'
import type { Meta, StoryObj } from 'storybook-solidjs-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type ExtractStoryArgs<T extends Theme<SolidJsAvatarItem>> = Omit<
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

const getArgTypes = <T extends Theme<SolidJsAvatarItem>>(theme: T) => {
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
  render: (args) => <Avatar theme={ashleyseoTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Ashleyy: StoryObj<AshleyyArgs> = {
  argTypes: getArgTypes(ashleyyTheme),
  render: (args) => <Avatar theme={ashleyyTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const FatinVerse: StoryObj<FatinVerseArgs> = {
  argTypes: getArgTypes(fatinverseTheme),
  render: (args) => <Avatar theme={fatinverseTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Kyute: StoryObj<KyuteArgs> = {
  argTypes: getArgTypes(kyuteTheme),
  render: (args) => <Avatar theme={kyuteTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Micah: StoryObj<MicahArgs> = {
  argTypes: getArgTypes(micahTheme),
  render: (args) => <Avatar theme={micahTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Miniavs: StoryObj<MiniavsArgs> = {
  argTypes: getArgTypes(miniavsTheme),
  render: (args) => <Avatar theme={miniavsTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Nevmstas: StoryObj<NevmstasArgs> = {
  argTypes: getArgTypes(nevmstasTheme),
  render: (args) => <Avatar theme={nevmstasTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Pacovqzz: StoryObj<PacovqzzArgs> = {
  argTypes: getArgTypes(pacovqzzTheme),
  render: (args) => <Avatar theme={pacovqzzTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const PawelOlekMan: StoryObj<PawelOlekManArgs> = {
  argTypes: getArgTypes(pawelolekmanTheme),
  render: (args) => <Avatar theme={pawelolekmanTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const PawelOlekWoman: StoryObj<PawelOlekWomanArgs> = {
  argTypes: getArgTypes(pawelolekwomanTheme),
  render: (args) => <Avatar theme={pawelolekwomanTheme} {...args} />,
  args: {
    size: 300,
  },
}

export const Yanliu: StoryObj<YanliuArgs> = {
  argTypes: getArgTypes(yanliuTheme),
  render: (args) => <Avatar theme={yanliuTheme} {...args} />,
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
  render: ({ theme: themeName, seed, size = 300 }) => {
    const selectedTheme = themes[themeName]
    return <Avatar theme={selectedTheme} seed={seed} size={size} />
  },
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
