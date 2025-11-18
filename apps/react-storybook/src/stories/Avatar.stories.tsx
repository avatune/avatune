import flatTheme from '@avatune/flat-design-theme/react'
import kawaiiTheme from '@avatune/kawaii-design-theme/react'
import miniavsTheme from '@avatune/miniavs-theme/react'
import type { AvatarProps } from '@avatune/react'
import { Avatar } from '@avatune/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type FlatArgs = Omit<AvatarProps<typeof flatTheme>, 'theme'>
type MiniavsArgs = Omit<AvatarProps<typeof miniavsTheme>, 'theme'>
type KawaiiArgs = Omit<AvatarProps<typeof kawaiiTheme>, 'theme'>

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
  render: (args) => <Avatar theme={flatTheme} {...args} />,
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

export const MiniAvs: StoryObj<MiniavsArgs> = {
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
    bodyColor: { control: { type: 'color' } },
    faceDetailsColor: { control: { type: 'color' } },
    eyesColor: { control: { type: 'color' } },
    faceHairColor: { control: { type: 'color' } },
    glassesColor: { control: { type: 'color' } },
    hairColor: { control: { type: 'color' } },
    headColor: { control: { type: 'color' } },
    mouthColor: { control: { type: 'color' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args) => <Avatar theme={miniavsTheme} {...args} />,
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

export const KawaiiDesign: StoryObj<KawaiiArgs> = {
  argTypes: {
    glasses: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.glasses || {}),
    },
    hats: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.hats || {}),
    },
    hair: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.hair || {}),
    },
    faceDetails: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.faceDetails || {}),
    },
    body: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.body),
    },
    ears: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.ears),
    },
    eyes: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.eyes),
    },
    faceHair: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.faceHair || {}),
    },
    forelock: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.forelock || {}),
    },
    head: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.head),
    },
    mouth: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.mouth),
    },
    neck: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.neck || {}),
    },
    noses: {
      control: { type: 'select' },
      options: Object.keys(kawaiiTheme.noses),
    },
    glassesColor: { control: { type: 'color' } },
    hatsColor: { control: { type: 'color' } },
    hairColor: { control: { type: 'color' } },
    faceDetailsColor: { control: { type: 'color' } },
    bodyColor: { control: { type: 'color' } },
    earsColor: { control: { type: 'color' } },
    eyesColor: { control: { type: 'color' } },
    faceHairColor: { control: { type: 'color' } },
    forelockColor: { control: { type: 'color' } },
    headColor: { control: { type: 'color' } },
    mouthColor: { control: { type: 'color' } },
    neckColor: { control: { type: 'color' } },
    nosesColor: { control: { type: 'color' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: (args) => {
    return <Avatar theme={kawaiiTheme} {...args} />
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
  height?: number
}> = {
  argTypes: {
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({ seed, size = 300 }) => {
    return <Avatar theme={flatTheme} seed={seed} size={size} />
  },
  args: {
    seed: 'Type any seed phrase here',
    size: 300,
  },
}

export const MiniAvsSeed: StoryObj<{
  seed?: string | number
  size?: number
  height?: number
}> = {
  argTypes: {
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({ seed, size = 300 }) => {
    return <Avatar theme={miniavsTheme} seed={seed} size={size} />
  },
  args: {
    seed: 'Type any seed phrase here',
    size: 300,
  },
}

export const KawaiiSeed: StoryObj<{
  seed?: string | number
  size?: number
  height?: number
}> = {
  argTypes: {
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },
  render: ({ seed, size = 300 }) => {
    return <Avatar theme={kawaiiTheme} seed={seed} size={size} />
  },
  args: {
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
