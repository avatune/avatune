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
  x: size * percentage('32%'),
  y: size * percentage('10%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 500,
    borderRadius: '100%',
  })
  .connectColors('head', ['ears', 'neck'])
  .connectColors('forelock', ['hair'])
  .mapPrediction('hair', 'short', ['short', 'underCut'])
  .mapPrediction('hair', 'medium', ['medium', 'straight', 'curve'])
  .mapPrediction('hair', 'long', [
    'straightLong',
    'straightMedium',
    'braids',
    'puff',
  ])
  .mapPrediction('hairColor', 'black', [
    HairColors.JetBlack,
    HairColors.DeepBrown,
  ])
  .mapPrediction('hairColor', 'brown', [
    HairColors.ChestnutBrown,
    HairColors.DeepBrown,
  ])
  .mapPrediction('hairColor', 'blond', [HairColors.GoldenBlond])
  .mapPrediction('hairColor', 'gray', [HairColors.DeepBrown])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Medium])
  .mapPrediction('skinTone', 'light', [
    SkinTones.Light,
    SkinTones.VeryLight,
    SkinTones.Porcelain,
  ])
  .addColor('background', BackgroundColors.PastelPink)
  .addColor('background', BackgroundColors.PastelBlue)
  .addColor('background', BackgroundColors.PastelYellow)
  .addColor('background', BackgroundColors.PastelGreen)
  .addColor('background', BackgroundColors.PastelPurple)
  .addColor('background', BackgroundColors.PastelPeach)
  .addColor('forelock', HairColors.JetBlack)
  .addColor('forelock', HairColors.DeepBrown)
  .addColor('forelock', HairColors.ChestnutBrown)
  .addColor('forelock', HairColors.GoldenBlond)
  .addColor('forelock', HairColors.PastelPink)
  .addColor('forelock', HairColors.PastelBlue)
  .addColor('forelock', HairColors.PastelPurple)
  .addColor('hair', HairColors.JetBlack)
  .addColor('hair', HairColors.DeepBrown)
  .addColor('hair', HairColors.ChestnutBrown)
  .addColor('hair', HairColors.GoldenBlond)
  .addColor('hair', HairColors.PastelPink)
  .addColor('hair', HairColors.PastelBlue)
  .addColor('hair', HairColors.PastelPurple)
  .addColor('head', SkinTones.Dark)
  .addColor('head', SkinTones.Medium)
  .addColor('head', SkinTones.Light)
  .addColor('head', SkinTones.VeryLight)
  .addColor('head', SkinTones.Porcelain)
  .addColor('body', ClothingColors.BrightPink)
  .addColor('body', ClothingColors.SoftPeach)
  .addColor('body', ClothingColors.MintGreen)
  .addColor('body', ClothingColors.SkyBlue)
  .addColor('body', ClothingColors.LavenderPurple)
  .addColor('body', ClothingColors.SunnyYellow)
  .addColor('body', ClothingColors.CoralRed)
  .addColor('ears', SkinTones.Light)
  .addColor('ears', SkinTones.VeryLight)
  .addColor('ears', SkinTones.Porcelain)
  .addColor('neck', SkinTones.Light)
  .addColor('neck', SkinTones.VeryLight)
  .addColor('neck', SkinTones.Porcelain)
  .addColor('eyes', AccentColors.EyeWhite)
  .addColor('eyes', AccentColors.Black)
  .addColor('mouth', AccentColors.LipPink)
  .addColor('mouth', AccentColors.Black)
  .addColor('noses', AccentColors.LipPink)
  .addColor('noses', AccentColors.Black)
  .addColor('faceDetails', AccentColors.BlushPink)
  .addColor('faceHair', HairColors.JetBlack)
  .addColor('faceHair', HairColors.DeepBrown)
  .addColor('faceHair', HairColors.ChestnutBrown)
  .addColor('glasses', ClothingColors.BrightPink)
  .addColor('glasses', ClothingColors.MintGreen)
  .addColor('glasses', ClothingColors.LavenderPurple)
  .addColor('hats', ClothingColors.BrightPink)
  .addColor('hats', ClothingColors.MintGreen)
  .addColor('hats', ClothingColors.LavenderPurple)
  // Glasses
  .addItem('glasses', 'glass', {
    position: fromHeadOffset(percentage('5.3%'), percentage('29%')),
    layer: 50,
  })
  // Hats
  .addItem('hats', 'beanie', {
    position: fromHeadOffset(percentage('4%'), percentage('10%')),
    layer: 60,
  })
  .addItem('hats', 'hat', {
    position: fromHeadOffset(-percentage('0%'), percentage('10%')),
    layer: 60,
  })
  // Hair
  .addItem('hair', 'braids', {
    position: fromHeadOffset(-percentage('11.5%'), percentage('9%')),
    layer: 2,
  })
  .addItem('hair', 'hijab', {
    position: fromHeadOffset(-percentage('4%'), percentage('10%')),
    layer: 40,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('8%'), percentage('12%')),
    layer: 2,
  })
  .addItem('hair', 'puff', {
    position: fromHeadOffset(-percentage('7%'), percentage('5%')),
    layer: 2,
  })
  .addItem('hair', 'straightLong', {
    position: fromHeadOffset(-percentage('2.5%'), percentage('10%')),
    layer: 1,
  })
  .addItem('hair', 'straightMedium', {
    position: fromHeadOffset(-percentage('6%'), percentage('100%')),
    layer: 2,
  })
  // Face Details
  .addItem('faceDetails', 'blushes', {
    position: fromHeadOffset(percentage('6%'), percentage('37%')),
    layer: 25,
  })
  // Body
  .addItem('body', 'blouse', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'flowerCardigan', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'simpleCardigan', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'simpleOverall', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'striped', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'sweaterVest', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'sweaterWavy', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'teeBasic', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'teeButtoned', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'teePocket', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  .addItem('body', 'teeRound', {
    position: fromHeadOffset(-percentage('4.7%'), percentage('49%')),
    layer: 10,
  })
  // Ears
  .addItem('ears', 'standard', {
    position: fromHeadOffset(-percentage('0%'), percentage('30%')),
    layer: 5,
  })
  // Eyes
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('10%'), percentage('33%')),
    layer: 20,
  })
  // Face Hair
  .addItem('faceHair', 'bigBeard', {
    position: fromHeadOffset(percentage('5%'), percentage('35%')),
    layer: 30,
  })
  .addItem('faceHair', 'chevronMustache', {
    position: fromHeadOffset(percentage('11.5%'), percentage('40.5%')),
    layer: 30,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('12.5%'), percentage('40%')),
    layer: 30,
  })
  .addItem('faceHair', 'none', {
    position: { x: '0%', y: '0%' },
    layer: 0,
  })
  // Forelock
  .addItem('forelock', 'bubble', {
    position: fromHeadOffset(percentage('4%'), percentage('13%')),
    layer: 40,
  })
  .addItem('forelock', 'curve', {
    position: fromHeadOffset(percentage('5.5%'), percentage('15%')),
    layer: 40,
  })
  .addItem('forelock', 'short', {
    position: fromHeadOffset(percentage('3%'), percentage('11%')),
    layer: 40,
  })
  .addItem('forelock', 'split', {
    position: fromHeadOffset(percentage('5%'), percentage('15%')),
    layer: 40,
  })
  .addItem('forelock', 'straight', {
    position: fromHeadOffset(percentage('5%'), percentage('13%')),
    layer: 40,
  })
  .addItem('forelock', 'underCut', {
    position: fromHeadOffset(percentage('2.8%'), percentage('10%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('5%'), percentage('15%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('16.5%'), percentage('43%')),
    layer: 22,
  })
  // Neck
  .addItem('neck', 'standard', {
    position: fromHeadOffset(percentage('12%'), percentage('35%')),
    layer: 8,
  })
  // Noses
  .addItem('noses', 'standard', {
    position: fromHeadOffset(percentage('17%'), percentage('35%')),
    layer: 18,
  })
