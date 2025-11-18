import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  AccentColors,
  BackgroundColors,
  ClothingColors,
  HairColors,
  SkinTones,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('28%'),
  y: size * percentage('32%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 164,
    borderRadius: '100%',
  })
  .connectColors('head', ['ears'])
  .connectColors('hair', ['eyebrows'])
  .mapPrediction('hair', 'short', ['short'])
  .mapPrediction('hair', 'medium', ['medium', 'cupCurly'])
  .mapPrediction('hair', 'long', ['long', 'bobRounded', 'bobStraight'])
  .mapPrediction('hairColor', 'black', [
    HairColors.JetBlack,
    HairColors.DeepBrown,
  ])
  .mapPrediction('hairColor', 'brown', [
    HairColors.ChestnutBrown,
    HairColors.DeepBrown,
  ])
  .mapPrediction('hairColor', 'blond', [HairColors.GoldenBlond])
  .mapPrediction('hairColor', 'gray', [HairColors.DeepBrown])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Medium])
  .mapPrediction('skinTone', 'light', [SkinTones.Light, SkinTones.VeryLight])
  .addColor('background', BackgroundColors.MeadowGreen)
  .addColor('background', BackgroundColors.SkyBlue)
  .addColor('background', BackgroundColors.CoralPink)
  .addColor('background', BackgroundColors.LavenderPurple)
  .addColor('background', BackgroundColors.PeachOrange)
  .addColor('background', BackgroundColors.MintGreen)
  .addColor('hair', HairColors.JetBlack)
  .addColor('hair', HairColors.DeepBrown)
  .addColor('hair', HairColors.ChestnutBrown)
  .addColor('hair', HairColors.ForestGreen)
  .addColor('hair', HairColors.DarkNavy)
  .addColor('hair', HairColors.GoldenBlond)
  .addColor('head', SkinTones.Dark)
  .addColor('head', SkinTones.Medium)
  .addColor('head', SkinTones.Light)
  .addColor('head', SkinTones.VeryLight)
  .addColor('body', ClothingColors.BrightPink)
  .addColor('body', ClothingColors.DeepMaroon)
  .addColor('body', ClothingColors.WarmBrown)
  .addColor('body', ClothingColors.GoldenYellow)
  .addColor('ears', SkinTones.Light)
  .addColor('ears', SkinTones.VeryLight)
  .addColor('eyebrows', HairColors.ChestnutBrown)
  .addColor('eyebrows', HairColors.DeepBrown)
  .addColor('eyebrows', HairColors.JetBlack)
  .addColor('eyes', AccentColors.EyeWhite)
  .addColor('eyes', AccentColors.Black)
  .addColor('mouth', AccentColors.LipPink)
  .addColor('mouth', AccentColors.BlushPink)
  .addColor('noses', AccentColors.LipPink)
  .addColor('noses', AccentColors.BlushPink)
  .addItem('body', 'shirt', {
    position: fromHeadOffset(-percentage('0%'), percentage('49.63%')),
    layer: 10,
  })
  .addItem('body', 'sweater', {
    position: fromHeadOffset(-percentage('0%'), percentage('49.63%')),
    layer: 10,
  })
  .addItem('body', 'tshirt', {
    position: fromHeadOffset(percentage('5.73%'), percentage('49.63%')),
    layer: 10,
  })
  .addItem('body', 'turtleneck', {
    position: fromHeadOffset(-percentage('0%'), percentage('48.78%')),
    layer: 10,
  })
  .addItem('ears', 'standard', {
    position: fromHeadOffset(-percentage('2.20%'), percentage('24.39%')),
    layer: 100,
  })
  .addItem('eyebrows', 'angry', {
    position: fromHeadOffset(percentage('7.32%'), percentage('20.73%')),
    layer: 30,
  })
  .addItem('eyebrows', 'small', {
    position: fromHeadOffset(percentage('10.98%'), percentage('20.73%')),
    layer: 30,
  })
  .addItem('eyebrows', 'standard', {
    position: fromHeadOffset(percentage('8.54%'), percentage('20.73%')),
    layer: 30,
  })
  .addItem('eyes', 'boring', {
    position: fromHeadOffset(percentage('10.37%'), percentage('25.61%')),
    layer: 20,
  })
  .addItem('eyes', 'dots', {
    position: fromHeadOffset(percentage('13.41%'), percentage('25.61%')),
    layer: 20,
  })
  .addItem('eyes', 'openCircle', {
    position: fromHeadOffset(percentage('10.37%'), percentage('25.61%')),
    layer: 20,
  })
  .addItem('eyes', 'openRounded', {
    position: fromHeadOffset(percentage('12.20%'), percentage('25.61%')),
    layer: 20,
  })
  .addItem('hair', 'bobRounded', {
    position: fromHeadOffset(percentage('0%'), -percentage('3.66%')),
    layer: 5,
  })
  .addItem('hair', 'bobStraight', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'cupCurly', {
    position: fromHeadOffset(-percentage('9.88%'), -percentage('9.76%')),
    layer: 5,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(-percentage('1.22%'), -percentage('1.22%')),
    layer: 5,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(-percentage('20.73%'), -percentage('3.66%')),
    layer: 5,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('0.49%'), -percentage('2.44%')),
    layer: 5,
  })
  .addItem('head', 'oval', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  .addItem('mouth', 'bigSmile', {
    position: fromHeadOffset(percentage('12.20%'), percentage('39.02%')),
    layer: 25,
  })
  .addItem('mouth', 'flat', {
    position: fromHeadOffset(percentage('12.20%'), percentage('41.46%')),
    layer: 25,
  })
  .addItem('mouth', 'frown', {
    position: fromHeadOffset(percentage('13.41%'), percentage('40.24%')),
    layer: 25,
  })
  .addItem('mouth', 'halfOpen', {
    position: fromHeadOffset(percentage('10.98%'), percentage('40.24%')),
    layer: 25,
  })
  .addItem('mouth', 'laugh', {
    position: fromHeadOffset(percentage('11.95%'), percentage('40.24%')),
    layer: 25,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('8.54%'), percentage('36.59%')),
    layer: 25,
  })
  .addItem('mouth', 'nervous', {
    position: fromHeadOffset(percentage('11.59%'), percentage('39.02%')),
    layer: 25,
  })
  .addItem('noses', 'big', {
    position: fromHeadOffset(percentage('18.90%'), percentage('30.49%')),
    layer: 15,
  })
  .addItem('noses', 'curve', {
    position: fromHeadOffset(percentage('20.12%'), percentage('34.15%')),
    layer: 15,
  })
  .addItem('noses', 'dots', {
    position: fromHeadOffset(percentage('19.51%'), percentage('34.15%')),
    layer: 15,
  })
  .addItem('noses', 'halfOval', {
    position: fromHeadOffset(percentage('19.51%'), percentage('34.15%')),
    layer: 15,
  })
