import flatdesignTheme from '@avatune/flat-design-theme/vanilla'
import kawaiidesignTheme from '@avatune/kawaii-design-theme/vanilla'
import micahdesignTheme from '@avatune/micah-design-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import type { Theme, VanillaAvatarItem } from '@avatune/types'
import { type AvatarArgs, avatar } from '@avatune/vanilla'
import type { Meta, StoryObj } from '@storybook/html-vite'

const meta = {
  title: 'Avatar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta

type FlatDesignArgs = Omit<AvatarArgs<typeof flatdesignTheme>, 'theme'>
type KawaiiDesignArgs = Omit<AvatarArgs<typeof kawaiidesignTheme>, 'theme'>
type MicahDesignArgs = Omit<AvatarArgs<typeof micahdesignTheme>, 'theme'>
type MiniavsArgs = Omit<AvatarArgs<typeof miniavsTheme>, 'theme'>

const getArgTypes = <T extends Theme<VanillaAvatarItem>>(theme: T) => {
  const argTypes: Record<string, unknown> = {
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  }

  for (const [category, items] of Object.entries(theme)) {
    const excludeCategories = ['style', 'predictorMappings', 'colorPalettes', 'connectedColors']
    if (excludeCategories.includes(category)) continue

    argTypes[`${category}Color`] = { control: { type: 'color' } }
    argTypes[category] = {
      control: { type: 'select' },
      options: Object.keys(items),
    }
  }

  return argTypes
}

export const FlatDesign: StoryObj<FlatDesignArgs> = {
  argTypes: getArgTypes(flatdesignTheme),
  render: (args: FlatDesignArgs) => {
    return avatar({ theme: flatdesignTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const KawaiiDesign: StoryObj<KawaiiDesignArgs> = {
  argTypes: getArgTypes(kawaiidesignTheme),
  render: (args: KawaiiDesignArgs) => {
    return avatar({ theme: kawaiidesignTheme, ...args })
  },
  args: {
    size: 300,
  },
}

export const MicahDesign: StoryObj<MicahDesignArgs> = {
  argTypes: getArgTypes(micahdesignTheme),
  render: (args: MicahDesignArgs) => {
    return avatar({ theme: micahdesignTheme, ...args })
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

const themes = {
  'Flat Design': flatdesignTheme,
  'Kawaii Design': kawaiidesignTheme,
  'Micah Design': micahdesignTheme,
  'Miniavs': miniavsTheme,
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
