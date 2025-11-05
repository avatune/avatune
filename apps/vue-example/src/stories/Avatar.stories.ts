import flatTheme from '@avatune/flat-design-theme/vue'
import sketchTheme from '@avatune/sketch-black-white-theme/vue'
import type { AvatarProps } from '@avatune/vue'
import { Avatar } from '@avatune/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type FlatArgs = Omit<AvatarProps<typeof flatTheme>, 'theme'>
type SketchArgs = Omit<AvatarProps<typeof sketchTheme>, 'theme'>

export const FlatDesign: StoryObj<FlatArgs> = {
  argTypes: {
    body: { control: { type: 'select' }, options: Object.keys(flatTheme.body) },
    ears: { control: { type: 'select' }, options: Object.keys(flatTheme.ears) },
    eyebrows: {
      control: { type: 'select' },
      options: Object.keys(flatTheme.eyebrows),
    },
    eyes: { control: { type: 'select' }, options: Object.keys(flatTheme.eyes) },
    hair: { control: { type: 'select' }, options: Object.keys(flatTheme.hair) },
    head: { control: { type: 'select' }, options: Object.keys(flatTheme.head) },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(flatTheme.mouth),
    },
    noses: {
      control: { type: 'select' },
      options: Object.keys(flatTheme.noses),
    },
    bodyColor: { control: { type: 'color' } },
    earsColor: { control: { type: 'color' } },
    eyebrowsColor: { control: { type: 'color' } },
    eyesColor: { control: { type: 'color' } },
    hairColor: { control: { type: 'color' } },
    headColor: { control: { type: 'color' } },
    nosesColor: { control: { type: 'color' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args: FlatArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: flatTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    body: 'sweater',
    ears: 'standard',
    eyebrows: 'standard',
    eyes: 'dots',
    hair: 'short',
    head: 'oval',
    mouth: 'smile',
    noses: 'curve',
    size: 300,
  },
}

export const Sketch: StoryObj<SketchArgs> = {
  argTypes: {
    ears: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.ears),
    },
    eyebrows: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.eyebrows),
    },
    eyes: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.eyes),
    },
    hair: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.hair),
    },
    head: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.head),
    },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.mouth),
    },
    noses: {
      control: { type: 'select' },
      options: Object.keys(sketchTheme.noses),
    },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args: SketchArgs) => ({
    components: { Avatar },
    setup: () => ({ args, theme: sketchTheme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    ears: 'round',
    eyebrows: 'bold',
    eyes: 'standard',
    hair: 'star',
    head: 'oval',
    mouth: 'smile',
    noses: 'standard',
    size: 300,
  },
}

type ThemeKey = 'flat' | 'sketch'

export const SeededThemeSwitch: StoryObj<{
  theme: ThemeKey
  seed?: string | number
  size?: number
}> = {
  argTypes: {
    theme: { control: { type: 'select' }, options: ['flat', 'sketch'] },
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({
    theme,
    seed,
    size = 300,
  }: {
    theme: ThemeKey
    seed?: string | number
    size?: number
  }) => ({
    components: { Avatar },
    setup: () => ({
      selectedTheme: theme === 'sketch' ? sketchTheme : flatTheme,
      seed,
      size,
    }),
    template: '<Avatar :theme="selectedTheme" :seed="seed" :size="size" />',
  }),
  args: {
    theme: 'flat',
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
