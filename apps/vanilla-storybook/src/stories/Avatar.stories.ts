import flatDesignTheme from '@avatune/flat-design-theme/vanilla'
import kawaiiDesignTheme from '@avatune/kawaii-design-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import type { AvatarConfig, VanillaAvatarItem } from '@avatune/types'
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
  AvatarConfig<VanillaAvatarItem, typeof flatDesignTheme> & {
    size?: number
  }
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
    size: 300,
  },
}

export const MiniAvs: StoryObj<
  AvatarConfig<VanillaAvatarItem, typeof miniavsTheme> & {
    size?: number
  }
> = {
  argTypes: {
    body: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.body),
    },
    faceDetails: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.faceDetails),
    },
    eyes: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.eyes),
    },
    faceHair: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.faceHair),
    },
    glasses: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.glasses),
    },
    hair: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.hair),
    },
    head: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.head),
    },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(miniavsTheme.mouth),
    },
    bodyColor: {
      control: { type: 'color' },
    },
    faceDetailsColor: {
      control: { type: 'color' },
    },
    eyesColor: {
      control: { type: 'color' },
    },
    faceHairColor: {
      control: { type: 'color' },
    },
    glassesColor: {
      control: { type: 'color' },
    },
    hairColor: {
      control: { type: 'color' },
    },
    headColor: {
      control: { type: 'color' },
    },
    mouthColor: {
      control: { type: 'color' },
    },
    size: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
    },
  },
  render: (args) => {
    return avatar({ theme: miniavsTheme, ...args })
  },
  args: {
    body: 'standard',
    faceDetails: 'standard',
    eyes: 'standard',
    hair: 'classic1',
    head: 'standard',
    mouth: 'standard',
    size: 300,
  },
}

export const KawaiiDesign: StoryObj<
  AvatarConfig<VanillaAvatarItem, typeof kawaiiDesignTheme> & {
    size?: number
  }
> = {
  argTypes: {
    glasses: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.glasses || {}),
    },
    hats: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.hats || {}),
    },
    hair: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.hair || {}),
    },
    faceDetails: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.faceDetails || {}),
    },
    body: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.body),
    },
    ears: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.ears),
    },
    eyes: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.eyes),
    },
    faceHair: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.faceHair || {}),
    },
    forelock: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.forelock || {}),
    },
    head: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.head),
    },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.mouth),
    },
    neck: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.neck || {}),
    },
    noses: {
      control: { type: 'select' },
      options: Object.keys(kawaiiDesignTheme.noses),
    },
    glassesColor: {
      control: { type: 'color' },
    },
    hatsColor: {
      control: { type: 'color' },
    },
    hairColor: {
      control: { type: 'color' },
    },
    faceDetailsColor: {
      control: { type: 'color' },
    },
    bodyColor: {
      control: { type: 'color' },
    },
    earsColor: {
      control: { type: 'color' },
    },
    eyesColor: {
      control: { type: 'color' },
    },
    faceHairColor: {
      control: { type: 'color' },
    },
    forelockColor: {
      control: { type: 'color' },
    },
    headColor: {
      control: { type: 'color' },
    },
    mouthColor: {
      control: { type: 'color' },
    },
    neckColor: {
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
    return avatar({ theme: kawaiiDesignTheme, ...args })
  },
  args: {
    glasses: 'glass',
    hats: 'beanie',
    hair: 'straightMedium',
    faceDetails: 'blushes',
    body: 'teeBasic',
    ears: 'standard',
    eyes: 'standard',
    faceHair: 'mustache',
    forelock: 'short',
    head: 'standard',
    mouth: 'smile',
    neck: 'standard',
    noses: 'standard',
    size: 300,
  },
}

export const FlatDesignSeed: StoryObj<{
  seed?: string | number
  size?: number
}> = {
  argTypes: {
    seed: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'range', min: 100, max: 800, step: 50 },
    },
  },
  render: ({ seed, size }) => {
    return avatar({ theme: flatDesignTheme, seed, size })
  },
  args: {
    seed: 'Type any seed phrase here',
    size: 300,
  },
}

export const MiniAvsSeed: StoryObj<{
  seed?: string | number
  size?: number
}> = {
  argTypes: {
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({ seed, size }) => {
    return avatar({ theme: miniavsTheme, seed, size })
  },
  args: {
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
