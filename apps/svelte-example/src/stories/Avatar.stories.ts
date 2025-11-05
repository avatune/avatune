import flatTheme from '@avatune/flat-design-theme/svelte'
import sketchTheme from '@avatune/sketch-black-white-theme/svelte'
import type { AvatarProps } from '@avatune/svelte'
import { Avatar } from '@avatune/svelte'
import type { Meta, StoryObj } from '@storybook/svelte-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type FlatArgs = AvatarProps<typeof flatTheme>
type SketchArgs = AvatarProps<typeof sketchTheme>

export const FlatDesign: StoryObj<FlatArgs> = {
  argTypes: {
    theme: { table: { disable: true } },
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
  args: {
    theme: flatTheme,
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
    theme: { table: { disable: true } },
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
  args: {
    theme: sketchTheme,
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

export const SeededThemeSwitch: StoryObj<
  AvatarProps<typeof flatTheme | typeof sketchTheme> & {
    themeKey?: ThemeKey
  }
> = {
  argTypes: {
    theme: { table: { disable: true } },
    themeKey: { control: { type: 'select' }, options: ['flat', 'sketch'] },
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args) => ({
    Component: Avatar,
    props: {
      theme: args.themeKey === 'sketch' ? sketchTheme : flatTheme,
      seed: args.seed,
      size: args.size,
    },
  }),
  args: {
    theme: flatTheme,
    themeKey: 'flat',
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
