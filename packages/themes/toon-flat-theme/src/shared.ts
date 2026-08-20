import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  AccentColors,
  BackgroundColors,
  BodyColors,
  DefaultColors,
  HairColors,
  SkinTones,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('29.81%'),
  y: size * percentage('16.80%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 534,
    borderRadius: '50%',
  })
  // Predictions
  .mapPrediction('hair', 'short', ['pasted8', 'pasted9'])
  .mapPrediction('hair', 'medium', ['pasted5', 'pasted2'])
  .mapPrediction('hair', 'long', ['pasted4', 'pasted1'])
  .mapPrediction('hairColor', 'black', [HairColors.Color1])
  .mapPrediction('hairColor', 'brown', [HairColors.Color3])
  .mapPrediction('hairColor', 'blond', [HairColors.Color5, HairColors.Color4])
  .mapPrediction('hairColor', 'gray', [HairColors.Color2])
  // Colors
  .addColors('background', [BackgroundColors.Seashell])
  .addColors('body', [
    BodyColors.Color2,
    BodyColors.Color3,
    BodyColors.Color32,
    BodyColors.Color4,
    BodyColors.Color5,
    BodyColors.Color6,
  ])
  .addColors('eyes', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  .addColors('hair', [
    HairColors.Color1,
    HairColors.Color2,
    HairColors.Color3,
    HairColors.Color4,
    HairColors.Color5,
    HairColors.Color6,
  ])
  .addColors('head', [
    SkinTones.Light,
    SkinTones.Medium,
    SkinTones.Dark,
    SkinTones.VeryLight,
  ])
  .addColors('mouth', [DefaultColors.Default])
  .addColors('nose', [DefaultColors.Default])
  // Body
  .addItem('body', 'halfZip', {
    position: fromHeadOffset(-percentage('18.19%'), percentage('43.06%')),
    layer: 5,
  })
  .addItem('body', 'tshirt', {
    position: fromHeadOffset(-percentage('20.06%'), percentage('45.44%')),
    layer: 5,
  })
  .addItem('body', 'turtleneck', {
    position: fromHeadOffset(-percentage('17.62%'), percentage('44.81%')),
    layer: 5,
  })
  .addItem('body', 'shirt', {
    position: fromHeadOffset(-percentage('19.43%'), percentage('43.87%')),
    layer: 5,
  })
  .addItem('body', 'sweater', {
    position: fromHeadOffset(-percentage('23.94%'), percentage('45.46%')),
    layer: 5,
  })
  .addItem('body', 'jacket', {
    position: fromHeadOffset(-percentage('18.19%'), percentage('37.36%')),
    layer: 5,
  })
  .addItem('body', 'vest', {
    position: fromHeadOffset(-percentage('29.57%'), percentage('31.49%')),
    layer: 5,
  })
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(-percentage('23.01%'), percentage('33.86%')),
    layer: 5,
  })
  // Eyes
  .addItem('eyes', 'big', {
    position: fromHeadOffset(percentage('2.39%'), percentage('18.39%')),
    layer: 20,
  })
  .addItem('eyes', 'almond', {
    position: fromHeadOffset(percentage('1.95%'), percentage('19.12%')),
    layer: 20,
  })
  .addItem('eyes', 'narrow', {
    position: fromHeadOffset(percentage('1.64%'), percentage('19.10%')),
    layer: 20,
  })
  // Hair
  .addItem('hair', 'dreads', {
    position: fromHeadOffset(-percentage('5.06%'), -percentage('2.37%')),
    layer: 40,
  })
  .addItem('hair', 'messy', {
    position: fromHeadOffset(-percentage('4.31%'), -percentage('4.23%')),
    layer: 40,
  })
  .addItem('hair', 'bun', {
    position: fromHeadOffset(-percentage('1.30%'), -percentage('13.79%')),
    layer: 40,
  })
  .addItem('hair', 'bowlerHat', {
    position: fromHeadOffset(-percentage('10.12%'), -percentage('10.28%')),
    layer: 40,
  })
  .addItem('hair', 'ponyTail', {
    position: fromHeadOffset(-percentage('1.81%'), -percentage('1.85%')),
    layer: 40,
  })
  .addItem('hair', 'beanie', {
    position: fromHeadOffset(-percentage('1.93%'), -percentage('8.58%')),
    layer: 40,
  })
  .addItem('hair', 'sidePart', {
    position: fromHeadOffset(-percentage('1.61%'), -percentage('4.03%')),
    layer: 40,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(percentage('0.19%'), -percentage('4.82%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('5.42%'), percentage('35.48%')),
    layer: 20,
  })
  .addItem('mouth', 'flat', {
    position: fromHeadOffset(percentage('5.50%'), percentage('35.16%')),
    layer: 20,
  })
  .addItem('mouth', 'laugh', {
    position: fromHeadOffset(percentage('4.17%'), percentage('33.36%')),
    layer: 20,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('5.57%'), percentage('35.28%')),
    layer: 20,
  })
  .addItem('mouth', 'openSmile', {
    position: fromHeadOffset(percentage('7.28%'), percentage('35.40%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'curve', {
    position: fromHeadOffset(percentage('6.41%'), percentage('26.05%')),
    layer: 21,
  })
  .addItem('nose', 'flat', {
    position: fromHeadOffset(percentage('6.64%'), percentage('28.00%')),
    layer: 21,
  })
  .addItem('nose', 'thin', {
    position: fromHeadOffset(percentage('5.49%'), percentage('25.42%')),
    layer: 21,
  })
