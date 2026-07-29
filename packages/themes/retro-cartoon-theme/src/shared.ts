import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  BackgroundColors,
  BodyColors,
  DefaultColors2,
  EyesColors,
  HairColors,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('27.12%'),
  y: size * percentage('15.67%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 560,
    borderRadius: '50%',
  })
  // Predictions
  .mapPrediction('hair', 'long', ['longCurly', 'longWavy', 'longStraight'])
  .mapPrediction('hair', 'medium', ['bob', 'curlyBob'])
  .mapPrediction('hair', 'short', ['afro', 'sideSwept', 'buzzCut'])
  .mapPrediction('hairColor', 'blond', [HairColors.Blonde])
  .mapPrediction('hairColor', 'brown', [HairColors.Brown])
  .mapPrediction('hairColor', 'black', [HairColors.Dark])
  .mapPrediction('hairColor', 'gray', [HairColors.Blonde])
  // Colors
  .addColors('background', [
    BackgroundColors.Pink,
    BackgroundColors.Blue,
    BackgroundColors.Brown,
  ])
  .addColors('body', [BodyColors.Sea, BodyColors.Green, BodyColors.Purple])
  .addColors('eyebrows', [DefaultColors2.Default])
  .addColors('eyes', [EyesColors.Brown, EyesColors.Blue, EyesColors.Green])
  .addColors('hair', [
    HairColors.Dark,
    HairColors.Blonde,
    HairColors.Ginger,
    HairColors.Brown,
  ])
  .addColors('head', [DefaultColors2.Default])
  .addColors('mouth', [DefaultColors2.Default])
  .addColors('nose', [DefaultColors2.Default])
  // Body
  .addItem('body', 'crewneckSweater', {
    position: fromHeadOffset(-percentage('8.65%'), percentage('50.68%')),
    layer: 15,
  })
  .addItem('body', 'collaredShirt', {
    position: fromHeadOffset(-percentage('10.30%'), percentage('48.09%')),
    layer: 15,
  })
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(-percentage('9.40%'), percentage('46.47%')),
    layer: 5,
  })
  .addItem('body', 'turtleneckSweater', {
    position: fromHeadOffset(-percentage('9.94%'), percentage('48.96%')),
    layer: 15,
  })
  .addItem('body', 'blazer', {
    position: fromHeadOffset(-percentage('10.66%'), percentage('52.16%')),
    layer: 5,
  })
  .addItem('body', 'vNeckSweater', {
    position: fromHeadOffset(-percentage('9.59%'), percentage('47.97%')),
    layer: 5,
  })
  // Eyebrows
  .addItem('eyebrows', 'soft', {
    position: fromHeadOffset(percentage('9.70%'), percentage('15.10%')),
    layer: 22,
  })
  .addItem('eyebrows', 'thick', {
    position: fromHeadOffset(percentage('10.52%'), percentage('15.93%')),
    layer: 22,
  })
  .addItem('eyebrows', 'angled', {
    position: fromHeadOffset(percentage('9.70%'), percentage('14.24%')),
    layer: 22,
  })
  .addItem('eyebrows', 'flat', {
    position: fromHeadOffset(percentage('10.70%'), percentage('16.44%')),
    layer: 22,
  })
  .addItem('eyebrows', 'raised', {
    position: fromHeadOffset(percentage('11.02%'), percentage('13.18%')),
    layer: 22,
  })
  // Eyes
  .addItem('eyes', 'neutral', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.15%')),
    layer: 20,
  })
  .addItem('eyes', 'happy', {
    position: fromHeadOffset(percentage('9.21%'), percentage('21.13%')),
    layer: 20,
  })
  .addItem('eyes', 'winking', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.66%')),
    layer: 20,
  })
  .addItem('eyes', 'surprised', {
    position: fromHeadOffset(percentage('9.21%'), percentage('19.10%')),
    layer: 20,
  })
  .addItem('eyes', 'sleepy', {
    position: fromHeadOffset(percentage('9.21%'), percentage('20.77%')),
    layer: 20,
  })
  // Hair
  .addItem('hair', 'curlyBob', {
    position: fromHeadOffset(-percentage('13.43%'), -percentage('11.80%')),
    layer: 40,
  })
  .addItem('hair', 'longWavy', {
    position: fromHeadOffset(-percentage('10.44%'), -percentage('7.40%')),
    layer: 40,
  })
  .addItem('hair', 'longStraight', {
    position: fromHeadOffset(-percentage('6.94%'), -percentage('8.48%')),
    layer: 40,
  })
  .addItem('hair', 'longCurly', {
    position: fromHeadOffset(-percentage('15.80%'), -percentage('7.38%')),
    layer: 40,
  })
  .addItem('hair', 'bob', {
    position: fromHeadOffset(-percentage('7.30%'), -percentage('6.30%')),
    layer: 40,
  })
  .addItem('hair', 'sideSwept', {
    position: fromHeadOffset(-percentage('0.22%'), -percentage('7.68%')),
    layer: 40,
  })
  .addItem('hair', 'afro', {
    position: fromHeadOffset(-percentage('1.83%'), -percentage('11.11%')),
    layer: 40,
  })
  .addItem('hair', 'buzzCut', {
    position: fromHeadOffset(percentage('1.52%'), -percentage('8.03%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'teethSmile', {
    position: fromHeadOffset(percentage('14.88%'), percentage('36.40%')),
    layer: 20,
  })
  .addItem('mouth', 'lips', {
    position: fromHeadOffset(percentage('14.88%'), percentage('38.41%')),
    layer: 20,
  })
  .addItem('mouth', 'openedSmile', {
    position: fromHeadOffset(percentage('14.88%'), percentage('34.58%')),
    layer: 20,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('16.88%'), percentage('38.28%')),
    layer: 20,
  })
  .addItem('mouth', 'neutral', {
    position: fromHeadOffset(percentage('16.88%'), percentage('39.97%')),
    layer: 20,
  })
  .addItem('mouth', 'sad', {
    position: fromHeadOffset(percentage('17.38%'), percentage('39.00%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'curve', {
    position: fromHeadOffset(percentage('20.56%'), percentage('27.69%')),
    layer: 21,
  })
