import type { BaseAvatarItem, Theme } from '@avatune/types'
import { offsetFrom, percentage } from '@avatune/utils'
import { AccentColors, ClothingColors, HairColors, SkinTones } from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('32%'),
  y: size * percentage('30%'),
})

const fromHead = offsetFrom(getHeadPosition)

export default {
  style: {
    size: 200,
    backgroundColor: '#a7c957',
    borderRadius: 0,
  },
  connectedColors: {
    ears: 'head',
    eyebrows: 'hair',
  },
  predictorMappings: {
    hair: {
      short: ['short'],
      medium: ['medium', 'cupCurly'],
      long: ['long', 'bobRounded', 'bobStraight'],
    },
    hairColor: {
      black: [HairColors.JetBlack, HairColors.DeepBrown],
      brown: [HairColors.ChestnutBrown, HairColors.DeepBrown],
      blond: [HairColors.GoldenBlond],
      gray: [HairColors.DeepBrown],
    },
    skinTone: {
      dark: [SkinTones.Dark],
      medium: [SkinTones.Medium],
      light: [SkinTones.Light, SkinTones.VeryLight],
    },
  },
  colorPalettes: {
    hair: [
      HairColors.JetBlack,
      HairColors.DeepBrown,
      HairColors.ChestnutBrown,
      HairColors.ForestGreen,
      HairColors.DarkNavy,
      HairColors.GoldenBlond,
    ],
    head: [
      SkinTones.Dark,
      SkinTones.Medium,
      SkinTones.Light,
      SkinTones.VeryLight,
    ],
    body: [
      ClothingColors.BrightPink,
      ClothingColors.DeepMaroon,
      ClothingColors.WarmBrown,
      ClothingColors.GoldenYellow,
    ],
    ears: [SkinTones.Light, SkinTones.VeryLight],
    eyebrows: [
      HairColors.ChestnutBrown,
      HairColors.DeepBrown,
      HairColors.JetBlack,
    ],
    eyes: [AccentColors.EyeWhite, AccentColors.Black],
    mouth: [AccentColors.LipPink, AccentColors.BlushPink],
    noses: [AccentColors.LipPink, AccentColors.BlushPink],
  },
  body: {
    shirt: {
      position: fromHead(-percentage('0%'), percentage('40.7%')),
      layer: 10,
    },
    sweater: {
      position: fromHead(-percentage('0%'), percentage('40.7%')),
      layer: 10,
    },
    tshirt: {
      position: fromHead(percentage('4.7%'), percentage('40.7%')),
      layer: 10,
    },
    turtleneck: {
      position: fromHead(-percentage('0%'), percentage('40%')),
      layer: 10,
    },
  },
  ears: {
    standard: {
      position: fromHead(-percentage('1.8%'), percentage('20%')),
      layer: 100,
    },
  },
  eyebrows: {
    angry: {
      position: fromHead(percentage('6%'), percentage('17%')),
      layer: 30,
    },
    small: {
      position: fromHead(percentage('9%'), percentage('17%')),
      layer: 30,
    },
    standard: {
      position: fromHead(percentage('7%'), percentage('17%')),
      layer: 30,
    },
  },
  eyes: {
    boring: {
      position: fromHead(percentage('8.5%'), percentage('21%')),
      layer: 20,
    },
    dots: {
      position: fromHead(percentage('11%'), percentage('21%')),
      layer: 20,
    },
    openCircle: {
      position: fromHead(percentage('8.5%'), percentage('21%')),
      layer: 20,
    },
    openRounded: {
      position: fromHead(percentage('10%'), percentage('21%')),
      layer: 20,
    },
  },
  hair: {
    bobRounded: {
      position: fromHead(percentage('0%'), -percentage('3%')),
      layer: 5,
    },
    bobStraight: {
      position: fromHead(percentage('0%'), -percentage('0%')),
      layer: 5,
    },
    cupCurly: {
      position: fromHead(-percentage('8.1%'), -percentage('8%')),
      layer: 5,
    },
    short: {
      position: fromHead(-percentage('1%'), -percentage('1%')),
      layer: 5,
    },
    long: {
      position: fromHead(-percentage('17%'), -percentage('3%')),
      layer: 5,
    },
    medium: {
      position: fromHead(-percentage('0.4%'), -percentage('2%')),
      layer: 5,
    },
  },
  head: {
    oval: {
      position: fromHead(percentage('0%'), percentage('0%')),
      layer: 1,
    },
  },
  mouth: {
    bigSmile: {
      position: fromHead(percentage('10%'), percentage('32%')),
      layer: 25,
    },
    flat: {
      position: fromHead(percentage('10%'), percentage('34%')),
      layer: 25,
    },
    frown: {
      position: fromHead(percentage('11%'), percentage('33%')),
      layer: 25,
    },
    halfOpen: {
      position: fromHead(percentage('9%'), percentage('33%')),
      layer: 25,
    },
    laugh: {
      position: fromHead(percentage('9.8%'), percentage('33%')),
      layer: 25,
    },
    smile: {
      position: fromHead(percentage('7%'), percentage('30%')),
      layer: 25,
    },
    nervous: {
      position: fromHead(percentage('9.5%'), percentage('32%')),
      layer: 25,
    },
  },
  noses: {
    big: {
      position: fromHead(percentage('15.5%'), percentage('25%')),
      layer: 15,
    },
    curve: {
      position: fromHead(percentage('16.5%'), percentage('28%')),
      layer: 15,
    },
    dots: {
      position: fromHead(percentage('16%'), percentage('28%')),
      layer: 15,
    },
    halfOval: {
      position: fromHead(percentage('16%'), percentage('28%')),
      layer: 15,
    },
  },
} satisfies Theme<BaseAvatarItem>
