import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  BackgroundColors,
  BodyColors,
  DefaultColors,
  EyesColors,
  HairColors,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('27.12%'),
  y: size * percentage('11.67%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 560,
    borderRadius: '50%',
  })
  // Colors
  .addColors('background', [
    BackgroundColors.Pink,
    BackgroundColors.Blue,
    BackgroundColors.Brown,
  ])
  .addColors('body', [BodyColors.Sea, BodyColors.Green, BodyColors.Purple])
  .addColors('eyebrows', [DefaultColors.Default])
  .addColors('eyes', [EyesColors.Brown, EyesColors.Blue, EyesColors.Green])
  .addColors('hair', [
    HairColors.Dark,
    HairColors.Blonde,
    HairColors.Ginger,
    HairColors.Brown,
  ])
  .addColors('head', [DefaultColors.Default])
  .addColors('mouth', [DefaultColors.Default])
  .addColors('nose', [DefaultColors.Default])
  // Body
  .addItem('body', 'pasted1', {
    position: fromHeadOffset(-percentage('8.65%'), percentage('50.68%')),
    layer: 15,
  })
  .addItem('body', 'pasted2', {
    position: fromHeadOffset(-percentage('10.30%'), percentage('48.09%')),
    layer: 15,
  })
  .addItem('body', 'pasted3', {
    position: fromHeadOffset(-percentage('9.40%'), percentage('46.46%')),
    layer: 5,
  })
  .addItem('body', 'pasted4', {
    position: fromHeadOffset(-percentage('9.94%'), percentage('48.96%')),
    layer: 15,
  })
  .addItem('body', 'pasted5', {
    position: fromHeadOffset(-percentage('10.66%'), percentage('52.15%')),
    layer: 5,
  })
  .addItem('body', 'pasted6', {
    position: fromHeadOffset(-percentage('9.59%'), percentage('47.97%')),
    layer: 5,
  })
  // Eyebrows
  .addItem('eyebrows', 'pasted1', {
    position: fromHeadOffset(percentage('9.70%'), percentage('15.09%')),
    layer: 22,
  })
  .addItem('eyebrows', 'pasted2', {
    position: fromHeadOffset(percentage('10.52%'), percentage('15.92%')),
    layer: 22,
  })
  .addItem('eyebrows', 'pasted3', {
    position: fromHeadOffset(percentage('9.70%'), percentage('14.24%')),
    layer: 22,
  })
  .addItem('eyebrows', 'pasted4', {
    position: fromHeadOffset(percentage('10.70%'), percentage('16.43%')),
    layer: 22,
  })
  .addItem('eyebrows', 'pasted5', {
    position: fromHeadOffset(percentage('11.02%'), percentage('13.17%')),
    layer: 22,
  })
  // Eyes
  .addItem('eyes', 'pasted1', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.15%')),
    layer: 20,
  })
  .addItem('eyes', 'pasted2', {
    position: fromHeadOffset(percentage('9.21%'), percentage('21.13%')),
    layer: 20,
  })
  .addItem('eyes', 'pasted3', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.66%')),
    layer: 20,
  })
  .addItem('eyes', 'pasted4', {
    position: fromHeadOffset(percentage('9.21%'), percentage('19.10%')),
    layer: 20,
  })
  .addItem('eyes', 'pasted5', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.76%')),
    layer: 20,
  })
  // Hair
  .addItem('hair', 'pasted2', {
    position: fromHeadOffset(-percentage('13.43%'), -percentage('11.80%')),
    layer: 40,
  })
  .addItem('hair', 'pasted3', {
    position: fromHeadOffset(-percentage('10.44%'), -percentage('7.40%')),
    layer: 40,
  })
  .addItem('hair', 'pasted4', {
    position: fromHeadOffset(-percentage('6.94%'), -percentage('8.48%')),
    layer: 40,
  })
  .addItem('hair', 'pasted5', {
    position: fromHeadOffset(-percentage('15.80%'), -percentage('7.38%')),
    layer: 40,
  })
  .addItem('hair', 'pasted6', {
    position: fromHeadOffset(-percentage('7.30%'), -percentage('6.31%')),
    layer: 40,
  })
  .addItem('hair', 'pasted7', {
    position: fromHeadOffset(-percentage('0.22%'), -percentage('7.68%')),
    layer: 40,
  })
  .addItem('hair', 'pasted8', {
    position: fromHeadOffset(-percentage('1.83%'), -percentage('11.11%')),
    layer: 40,
  })
  .addItem('hair', 'pasted9', {
    position: fromHeadOffset(percentage('1.52%'), -percentage('8.03%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'pasted2', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'pasted1', {
    position: fromHeadOffset(percentage('14.88%'), percentage('36.40%')),
    layer: 20,
  })
  .addItem('mouth', 'pasted2', {
    position: fromHeadOffset(percentage('14.88%'), percentage('38.40%')),
    layer: 20,
  })
  .addItem('mouth', 'pasted3', {
    position: fromHeadOffset(percentage('14.88%'), percentage('34.57%')),
    layer: 20,
  })
  .addItem('mouth', 'pasted4', {
    position: fromHeadOffset(percentage('16.88%'), percentage('38.28%')),
    layer: 20,
  })
  .addItem('mouth', 'pasted5', {
    position: fromHeadOffset(percentage('16.88%'), percentage('39.97%')),
    layer: 20,
  })
  .addItem('mouth', 'pasted6', {
    position: fromHeadOffset(percentage('17.38%'), percentage('39.00%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'pasted1', {
    position: fromHeadOffset(percentage('20.56%'), percentage('27.69%')),
    layer: 21,
  })
