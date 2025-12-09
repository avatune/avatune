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
  Body = 0,
  Accessories = 32,
  Glasses = 33,
  HeadStroke = 40,
  Mouth = 70,
  Nose = 22,
}

const getHeadPosition = (size: number) => ({
  x: size * percentage('8%'),
  y: size * percentage('3%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 350,
    borderRadius: '100%',
  })
  .connectColors('head', ['ears'])
  .connectColors('hair', ['faceHair', 'eyebrows'])
  .mapPrediction('hair', 'short', [
    'shortCurly',
    'shortFlip',
    'shortMessy',
    'spiky',
    'curlyTop',
    'sidePonytail',
    'sideSweep',
    'tightCurls',
  ])
  .mapPrediction('hair', 'medium', ['lowBun', 'shortWave'])
  .mapPrediction('hair', 'long', [
    'doubleBuns',
    'curlyPuff',
    'longStraight',
    'longWave',
    'longBraid',
    'curvedLong',
    'volumized',
  ])
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('skinTone', 'dark', [SkinTones.Black])
  .mapPrediction('skinTone', 'medium', [SkinTones.Black])
  .mapPrediction('skinTone', 'light', [SkinTones.Black])
  .mapPrediction('facialHair', 'none', ['none'])
  .mapPrediction('facialHair', 'facial_hair', ['beard', 'mustache'])
  .addColors('background', [BackgroundColors.Green])
  .addColors('background', [BackgroundColors.Blue])
  .addColors('background', [BackgroundColors.Yellow])
  .addColors('background', [BackgroundColors.Purple])
  .addColors('background', [BackgroundColors.Pink])
  .addColors('background', [BackgroundColors.Peach])
  .addColors('hair', [HairColors.Black])
  .addColors('head', [SkinTones.Black])
  .addColors('eyes', [AccentColors.Black])
  .addColors('body', [ClothingColors.Black])
  .addColors('ears', [SkinTones.Black])
  .addColors('eyebrows', [HairColors.Black])
  .addColors('mouth', [AccentColors.Black])
  .addColors('faceHair', [HairColors.Black])
  .addColors('accessories', [AccessoriesColors.Black])
  .addColors('glasses', [AccessoriesColors.Black])
  // Accessories
  .addItem('accessories', 'beautyMark', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Accessories,
  })
  .addItem('accessories', 'cap', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Accessories,
  })
  .addItem('accessories', 'earpieceLeft', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: Layer.Accessories,
  })
  .addItem('accessories', 'earringRight', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Accessories,
  })
  .addItem('accessories', 'headsetMic', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Accessories,
  })
  .addItem('accessories', 'mask', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Accessories,
  })
  .setOptional('accessories')
  // Glasses
  .addItem('glasses', 'glassesRound', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Glasses,
  })
  .addItem('glasses', 'glassesSquare', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Glasses,
  })
  .addItem('glasses', 'visorGlasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Glasses,
  })
  .setOptional('glasses')
  // Hair
  .addItem('hair', 'curlyPuff', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'curlyTop', {
    position: fromHeadOffset(-percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'curvedLong', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'doubleBuns', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'longBraid', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'longStraight', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'longWave', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'lowBun', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'shortCurly', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'shortFlip', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'shortMessy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'shortWave', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'sidePonytail', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'sideSweep', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'spiky', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'tightCurls', {
    position: fromHeadOffset(percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'volumized', {
    position: fromHeadOffset(-percentage('0%'), -percentage('0%')),
    layer: Layer.Hair,
  })
  // Body
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'jacket', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'scarfTop', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'shirtTie', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'stripedOverall', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'suit', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  .addItem('body', 'turtleneck', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Body,
  })
  // Eyes
  .addItem('eyes', 'eyesFocused', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyesHappy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyesNeutral', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyesSurprised', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyesWide', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyes,
  })
  // Eyebrows
  .addItem('eyebrows', 'browAngled', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'browFlat', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'browRaised', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'browSoft', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'browThick', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  .addItem('eyebrows', 'browThin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Eyebrows,
  })
  // Face Hair
  .addItem('faceHair', 'beard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.FaceHair,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.FaceHair,
  })
  .setOptional('faceHair')
  // Head
  .addItem('head', 'diamond', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'heart', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'oval', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'pear', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'round', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'square', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'thin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'triangle', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'wide', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  // Mouth
  .addItem('mouth', 'neutralLine', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smileSmall', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smileSoft', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smirkLeft', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smirkRight', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'tinyDot', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Mouth,
  })
  // Nose
  .addItem('nose', 'noseCurve', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
  .addItem('nose', 'noseLong', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
  .addItem('nose', 'nosePointy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
  .addItem('nose', 'noseRound', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
  .addItem('nose', 'noseSmall', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
  .addItem('nose', 'noseSoft', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Nose,
  })
