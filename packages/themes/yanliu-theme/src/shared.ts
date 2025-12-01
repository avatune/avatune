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
  x: size * percentage('25%'),
  y: size * percentage('5%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 360,
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
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('hairColor', 'brown', [HairColors.Black])
  .mapPrediction('hairColor', 'blond', [HairColors.Black])
  .mapPrediction('hairColor', 'gray', [HairColors.Black])
  .mapPrediction('skinTone', 'dark', [SkinTones.Black])
  .mapPrediction('skinTone', 'medium', [SkinTones.Black])
  .mapPrediction('skinTone', 'light', [SkinTones.Black])
  .addColors('background', [
    BackgroundColors.PastelPink,
    BackgroundColors.PastelBlue,
    BackgroundColors.PastelYellow,
    BackgroundColors.PastelGreen,
    BackgroundColors.PastelPurple,
    BackgroundColors.PastelPeach,
  ])
  .addColors('forelock', [HairColors.Black])
  .addColors('hair', [HairColors.Black])
  .addColors('head', [SkinTones.Black])
  .addColors('body', [ClothingColors.Black])
  .addColors('ears', [SkinTones.Black])
  .addColors('neck', [SkinTones.Black])
  .addColors('eyes', [SkinTones.Black])
  .addColors('mouth', [SkinTones.Black])
  .addColors('noses', [SkinTones.Black])
  .addColors('faceDetails', [AccentColors.BlushPink])
  .addColors('faceHair', [HairColors.Black])
  .addColors('glasses', [ClothingColors.Black])
  .addColors('hats', [ClothingColors.Black])
  // Glasses
  .addItem('glasses', 'glass', {
    position: fromHeadOffset(percentage('5.89%'), percentage('32.22%')),
    layer: 50,
  })
  .setOptional('glasses')
  // Hats
  .addItem('hats', 'beanie', {
    position: fromHeadOffset(percentage('4.44%'), percentage('5%')),
    layer: 60,
  })
  .addItem('hats', 'hat', {
    position: fromHeadOffset(-percentage('1%'), percentage('4%')),
    layer: 60,
  })
  .setOptional('hats')
  // Hair
  .addItem('hair', 'braids', {
    position: fromHeadOffset(-percentage('17%'), percentage('10%')),
    layer: 2,
  })
  .addItem('hair', 'hijab', {
    position: fromHeadOffset(-percentage('7%'), percentage('10%')),
    layer: 40,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('12%'), percentage('13.33%')),
    layer: 2,
  })
  .addItem('hair', 'puff', {
    position: fromHeadOffset(-percentage('9%'), percentage('5.56%')),
    layer: 2,
  })
  .addItem('hair', 'straightLong', {
    position: fromHeadOffset(-percentage('4%'), percentage('11.11%')),
    layer: 1,
  })
  .addItem('hair', 'straightMedium', {
    position: fromHeadOffset(percentage('1%'), percentage('11.11%')),
    layer: 2,
  })
  // Face Details
  .addItem('faceDetails', 'blushes', {
    position: fromHeadOffset(percentage('6.67%'), percentage('41.11%')),
    layer: 25,
  })
  .setOptional('faceDetails')
  // Body
  .addItem('body', 'blouse', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'flowerCardigan', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'simpleCardigan', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'simpleOverall', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'striped', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'sweaterVest', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'sweaterWavy', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'teeBasic', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'teeButtoned', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'teePocket', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  .addItem('body', 'teeRound', {
    position: fromHeadOffset(-percentage('8%'), percentage('65%')),
    layer: 10,
  })
  // Ears
  .addItem('ears', 'standard', {
    position: fromHeadOffset(-percentage('0%'), percentage('35%')),
    layer: 5,
  })
  // Eyes
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('12%'), percentage('38%')),
    layer: 20,
  })
  // Face Hair
  .addItem('faceHair', 'bigBeard', {
    position: fromHeadOffset(percentage('5.56%'), percentage('40.56%')),
    layer: 30,
  })
  .addItem('faceHair', 'chevronMustache', {
    position: fromHeadOffset(percentage('14%'), percentage('48.5%')),
    layer: 30,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('16%'), percentage('49%')),
    layer: 30,
  })
  .setOptional('faceHair')
  // Forelock
  .addItem('forelock', 'bubble', {
    position: fromHeadOffset(percentage('4.44%'), percentage('14.44%')),
    layer: 40,
  })
  .addItem('forelock', 'curve', {
    position: fromHeadOffset(percentage('6.11%'), percentage('16.67%')),
    layer: 40,
  })
  .addItem('forelock', 'short', {
    position: fromHeadOffset(percentage('3.33%'), percentage('12.22%')),
    layer: 40,
  })
  .addItem('forelock', 'split', {
    position: fromHeadOffset(percentage('5.56%'), percentage('16.67%')),
    layer: 40,
  })
  .addItem('forelock', 'straight', {
    position: fromHeadOffset(percentage('5.56%'), percentage('14.44%')),
    layer: 40,
  })
  .addItem('forelock', 'underCut', {
    position: fromHeadOffset(percentage('3.11%'), percentage('11.11%')),
    layer: 40,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('5.56%'), percentage('16.67%')),
    layer: 10,
  })
  // Mouth
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('21%'), percentage('52%')),
    layer: 22,
  })
  // Neck
  .addItem('neck', 'standard', {
    position: fromHeadOffset(percentage('15%'), percentage('38.89%')),
    layer: 8,
  })
  // Noses
  .addItem('noses', 'standard', {
    position: fromHeadOffset(percentage('22%'), percentage('42%')),
    layer: 22,
  })
