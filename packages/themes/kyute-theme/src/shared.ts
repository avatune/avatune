import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  AccentColors,
  AccessoriesColors,
  BackgroundColors,
  ClothingColors,
  HairColors,
  SkinTones,
} from './colors'

export enum Layer {
  HairBehind = 1,
  Ears = 5,
  Head = 10,
  Hair = 20,
  Eyes = 20,
  Eyebrows = 21,
  FaceDetails = 25,
  FaceHair = 31,
  Body = 30,
  Glasses = 32,
  HeadStroke = 40,
  Mouth = 70,
}

const getHeadPosition = (size: number) => ({
  x: size * percentage('10%'),
  y: size * percentage('3%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 500,
    borderRadius: '100%',
  })
  .connectColors('head', ['ears'])
  .connectColors('hair', ['faceHair', 'eyebrows'])
  .mapPrediction('hair', 'short', ['short', 'curly', 'stylish'])
  .mapPrediction('hair', 'medium', ['curlyMedium', 'elvis'])
  .mapPrediction('hair', 'long', [
    'topKnot',
    'thick',
    'bob',
    'long',
    'longThick',
    'longWavy',
    'ponyTail',
    'rapunzel',
  ])
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('hairColor', 'brown', [HairColors.Brown])
  .mapPrediction('hairColor', 'blond', [HairColors.Blond])
  .mapPrediction('hairColor', 'gray', [HairColors.Straw])
  .mapPrediction('skinTone', 'dark', [
    SkinTones.Olive,
    SkinTones.Brown,
    SkinTones.Black,
  ])
  .mapPrediction('skinTone', 'medium', [
    SkinTones.Peach,
    SkinTones.Beige,
    SkinTones.WarmTan,
    SkinTones.Tan,
    SkinTones.Medium,
  ])
  .mapPrediction('skinTone', 'light', [
    SkinTones.Light,
    SkinTones.Lighter,
    SkinTones.Lightest,
    SkinTones.Fair,
  ])
  .mapPrediction('facialHair', 'none', ['none'])
  .mapPrediction('facialHair', 'facial_hair', [
    'bigBeard',
    'chevronMustache',
    'mustache',
  ])
  .addColors('background', [
    BackgroundColors.Pink,
    BackgroundColors.Blue,
    BackgroundColors.Yellow,
    BackgroundColors.Green,
    BackgroundColors.Purple,
    BackgroundColors.Peach,
  ])
  .addColors('hair', [
    HairColors.Black,
    HairColors.Brown,
    HairColors.Blond,
    HairColors.Straw,
    HairColors.Platinum,
    HairColors.Ginger,
  ])
  .addColors('head', [
    SkinTones.Lightest,
    SkinTones.Lighter,
    SkinTones.Light,
    SkinTones.Fair,
    SkinTones.Peach,
    SkinTones.Beige,
    SkinTones.WarmTan,
    SkinTones.Tan,
    SkinTones.Medium,
    SkinTones.Olive,
    SkinTones.Brown,
    SkinTones.Black,
  ])
  .addColors('eyes', [AccentColors.EyeBlack])
  .addColors('body', [
    ClothingColors.Maroon,
    ClothingColors.Blue,
    ClothingColors.Navy,
    ClothingColors.Green,
  ])
  .addColors('ears', [
    SkinTones.Lightest,
    SkinTones.Lighter,
    SkinTones.Light,
    SkinTones.Fair,
    SkinTones.Peach,
    SkinTones.Beige,
    SkinTones.WarmTan,
    SkinTones.Tan,
    SkinTones.Medium,
    SkinTones.Olive,
    SkinTones.Brown,
    SkinTones.Black,
  ])
  .addColors('eyebrows', [HairColors.Black])
  .addColors('mouth', [SkinTones.Black])
  .addColors('faceDetails', [AccentColors.BlushPink])
  .addColors('faceHair', [HairColors.Black])
  .addColors('glasses', [
    AccessoriesColors.Pink,
    AccessoriesColors.Blue,
    AccessoriesColors.Yellow,
    AccessoriesColors.Green,
    AccessoriesColors.Purple,
  ])
  // Glasses
  .addItem('glasses', 'aviator', {
    position: fromHeadOffset(percentage('11%'), percentage('39%')),
    layer: Layer.Glasses,
  })
  .addItem('glasses', 'harry', {
    position: fromHeadOffset(percentage('11.5%'), percentage('39%')),
    layer: Layer.Glasses,
  })
  .addItem('glasses', 'round', {
    position: fromHeadOffset(percentage('11%'), percentage('38%')),
    layer: Layer.Glasses,
  })
  .addItem('glasses', 'standard', {
    position: fromHeadOffset(percentage('11.5%'), percentage('39%')),
    layer: Layer.Glasses,
  })
  .setOptional('glasses')
  // Hair
  .addItem('hair', 'bob', {
    position: fromHeadOffset(-percentage('0%'), percentage('6%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'curly', {
    position: fromHeadOffset(percentage('9.5%'), -percentage('2%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'curlyMedium', {
    position: fromHeadOffset(-percentage('3.5%'), -percentage('3.5%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'elvis', {
    position: fromHeadOffset(percentage('9%'), -percentage('1%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(percentage('8%'), percentage('9%')),
    layer: Layer.HairBehind,
  })
  .addItem('hair', 'longThick', {
    position: fromHeadOffset(-percentage('1%'), percentage('0.0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'longWavy', {
    position: fromHeadOffset(-percentage('9%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'ponyTail', {
    position: fromHeadOffset(percentage('9%'), percentage('3%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'rapunzel', {
    position: fromHeadOffset(-percentage('7.5%'), percentage('2%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(percentage('13%'), percentage('8%')),
    layer: Layer.Head,
  })
  .addItem('hair', 'stylish', {
    position: fromHeadOffset(percentage('10%'), -percentage('2%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'thick', {
    position: fromHeadOffset(percentage('3%'), percentage('4.5%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'topKnot', {
    position: fromHeadOffset(percentage('5.5%'), -percentage('12%')),
    layer: Layer.Hair,
  })
  // Face Details
  .addItem('faceDetails', 'blushes', {
    position: fromHeadOffset(percentage('19.5%'), percentage('51.5%')),
    layer: Layer.FaceDetails,
  })
  .addItem('faceDetails', 'freckles', {
    position: fromHeadOffset(percentage('19.5%'), percentage('55%')),
    layer: Layer.FaceDetails,
  })
  .setOptional('faceDetails')
  // Body
  .addItem('body', 'casual', {
    position: fromHeadOffset(percentage('5%'), percentage('67.5%')),
    layer: Layer.Body,
  })
  .addItem('body', 'shirt', {
    position: fromHeadOffset(percentage('4.5%'), percentage('68%')),
    layer: Layer.Body,
  })
  .addItem('body', 'tshirt', {
    position: fromHeadOffset(percentage('5%'), percentage('66%')),
    layer: Layer.Body,
  })
  .addItem('body', 'turtleneck', {
    position: fromHeadOffset(percentage('5%'), percentage('68%')),
    layer: Layer.Body,
  })
  // Ears
  .addItem('ears', 'standard', {
    position: fromHeadOffset(percentage('8.75%'), percentage('44%')),
    layer: Layer.Ears,
  })
  // Eyes
  .addItem('eyes', 'big', {
    position: fromHeadOffset(percentage('19%'), percentage('46%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'huge', {
    position: fromHeadOffset(percentage('18%'), percentage('45%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'medium', {
    position: fromHeadOffset(percentage('19.5%'), percentage('46%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'oval', {
    position: fromHeadOffset(percentage('19%'), percentage('46%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('19%'), percentage('46%')),
    layer: Layer.Eyes,
  })
  // Eyebrows
  .addItem('eyebrows', 'thick1', {
    position: fromHeadOffset(percentage('15%'), percentage('41%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'thick2', {
    position: fromHeadOffset(percentage('15.5%'), percentage('41%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'thickSad', {
    position: fromHeadOffset(percentage('14%'), percentage('39%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'thin', {
    position: fromHeadOffset(percentage('17%'), percentage('41%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'thinCurly', {
    position: fromHeadOffset(percentage('16%'), percentage('41%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'thinWide', {
    position: fromHeadOffset(percentage('17%'), percentage('41%')),
    layer: Layer.Eyebrows,
  })
  // Face Hair
  .addItem('faceHair', 'beard', {
    position: fromHeadOffset(percentage('11%'), percentage('50%')),
    layer: Layer.FaceHair,
  })
  .addItem('faceHair', 'bigBeard', {
    position: fromHeadOffset(percentage('10%'), percentage('50%')),
    layer: Layer.FaceHair,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('25%'), percentage('55%')),
    layer: Layer.FaceHair,
  })
  .setOptional('faceHair')
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('5%'), percentage('15%')),
    layer: Layer.Head,
  })
  // Mouth
  .addItem('mouth', 'lips1', {
    position: fromHeadOffset(percentage('30.5%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'lips2', {
    position: fromHeadOffset(percentage('30.5%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'lipsSmile', {
    position: fromHeadOffset(percentage('30.5%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'open', {
    position: fromHeadOffset(percentage('30.5%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'openDimples', {
    position: fromHeadOffset(percentage('27%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smile1', {
    position: fromHeadOffset(percentage('30.5%'), percentage('61%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smile2', {
    position: fromHeadOffset(percentage('30%'), percentage('61%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smileOpen', {
    position: fromHeadOffset(percentage('27%'), percentage('59%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('33%'), percentage('61%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'wideOpen', {
    position: fromHeadOffset(percentage('28.5%'), percentage('59%')),
    layer: Layer.Mouth,
  })
