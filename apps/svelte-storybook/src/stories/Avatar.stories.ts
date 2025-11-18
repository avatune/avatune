import flatdesignTheme from '@avatune/flat-design-theme/svelte'
import kawaiidesignTheme from '@avatune/kawaii-design-theme/svelte'
import micahdesignTheme from '@avatune/micah-design-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import type { AvatarProps } from '@avatune/svelte'
import { Avatar } from '@avatune/svelte'
import type { SvelteAvatarItem, Theme } from '@avatune/types'
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

type FlatDesignArgs = ExtractStoryArgs<typeof flatdesignTheme>
type KawaiiDesignArgs = ExtractStoryArgs<typeof kawaiidesignTheme>
type MicahDesignArgs = ExtractStoryArgs<typeof micahdesignTheme>
type MiniavsArgs = ExtractStoryArgs<typeof miniavsTheme>

const getArgTypes = <T extends Theme<SvelteAvatarItem>>(theme: T) => {
  type Args = ExtractStoryArgs<T>
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

  return argTypes as StoryObj<Args>['argTypes']
}

export const FlatDesign: StoryObj<FlatDesignArgs> = {
  argTypes: getArgTypes(flatdesignTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: flatdesignTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const KawaiiDesign: StoryObj<KawaiiDesignArgs> = {
  argTypes: getArgTypes(kawaiidesignTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: kawaiidesignTheme, ...args },
  }),
  args: {
    size: 300,
  },
}

export const MicahDesign: StoryObj<MicahDesignArgs> = {
  argTypes: getArgTypes(micahdesignTheme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: micahdesignTheme, ...args },
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

const themes = {
  'Flat Design': flatdesignTheme,
  'Kawaii Design': kawaiidesignTheme,
  'Micah Design': micahdesignTheme,
  'Miniavs': miniavsTheme,
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
