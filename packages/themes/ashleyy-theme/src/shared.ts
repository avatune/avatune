import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import { AccentColors, BackgroundColors, SkinTones } from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('19.00%'),
  y: size * percentage('24.00%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 400,
    borderRadius: '100%',
  })
  // Colors
  .addColors('accessories', [AccentColors.Canary])
  .addColors('body', [
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    SkinTones.Bleu,
    SkinTones.Salmon,
    SkinTones.Sun,
  ])
  .addColors('eyes', [AccentColors.Black])
  .addColors('glasses', [AccentColors.Black])
  .addColors('hair', [AccentColors.Black])
  .addColors('head', [
    SkinTones.Light,
    SkinTones.Medium,
    SkinTones.Dark,
    SkinTones.Bleu,
    SkinTones.Salmon,
    SkinTones.Sun,
  ])
  .addColors('mouth', [AccentColors.Black])
  .addColors('nose', [AccentColors.Black])
  .addColors('hair', [
    AccentColors.Canary,
    AccentColors.Granetta,
    AccentColors.Salmon,
    AccentColors.Sky,
  ])
  .addColors('background', [
    BackgroundColors.BleuLight,
    BackgroundColors.GreenTeaLight,
    BackgroundColors.SalmonLight,
    BackgroundColors.White,
  ])
  .mapPrediction('hair', 'short', ['shortCurly', 'short'])
  .mapPrediction('hair', 'medium', ['mediumStraigh'])
  .mapPrediction('hair', 'long', ['longWavy', 'ponyTail'])
  .mapPrediction('hairColor', 'black', [AccentColors.Black])
  .mapPrediction('hairColor', 'brown', [AccentColors.Black])
  .mapPrediction('hairColor', 'blond', [SkinTones.Sun])
  .mapPrediction('hairColor', 'gray', [BackgroundColors.White])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Medium])
  .mapPrediction('skinTone', 'light', [SkinTones.Light])
  .setOptional('glasses')
  .setOptional('accessories')
  // Accessories
  .addItem('accessories', 'earrings', {
    position: fromHeadOffset(percentage('15.00%'), percentage('14.60%')),
    layer: 41,
  })
  .addItem('accessories', 'mask', {
    position: fromHeadOffset(percentage('13.80%'), percentage('14.60%')),
    layer: 41,
  })
  // Body
  .addItem('body', 'buttonShirt', {
    position: fromHeadOffset(-percentage('0.40%'), percentage('43.00%')),
    layer: 10,
  })
  .addItem('body', 'doubleCollarShirt', {
    position: fromHeadOffset(percentage('0.2%'), percentage('43.00%')),
    layer: 10,
  })
  .addItem('body', 'knitSweater', {
    position: fromHeadOffset(percentage('0.17%'), percentage('41.5%')),
    layer: 10,
  })
  .addItem('body', 'peterPanCollarShirt', {
    position: fromHeadOffset(percentage('0.2%'), percentage('44%')),
    layer: 10,
  })
  .addItem('body', 'polkaDotShirt', {
    position: fromHeadOffset(-percentage('0.5%'), percentage('42%')),
    layer: 10,
  })
  .addItem('body', 'tieShirt', {
    position: fromHeadOffset(percentage('0%'), percentage('42%')),
    layer: 10,
  })
  .addItem('body', 'turtleneckShirt', {
    position: fromHeadOffset(-percentage('0.3%'), percentage('41%')),
    layer: 10,
  })
  // Eyes
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('32.40%'), percentage('17.60%')),
    layer: 20,
  })
  // Glasses
  .addItem('glasses', 'glasses', {
    position: fromHeadOffset(percentage('13.80%'), percentage('14.40%')),
    layer: 35,
  })
  // Hair
  .addItem('hair', 'afro', {
    position: fromHeadOffset(percentage('7.40%'), -percentage('6.80%')),
    layer: 15,
  })
  .addItem('hair', 'curlyBun', {
    position: fromHeadOffset(-percentage('2.80%'), -percentage('7.60%')),
    layer: 15,
  })
  .addItem('hair', 'longWavy', {
    position: fromHeadOffset(percentage('2.00%'), -percentage('5.20%')),
    layer: 15,
  })
  .addItem('hair', 'mediumStraigh', {
    position: fromHeadOffset(percentage('10.3%'), -percentage('5.40%')),
    layer: 15,
  })
  .addItem('hair', 'ponyTail', {
    position: fromHeadOffset(percentage('3.00%'), -percentage('5.60%')),
    layer: 15,
  })
  .addItem('hair', 'shortCurly', {
    position: fromHeadOffset(percentage('10%'), -percentage('6.80%')),
    layer: 15,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(percentage('12.80%'), -percentage('2.20%')),
    layer: 15,
  })
  .addItem('hair', 'sideSwept', {
    position: fromHeadOffset(percentage('10.60%'), -percentage('5.80%')),
    layer: 15,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  // Mouth
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('34.60%'), percentage('31.40%')),
    layer: 32,
  })
  .addItem('mouth', 'standard', {
    position: fromHeadOffset(percentage('38.40%'), percentage('31.00%')),
    layer: 32,
  })
  // Nose
  .addItem('nose', 'standard', {
    position: fromHeadOffset(percentage('29.20%'), percentage('12.20%')),
    layer: 21,
  })
