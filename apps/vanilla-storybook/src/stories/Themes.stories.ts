import flatDesignTheme from '@avatune/flat-design-theme/vanilla'
import sketchTheme from '@avatune/sketch-black-white-theme/vanilla'
import type { TypedAvatarConfig } from '@avatune/types'
import { avatar } from '@avatune/vanilla'
import type { Meta, StoryObj } from '@storybook/html-vite'

const meta: Meta = {
  title: 'Avatar',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const FlatDesign: StoryObj<
  TypedAvatarConfig<typeof flatDesignTheme> & { size?: number }
> = {
  argTypes: {
    body: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.body),
    },
    ears: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.ears),
    },
    eyebrows: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.eyebrows),
    },
    eyes: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.eyes),
    },
    hair: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.hair),
    },
    head: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.head),
    },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.mouth),
    },
    noses: {
      control: { type: 'select' },
      options: Object.keys(flatDesignTheme.noses),
    },
    bodyColor: {
      control: { type: 'color' },
    },
    earsColor: {
      control: { type: 'color' },
    },
    eyebrowsColor: {
      control: { type: 'color' },
    },
    eyesColor: {
      control: { type: 'color' },
    },
    hairColor: {
      control: { type: 'color' },
    },
    headColor: {
      control: { type: 'color' },
    },
    nosesColor: {
      control: { type: 'color' },
    },
    size: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
    },
  },
  render: (args) => {
    return avatar({ theme: flatDesignTheme, ...args })
  },
  args: {
    body: 'sweater',
    ears: 'standard',
    eyebrows: 'standard',
    eyes: 'dots',
    hair: 'short',
    head: 'oval',
    mouth: 'smile',
    noses: 'curve',
    size: 200,
  },
}

export const Sketch: StoryObj<
  TypedAvatarConfig<typeof sketchTheme> & { size?: number }
> = {
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
    size: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
    },
  },
  render: (args) => avatar({ theme: sketchTheme, ...args }),
  args: {
    ears: 'round',
    eyebrows: 'bold',
    eyes: 'standard',
    hair: 'star',
    head: 'oval',
    mouth: 'smirk',
    noses: 'sharp',
    size: 200,
  },
}

type ThemeKey = 'flat' | 'sketch'

export const SeededThemeSwitch: StoryObj<{
  theme: ThemeKey
  seed?: string | number
  size?: number
}> = {
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['flat', 'sketch'],
    },
    seed: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
    },
  },
  render: ({ theme, seed, size }) => {
    const selectedTheme = theme === 'sketch' ? sketchTheme : flatDesignTheme
    return avatar({ theme: selectedTheme, seed, size })
  },
  args: {
    theme: 'flat',
    seed: 'Type any seed phrase here',
    size: 200,
  },
}
