import { Avatar } from '@avatune/angular'
import ashleyseoTheme from '@avatune/ashley-seo-theme/angular'
import ashleyyTheme from '@avatune/ashleyy-theme/angular'
import fatinverseTheme from '@avatune/fatin-verse-theme/angular'
import kyuteTheme from '@avatune/kyute-theme/angular'
import micahTheme from '@avatune/micah-theme/angular'
import miniavsTheme from '@avatune/miniavs-theme/angular'
import nevmstasTheme from '@avatune/nevmstas-theme/angular'
import pacovqzzTheme from '@avatune/pacovqzz-theme/angular'
import pawelolekmanTheme from '@avatune/pawel-olek-man-theme/angular'
import pawelolekwomanTheme from '@avatune/pawel-olek-woman-theme/angular'
import type { AngularAvatarItem, Theme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/angular'
import type { Meta, StoryObj } from '@storybook/angular'
import type { Args } from 'storybook/internal/types'

const meta: Meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta

const getArgTypes = <T extends Theme<AngularAvatarItem>>(theme: T) => {
  const argTypes: Record<string, unknown> = {
    inputSize: { control: { type: 'range', min: 100, max: 800, step: 50 } },
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

const createStory = <T extends Theme<AngularAvatarItem>>(
  theme: T,
): StoryObj => ({
  argTypes: getArgTypes(theme),
  args: { inputSize: 300 },
  render: (args) => ({
    props: { theme, ...args },
  }),
})

export const AshleySeo = createStory(ashleyseoTheme)

export const Ashleyy = createStory(ashleyyTheme)

export const FatinVerse = createStory(fatinverseTheme)

export const Kyute = createStory(kyuteTheme)

export const Micah = createStory(micahTheme)

export const Miniavs = createStory(miniavsTheme)

export const Nevmstas = createStory(nevmstasTheme)

export const Pacovqzz = createStory(pacovqzzTheme)

export const PawelOlekMan = createStory(pawelolekmanTheme)

export const PawelOlekWoman = createStory(pawelolekwomanTheme)

export const Yanliu = createStory(yanliuTheme)
