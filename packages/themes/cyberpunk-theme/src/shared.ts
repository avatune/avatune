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
  x: size * percentage('32.50%'),
  y: size * percentage('19.02%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 560,
    borderRadius: '50%',
  })
  // Colors
  .addColors('background', [BackgroundColors.Seashell])
  .addColors('body', [DefaultColors.Default])
  .addColors('eyes', [DefaultColors.Default])
  .addColors('hair', [HairColors.DarkBlue, HairColors.Pink, HairColors.Green])
  .addColors('head', [
    SkinTones.Light,
    SkinTones.Medium,
    SkinTones.Dark,
    SkinTones.VeryLight,
  ])
  .addColors('mouth', [DefaultColors.Default])
  .addColors('nose', [DefaultColors.Default])
  // Body
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(-percentage('20.90%'), percentage('43.22%')),
    layer: 5,
  })
  .addItem('body', 'poncho1', {
    position: fromHeadOffset(-percentage('21.94%'), percentage('45.49%')),
    layer: 5,
  })
  .addItem('body', 'jacket1', {
    position: fromHeadOffset(-percentage('20.40%'), percentage('43.18%')),
    layer: 5,
  })
  .addItem('body', 'jacket2', {
    position: fromHeadOffset(-percentage('20.40%'), percentage('46.59%')),
    layer: 5,
  })
  .addItem('body', 'jacket3', {
    position: fromHeadOffset(-percentage('20.40%'), percentage('45.28%')),
    layer: 5,
  })
  .addItem('body', 'poncho', {
    position: fromHeadOffset(-percentage('23.40%'), percentage('44.21%')),
    layer: 5,
  })
  .addItem('body', 'jacket4', {
    position: fromHeadOffset(-percentage('21.40%'), percentage('45.76%')),
    layer: 5,
  })
  // Eyes
  .addItem('eyes', 'brave', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.47%')),
    layer: 40,
  })
  .addItem('eyes', 'sharp', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.57%')),
    layer: 40,
  })
  .addItem('eyes', 'round', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.78%')),
    layer: 40,
  })
  .addItem('eyes', 'husky', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.80%')),
    layer: 40,
  })
  .addItem('eyes', 'focused', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.69%')),
    layer: 40,
  })
  .addItem('eyes', 'curious', {
    position: fromHeadOffset(percentage('3.72%'), percentage('14.82%')),
    layer: 40,
  })
  .addItem('eyes', 'anxious', {
    position: fromHeadOffset(percentage('3.72%'), percentage('13.99%')),
    layer: 40,
  })
  // Hair
  .addItem('hair', 'short', {
    position: fromHeadOffset(-percentage('6.54%'), -percentage('11.22%')),
    layer: 40,
  })
  .addItem('hair', 'stylish', {
    position: fromHeadOffset(-percentage('4.33%'), -percentage('18.14%')),
    layer: 40,
  })
  .addItem('hair', 'bob', {
    position: fromHeadOffset(-percentage('12.68%'), -percentage('14.19%')),
    layer: 40,
  })
  .addItem('hair', 'braids', {
    position: fromHeadOffset(-percentage('13.71%'), -percentage('11.40%')),
    layer: 40,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('12.78%'), -percentage('10.66%')),
    layer: 40,
  })
  .addItem('hair', 'forehead', {
    position: fromHeadOffset(-percentage('11.10%'), -percentage('9.24%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'oval', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('head', 'robot', {
    position: fromHeadOffset(-percentage('0.89%'), percentage('5.67%')),
    layer: 10,
  })
  .addItem('head', 'rhombus', {
    position: fromHeadOffset(-percentage('2.97%'), percentage('1.34%')),
    layer: 10,
  })
  .addItem('head', 'squaredOval', {
    position: fromHeadOffset(percentage('0.03%'), percentage('6.10%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'open', {
    position: fromHeadOffset(percentage('12.71%'), percentage('39.56%')),
    layer: 20,
  })
  .addItem('mouth', 'lips', {
    position: fromHeadOffset(percentage('12.71%'), percentage('42.08%')),
    layer: 20,
  })
  .addItem('mouth', 'smiling', {
    position: fromHeadOffset(percentage('12.71%'), percentage('41.45%')),
    layer: 20,
  })
  .addItem('mouth', 'nervous', {
    position: fromHeadOffset(percentage('12.71%'), percentage('41.40%')),
    layer: 20,
  })
  .addItem('mouth', 'hooky', {
    position: fromHeadOffset(percentage('12.71%'), percentage('41.31%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'standard', {
    position: fromHeadOffset(percentage('14.03%'), percentage('28.62%')),
    layer: 21,
  })
  .addItem('nose', 'metal', {
    position: fromHeadOffset(percentage('14.03%'), percentage('28.42%')),
    layer: 21,
  })
  .addItem('nose', 'wide1', {
    position: fromHeadOffset(percentage('14.03%'), percentage('29.11%')),
    layer: 21,
  })
  .addItem('nose', 'clothespin', {
    position: fromHeadOffset(percentage('14.03%'), percentage('29.33%')),
    layer: 21,
  })
  .addItem('nose', 'narrow', {
    position: fromHeadOffset(percentage('14.03%'), percentage('27.43%')),
    layer: 21,
  })
  .addItem('nose', 'wide2', {
    position: fromHeadOffset(percentage('14.03%'), percentage('28.93%')),
    layer: 21,
  })
