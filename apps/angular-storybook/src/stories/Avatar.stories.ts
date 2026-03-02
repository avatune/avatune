import { Avatar } from '@avatune/angular'
import ashleyseotheme from '@avatune/ashley-seo-theme/angular'
import fatinversetheme from '@avatune/fatin-verse-theme/angular'
import kutetheme from '@avatune/kyute-theme/angular'
import micahtheme from '@avatune/micah-theme/angular'
import miniavstheme from '@avatune/miniavs-theme/angular'
import nevmstastheme from '@avatune/nevmstas-theme/angular'
import pacovqzztheme from '@avatune/pacovqzz-theme/angular'
import pawelolekmantheme from '@avatune/pawel-olek-man-theme/angular'
import pawelolekwomantheme from '@avatune/pawel-olek-woman-theme/angular'
import type { AngularAvatarItem, Theme } from '@avatune/types'
import yanliutheme from '@avatune/yanliu-theme/angular'
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

export const AshleySeo = createStory(ashleyseotheme)
export const FatinVerse = createStory(fatinversetheme)
export const Kyute = createStory(kutetheme)
export const Micah = createStory(micahtheme)
export const Miniavs = createStory(miniavstheme)
export const Nevmstas = createStory(nevmstastheme)
export const Pacovqzz = createStory(pacovqzztheme)
export const PawelOlekMan = createStory(pawelolekmantheme)
export const PawelOlekWoman = createStory(pawelolekwomantheme)
export const Yanliu = createStory(yanliutheme)
