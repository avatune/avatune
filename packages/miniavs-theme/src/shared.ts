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
  x: size * percentage('0%'),
  y: size * percentage('0%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 64,
    borderRadius: '100%',
  })
  .connectColors('hair', ['faceHair'])
  .mapPrediction('hair', 'short', ['classic1', 'classic2', 'baldness'])
  .mapPrediction('hair', 'medium', ['elvis', 'stylish', 'curly'])
  .mapPrediction('hair', 'long', ['long', 'ponyTail', 'slaughter'])
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('hairColor', 'brown', [HairColors.Brown])
  .mapPrediction('hairColor', 'blond', [HairColors.Red])
  .mapPrediction('hairColor', 'gray', [HairColors.Red])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Yellow])
  .mapPrediction('skinTone', 'light', [SkinTones.White])
  .addColor('background', BackgroundColors.Purple)
  .addColor('background', BackgroundColors.LightBlue)
  .addColor('background', BackgroundColors.Grey)
  .addColor('background', BackgroundColors.Rose)
  .addColor('background', BackgroundColors.Red)
  .addColor('background', BackgroundColors.Purpose)
  .addColor('hair', HairColors.Black)
  .addColor('hair', HairColors.Red)
  .addColor('hair', HairColors.Brown)
  .addColor('head', SkinTones.Dark)
  .addColor('head', SkinTones.Yellow)
  .addColor('head', SkinTones.White)
  .addColor('body', ClothingColors.Orange)
  .addColor('body', ClothingColors.Pink)
  .addColor('body', ClothingColors.Blue)
  .addColor('faceHair', HairColors.Black)
  .addColor('faceHair', HairColors.Brown)
  .addColor('faceHair', HairColors.Red)
  .addColor('faceDetails', AccentColors.BlushPink)
  .addColor('eyes', AccentColors.EyeBlack)
  .addColor('glasses', AccentColors.AccessoryBlack)
  .addColor('mouth', AccentColors.MouthPink)
  .addItem('body', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('body', 'golf', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('faceDetails', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'confident', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'happy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('faceHair', 'freddy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('faceHair', 'horshoe', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('faceHair', 'pencilThin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('faceHair', 'pencilThinBeard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('glasses', 'glasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .addItem('hair', 'baldness', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'classic1', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'classic2', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'curly', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'elvis', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'ponyTail', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'slaughter', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'stylish', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  .addItem('head', 'thin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  .addItem('head', 'wide', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  .addItem('mouth', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'toothless', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
