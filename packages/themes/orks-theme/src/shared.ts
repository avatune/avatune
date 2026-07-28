import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  BackgroundColors,
  DefaultColors,
  HairColors,
  SkinTones,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('26.29%'),
  y: size * percentage('22.64%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 960,
    borderRadius: '50%',
  })
  .connectColors('hair', ['eyebrows'])
  .connectColors('head', ['nose'])
  // Colors
  .addColors('background', [
    BackgroundColors.Parchment,
    BackgroundColors.Bone,
    BackgroundColors.Peach,
    BackgroundColors.Sage,
    BackgroundColors.Blush,
    BackgroundColors.Ice,
  ])
  .addColors('body', [DefaultColors.Default])
  .addColors('eyebrows', [
    HairColors.Brown,
    HairColors.Black,
    HairColors.LightBrown,
  ])
  .addColors('eyes', [DefaultColors.Default])
  .addColors('hair', [
    HairColors.Brown,
    HairColors.Black,
    HairColors.LightBrown,
  ])
  .addColors('head', [SkinTones.Green, SkinTones.Blue, SkinTones.Red])
  .addColors('mouth', [DefaultColors.Default])
  .addColors('nose', [SkinTones.Green, SkinTones.Blue, SkinTones.Red])
  // Body
  .addItem('body', 'tunic', {
    position: fromHeadOffset(-percentage('22.19%'), percentage('51.48%')),
    layer: 5,
  })
  .addItem('body', 'armor', {
    position: fromHeadOffset(-percentage('20.70%'), percentage('49.31%')),
    layer: 5,
  })
  .addItem('body', 'studdedVest', {
    position: fromHeadOffset(-percentage('18.32%'), percentage('49.64%')),
    layer: 5,
  })
  .addItem('body', 'furJacket', {
    position: fromHeadOffset(-percentage('21.99%'), percentage('50.80%')),
    layer: 5,
  })
  .addItem('body', 'openJacket', {
    position: fromHeadOffset(-percentage('21.57%'), percentage('47.72%')),
    layer: 5,
  })
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(-percentage('21.57%'), percentage('44.30%')),
    layer: 5,
  })
  .addItem('body', 'wrapTunic', {
    position: fromHeadOffset(-percentage('22.40%'), percentage('50.46%')),
    layer: 5,
  })
  // Eyebrows
  .addItem('eyebrows', 'default', {
    position: fromHeadOffset(percentage('10.72%'), percentage('15.98%')),
    layer: 22,
  })
  .addItem('eyebrows', 'angry', {
    position: fromHeadOffset(percentage('10.72%'), percentage('15.24%')),
    layer: 25,
  })
  .addItem('eyebrows', 'calm', {
    position: fromHeadOffset(percentage('10.72%'), percentage('15.09%')),
    layer: 22,
  })
  .addItem('eyebrows', 'confident', {
    position: fromHeadOffset(percentage('10.72%'), percentage('16.05%')),
    layer: 22,
  })
  .addItem('eyebrows', 'neutral', {
    position: fromHeadOffset(percentage('10.72%'), percentage('16.97%')),
    layer: 22,
  })
  // Eyes
  .addItem('eyes', 'default', {
    position: fromHeadOffset(percentage('11.92%'), percentage('20.56%')),
    layer: 23,
  })
  .addItem('eyes', 'tired', {
    position: fromHeadOffset(percentage('11.42%'), percentage('21.10%')),
    layer: 23,
  })
  .addItem('eyes', 'scared', {
    position: fromHeadOffset(percentage('12.42%'), percentage('20.44%')),
    layer: 23,
  })
  // Hair
  .addItem('hair', 'bun', {
    position: fromHeadOffset(percentage('4.50%'), -percentage('20.87%')),
    layer: 40,
  })
  .addItem('hair', 'braids', {
    position: fromHeadOffset(-percentage('0.58%'), -percentage('7.90%')),
    layer: 40,
  })
  .addItem('hair', 'sideForelock', {
    position: fromHeadOffset(percentage('4.67%'), -percentage('8.64%')),
    layer: 40,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(-percentage('7.50%'), -percentage('16.01%')),
    layer: 40,
  })
  .addItem('hair', 'braid', {
    position: fromHeadOffset(percentage('4.73%'), -percentage('7.26%')),
    layer: 40,
  })
  .addItem('hair', 'dreadlocks', {
    position: fromHeadOffset(-percentage('5.29%'), -percentage('7.06%')),
    layer: 40,
  })
  .addItem('hair', 'mohawk', {
    position: fromHeadOffset(percentage('15.62%'), -percentage('15.76%')),
    layer: 40,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(percentage('4.00%'), -percentage('9.12%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'default', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('head', 'large', {
    position: fromHeadOffset(-percentage('0.79%'), -percentage('2.10%')),
    layer: 10,
  })
  .addItem('head', 'sqaure', {
    position: fromHeadOffset(percentage('0.51%'), percentage('2.84%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('12.21%'), percentage('36.84%')),
    layer: 20,
  })
  .addItem('mouth', 'hooky', {
    position: fromHeadOffset(percentage('12.21%'), percentage('37.00%')),
    layer: 20,
  })
  .addItem('mouth', 'openTusks', {
    position: fromHeadOffset(percentage('12.21%'), percentage('35.01%')),
    layer: 20,
  })
  .addItem('mouth', 'neutral', {
    position: fromHeadOffset(percentage('12.21%'), percentage('37.92%')),
    layer: 20,
  })
  .addItem('mouth', 'dracula', {
    position: fromHeadOffset(percentage('12.21%'), percentage('38.27%')),
    layer: 20,
  })
  .addItem('mouth', 'open', {
    position: fromHeadOffset(percentage('12.21%'), percentage('34.16%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'default', {
    position: fromHeadOffset(percentage('17.42%'), percentage('28.63%')),
    layer: 21,
  })
