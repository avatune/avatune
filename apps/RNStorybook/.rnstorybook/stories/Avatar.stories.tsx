import micahTheme from '@avatune/micah-theme/react-native'
import miniavsTheme from '@avatune/miniavs-theme/react-native'
import nevmstasTheme from '@avatune/nevmstas-theme/react-native'
import type { AvatarProps } from '@avatune/react-native'
import { Avatar } from '@avatune/react-native'
import type {
  ReactNativeAvatarItem,
  ReactNativeTheme,
  Theme,
} from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/react-native'
import type { Meta, StoryObj } from '@storybook/react-native'
import * as React from 'react'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

console.log(Avatar)

type ExtractStoryArgs<T extends ReactNativeTheme> = Omit<
  AvatarProps<T>,
  'theme'
>

type NevmstasArgs = ExtractStoryArgs<typeof nevmstasTheme>
type YanliuArgs = ExtractStoryArgs<typeof yanliuTheme>
type MicahArgs = ExtractStoryArgs<typeof micahTheme>
type MiniavsArgs = ExtractStoryArgs<typeof miniavsTheme>

const getArgTypes = <T extends Theme<ReactNativeAvatarItem>>(theme: T) => {
  type Args = ExtractStoryArgs<T>
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

  return argTypes as StoryObj<Args>['argTypes']
}

export const Nevmstas: StoryObj<NevmstasArgs> = {
  argTypes: getArgTypes(nevmstasTheme),
  render: (args) => <Avatar theme={nevmstasTheme} {...args} />,
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

const themes = {
  Nevmstas: nevmstasTheme,
  Yanliu: yanliuTheme,
  Micah: micahTheme,
  Miniavs: miniavsTheme,
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
