import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import { AccentColors, BackgroundColors, SkinTones } from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('32.53%'),
  y: size * percentage('16.84%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 560,
    borderRadius: '50%',
  })
  // Colors
  .addColors('background', [BackgroundColors.Yellow, BackgroundColors.Gray])
  .addColors('body', [
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
  ])
  .addColors('eyes', [AccentColors.Black])
  .addColors('hair', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Canary,
  ])
  .addColors('head', [SkinTones.Light, SkinTones.Medium, SkinTones.Dark])
  .addColors('mouth', [AccentColors.Black])
  .addColors('nose', [AccentColors.Black])
  // Body
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(-percentage('20.93%'), percentage('43.40%')),
    layer: 5,
  })
  .addItem('body', 'poncho1', {
    position: fromHeadOffset(-percentage('21.97%'), percentage('45.67%')),
    layer: 5,
  })
  .addItem('body', 'jacket1', {
    position: fromHeadOffset(-percentage('20.43%'), percentage('43.36%')),
    layer: 5,
  })
  .addItem('body', 'jacket2', {
    position: fromHeadOffset(-percentage('20.43%'), percentage('46.77%')),
    layer: 5,
  })
  .addItem('body', 'jacket3', {
    position: fromHeadOffset(-percentage('20.43%'), percentage('45.46%')),
    layer: 5,
  })
  .addItem('body', 'poncho', {
    position: fromHeadOffset(-percentage('23.43%'), percentage('44.39%')),
    layer: 5,
  })
  .addItem('body', 'jacket4', {
    position: fromHeadOffset(-percentage('21.43%'), percentage('45.94%')),
    layer: 5,
  })
  // Eyes
  .addItem('eyes', 'brave', {
    position: fromHeadOffset(percentage('3.69%'), percentage('13.65%')),
    layer: 40,
  })
  .addItem('eyes', 'sharp', {
    position: fromHeadOffset(percentage('3.69%'), percentage('13.75%')),
    layer: 40,
  })
  .addItem('eyes', 'round', {
    position: fromHeadOffset(percentage('3.69%'), percentage('13.96%')),
    layer: 40,
  })
  .addItem('eyes', 'husky', {
    position: fromHeadOffset(percentage('3.69%'), percentage('13.98%')),
    layer: 40,
  })
  .addItem('eyes', 'focused', {
    position: fromHeadOffset(percentage('3.69%'), percentage('13.87%')),
    layer: 40,
  })
  .addItem('eyes', 'curious', {
    position: fromHeadOffset(percentage('3.69%'), percentage('15.00%')),
    layer: 40,
  })
  .addItem('eyes', 'anxious', {
    position: fromHeadOffset(percentage('3.69%'), percentage('14.17%')),
    layer: 40,
  })
  // Hair
  .addItem('hair', 'short', {
    position: fromHeadOffset(-percentage('6.57%'), -percentage('11.04%')),
    layer: 40,
  })
  .addItem('hair', 'stylish', {
    position: fromHeadOffset(-percentage('3.86%'), -percentage('16.94%')),
    layer: 40,
  })
  .addItem('hair', 'bob', {
    position: fromHeadOffset(-percentage('11.35%'), -percentage('10.72%')),
    layer: 40,
  })
  .addItem('hair', 'braids', {
    position: fromHeadOffset(-percentage('13.74%'), -percentage('11.22%')),
    layer: 40,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('12.81%'), -percentage('10.48%')),
    layer: 40,
  })
  .addItem('hair', 'forehead', {
    position: fromHeadOffset(-percentage('11.13%'), -percentage('9.06%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'oval', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('head', 'robot', {
    position: fromHeadOffset(-percentage('0.92%'), percentage('5.85%')),
    layer: 10,
  })
  .addItem('head', 'rhombus', {
    position: fromHeadOffset(-percentage('3.00%'), percentage('1.52%')),
    layer: 10,
  })
  .addItem('head', 'squaredOval', {
    position: fromHeadOffset(percentage('0.00%'), percentage('6.28%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'open', {
    position: fromHeadOffset(percentage('12.68%'), percentage('39.74%')),
    layer: 20,
  })
  .addItem('mouth', 'lips', {
    position: fromHeadOffset(percentage('12.68%'), percentage('42.26%')),
    layer: 20,
  })
  .addItem('mouth', 'smiling', {
    position: fromHeadOffset(percentage('12.68%'), percentage('41.63%')),
    layer: 20,
  })
  .addItem('mouth', 'nervous', {
    position: fromHeadOffset(percentage('12.68%'), percentage('41.58%')),
    layer: 20,
  })
  .addItem('mouth', 'hooky', {
    position: fromHeadOffset(percentage('12.68%'), percentage('41.49%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'standard', {
    position: fromHeadOffset(percentage('14.00%'), percentage('28.80%')),
    layer: 21,
  })
  .addItem('nose', 'metal', {
    position: fromHeadOffset(percentage('14.00%'), percentage('28.60%')),
    layer: 21,
  })
  .addItem('nose', 'wide1', {
    position: fromHeadOffset(percentage('14.00%'), percentage('29.29%')),
    layer: 21,
  })
  .addItem('nose', 'clothespin', {
    position: fromHeadOffset(percentage('14.00%'), percentage('29.51%')),
    layer: 21,
  })
  .addItem('nose', 'narrow', {
    position: fromHeadOffset(percentage('14.00%'), percentage('27.61%')),
    layer: 21,
  })
  .addItem('nose', 'wide2', {
    position: fromHeadOffset(percentage('14.00%'), percentage('29.11%')),
    layer: 21,
  })
