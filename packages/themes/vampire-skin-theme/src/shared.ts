import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  AccentColors,
  BackgroundColors,
  ClothesColors,
  HairColors,
  SkinTones,
} from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('30.32%'),
  y: size * percentage('20.53%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 560,
    borderRadius: '50%',
  })
  // Predictions
  .mapPrediction('hair', 'short', ['spiky', 'widowsPeak'])
  .mapPrediction('hair', 'medium', ['bobBangs', 'shaggy'])
  .mapPrediction('hair', 'long', ['pigtails', 'longWavy', 'longStraight'])
  .mapPrediction('skinTone', 'dark', [SkinTones.Pale])
  .mapPrediction('skinTone', 'medium', [SkinTones.Pale])
  .mapPrediction('skinTone', 'light', [SkinTones.Pale])
  // Colors
  .addColors('background', [BackgroundColors.Seashell])
  .addColors('accessories', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  .addColors('body', [
    ClothesColors.Color1,
    ClothesColors.Color2,
    ClothesColors.Color3,
    ClothesColors.Color4,
    ClothesColors.Color5,
  ])
  .addColors('eyebrows', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
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
  ])
  .addColors('hats', [
    ClothesColors.Color1,
    ClothesColors.Color2,
    ClothesColors.Color3,
    ClothesColors.Color4,
    ClothesColors.Color5,
  ])
  .addColors('head', [SkinTones.Pale, SkinTones.Umber])
  .addColors('mouth', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  .addColors('nose', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  // Accessories
  .addItem('accessories', 'horns', {
    position: fromHeadOffset(percentage('5.07%'), -percentage('13.62%')),
    layer: 50,
  })
  .addItem('accessories', 'heartGlasses', {
    position: fromHeadOffset(percentage('3.32%'), percentage('14.13%')),
    layer: 50,
  })
  .addItem('accessories', 'mask', {
    position: fromHeadOffset(percentage('3.00%'), percentage('14.55%')),
    layer: 50,
  })
  .addItem('accessories', 'bats', {
    position: fromHeadOffset(-percentage('16.64%'), percentage('25.33%')),
    layer: 50,
  })
  .addItem('accessories', 'hoopEarring', {
    position: fromHeadOffset(percentage('34.47%'), percentage('25.56%')),
    layer: 50,
  })
  .addItem('accessories', 'monocle', {
    position: fromHeadOffset(percentage('21.18%'), percentage('15.77%')),
    layer: 50,
  })
  .setOptional('accessories')
  // Body
  .addItem('body', 'cloak', {
    position: fromHeadOffset(-percentage('18.32%'), percentage('26.50%')),
    layer: 5,
  })
  .addItem('body', 'ruffleShirt', {
    position: fromHeadOffset(-percentage('14.68%'), percentage('30.86%')),
    layer: 5,
  })
  .addItem('body', 'corset', {
    position: fromHeadOffset(-percentage('11.67%'), percentage('30.99%')),
    layer: 5,
  })
  .addItem('body', 'tailcoat', {
    position: fromHeadOffset(-percentage('12.64%'), percentage('35.88%')),
    layer: 5,
  })
  .addItem('body', 'batCape', {
    position: fromHeadOffset(-percentage('12.68%'), percentage('32.85%')),
    layer: 5,
  })
  .addItem('body', 'bikerJacket', {
    position: fromHeadOffset(-percentage('14.00%'), percentage('34.26%')),
    layer: 5,
  })
  .addItem('body', 'denimVest', {
    position: fromHeadOffset(-percentage('10.50%'), percentage('37.95%')),
    layer: 5,
  })
  // Eyebrows
  .addItem('eyebrows', 'stern', {
    position: fromHeadOffset(percentage('9.00%'), percentage('15.19%')),
    layer: 22,
  })
  .addItem('eyebrows', 'curved', {
    position: fromHeadOffset(percentage('8.68%'), percentage('14.18%')),
    layer: 22,
  })
  .addItem('eyebrows', 'thin', {
    position: fromHeadOffset(percentage('9.82%'), percentage('16.07%')),
    layer: 22,
  })
  .addItem('eyebrows', 'straight', {
    position: fromHeadOffset(percentage('9.00%'), percentage('16.28%')),
    layer: 22,
  })
  // Eyes
  .addItem('eyes', 'closed', {
    position: fromHeadOffset(percentage('9.36%'), percentage('19.31%')),
    layer: 20,
  })
  .addItem('eyes', 'glare', {
    position: fromHeadOffset(percentage('5.82%'), percentage('17.90%')),
    layer: 20,
  })
  .addItem('eyes', 'dot', {
    position: fromHeadOffset(percentage('10.68%'), percentage('20.60%')),
    layer: 20,
  })
  .addItem('eyes', 'wide', {
    position: fromHeadOffset(percentage('10.33%'), percentage('19.14%')),
    layer: 20,
  })
  .addItem('eyes', 'droopy', {
    position: fromHeadOffset(percentage('8.33%'), percentage('19.61%')),
    layer: 20,
  })
  .addItem('eyes', 'happy', {
    position: fromHeadOffset(percentage('10.68%'), percentage('19.53%')),
    layer: 20,
  })
  .addItem('eyes', 'lidded', {
    position: fromHeadOffset(percentage('9.50%'), percentage('20.09%')),
    layer: 20,
  })
  .addItem('eyes', 'arched', {
    position: fromHeadOffset(percentage('9.00%'), percentage('19.04%')),
    layer: 20,
  })
  // Hair
  .addItem('hair', 'longStraight', {
    position: fromHeadOffset(-percentage('2.96%'), -percentage('2.60%')),
    layer: 40,
  })
  .addItem('hair', 'widowsPeak', {
    position: fromHeadOffset(percentage('1.82%'), -percentage('5.32%')),
    layer: 40,
  })
  .addItem('hair', 'bobBangs', {
    position: fromHeadOffset(-percentage('1.49%'), -percentage('4.25%')),
    layer: 40,
  })
  .addItem('hair', 'longWavy', {
    position: fromHeadOffset(-percentage('13.64%'), -percentage('7.86%')),
    layer: 40,
  })
  .addItem('hair', 'shaggy', {
    position: fromHeadOffset(-percentage('9.28%'), -percentage('9.57%')),
    layer: 40,
  })
  .addItem('hair', 'spiky', {
    position: fromHeadOffset(percentage('0.32%'), -percentage('10.04%')),
    layer: 40,
  })
  .addItem('hair', 'slickedBack', {
    position: fromHeadOffset(percentage('9.47%'), -percentage('3.40%')),
    layer: 40,
  })
  .addItem('hair', 'pigtails', {
    position: fromHeadOffset(-percentage('10.64%'), -percentage('6.00%')),
    layer: 40,
  })
  .addItem('hair', 'wavyBob', {
    position: fromHeadOffset(-percentage('6.50%'), -percentage('5.29%')),
    layer: 40,
  })
  // Hats
  .addItem('hats', 'beanie', {
    position: fromHeadOffset(-percentage('1.25%'), -percentage('19.76%')),
    layer: 60,
  })
  .addItem('hats', 'topHat', {
    position: fromHeadOffset(-percentage('0.17%'), -percentage('25.20%')),
    layer: 60,
  })
  .setOptional('hats')
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'fangGrin', {
    position: fromHeadOffset(percentage('9.18%'), percentage('27.49%')),
    layer: 20,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('8.68%'), percentage('30.69%')),
    layer: 20,
  })
  .addItem('mouth', 'flat', {
    position: fromHeadOffset(percentage('13.18%'), percentage('31.62%')),
    layer: 20,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('11.90%'), percentage('28.70%')),
    layer: 20,
  })
  .addItem('mouth', 'hiss', {
    position: fromHeadOffset(percentage('14.86%'), percentage('30.04%')),
    layer: 20,
  })
  .addItem('mouth', 'laugh', {
    position: fromHeadOffset(percentage('9.86%'), percentage('27.72%')),
    layer: 20,
  })
  // Nose
  .addItem('nose', 'wide', {
    position: fromHeadOffset(percentage('18.18%'), percentage('25.34%')),
    layer: 21,
  })
  .addItem('nose', 'nostrils', {
    position: fromHeadOffset(percentage('16.50%'), percentage('24.56%')),
    layer: 21,
  })
