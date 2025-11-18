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
  .connectColors('forelock', ['hair', 'faceHair'])
  .mapPrediction('hair', 'short', ['short', 'underCut'])
  .mapPrediction('hair', 'medium', ['medium', 'straight', 'curve'])
  .mapPrediction('hair', 'long', [
    'straightLong',
    'straightMedium',
    'braids',
    'puff',
  ])
  .mapPrediction('hairColor', 'black', [
    HairColors.EmeraldGreen,
    HairColors.LavenderPurple,
    HairColors.ShockingPink,
    HairColors.RoseRed,
    HairColors.GoldenBlond,
  ])
  .mapPrediction('hairColor', 'brown', [HairColors.EmeraldGreen])
  .mapPrediction('hairColor', 'blond', [HairColors.GoldenBlond])
  .mapPrediction('hairColor', 'gray', [HairColors.LavenderPurple])
  .mapPrediction('skinTone', 'dark', [SkinTones.Black])
  .mapPrediction('skinTone', 'medium', [SkinTones.Black])
  .mapPrediction('skinTone', 'light', [SkinTones.Black])
  .addColor('background', BackgroundColors.PastelPink)
  .addColor('background', BackgroundColors.PastelBlue)
  .addColor('background', BackgroundColors.PastelYellow)
  .addColor('background', BackgroundColors.PastelGreen)
  .addColor('background', BackgroundColors.PastelPurple)
  .addColor('background', BackgroundColors.PastelPeach)
  .addColor('forelock', HairColors.EmeraldGreen)
  .addColor('forelock', HairColors.LavenderPurple)
  .addColor('forelock', HairColors.ShockingPink)
  .addColor('forelock', HairColors.RoseRed)
  .addColor('forelock', HairColors.GoldenBlond)
  .addColor('hair', HairColors.EmeraldGreen)
  .addColor('hair', HairColors.LavenderPurple)
  .addColor('hair', HairColors.ShockingPink)
  .addColor('hair', HairColors.RoseRed)
  .addColor('hair', HairColors.GoldenBlond)
  .addColor('head', SkinTones.Black)
  .addColor('body', ClothingColors.Black)
  .addColor('body', ClothingColors.MajorelleBlue)
  .addColor('body', ClothingColors.GoldenPollen)
  .addColor('body', ClothingColors.Ametist)
  .addColor('ears', SkinTones.Black)
  .addColor('neck', SkinTones.Black)
  .addColor('eyes', SkinTones.Black)
  .addColor('mouth', SkinTones.Black)
  .addColor('noses', SkinTones.Black)
  .addColor('faceDetails', SkinTones.Black)
  .addColor('faceHair', HairColors.EmeraldGreen)
  .addColor('faceHair', HairColors.LavenderPurple)
  .addColor('faceHair', HairColors.ShockingPink)
  .addColor('faceHair', HairColors.RoseRed)
  .addColor('faceHair', HairColors.GoldenBlond)
  .addColor('glasses', ClothingColors.Black)
  .addColor('hats', ClothingColors.Black)
  .addColor('hats', ClothingColors.MajorelleBlue)
  .addColor('hats', ClothingColors.GoldenPollen)
  .addColor('hats', ClothingColors.Ametist)
  .addColor('faceDetails', AccentColors.BlushPink)
  // Glasses
  .addItem('glasses', 'glass', {
    position: fromHeadOffset(percentage('5.3%'), percentage('29%')),
    layer: 50,
  })
  // Hats
  .addItem('hats', 'beanie', {
    position: fromHeadOffset(percentage('4%'), percentage('6%')),
    layer: 60,
  })
  .addItem('hats', 'hat', {
    position: fromHeadOffset(-percentage('0%'), percentage('6%')),
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
    position: fromHeadOffset(percentage('5%'), percentage('38%')),
    layer: 21,
  })
  .addItem('faceHair', 'chevronMustache', {
    position: fromHeadOffset(percentage('11.5%'), percentage('40.5%')),
    layer: 30,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('12.5%'), percentage('40%')),
    layer: 30,
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
    layer: 22,
  })
