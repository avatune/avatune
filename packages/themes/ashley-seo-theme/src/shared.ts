import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import { AccentColors, BackgroundColors, HairColors, SkinTones } from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('12%'),
  y: size * percentage('12%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 700,
    borderRadius: '100%',
  })
  .connectColors('hair', ['faceHair'])
  .mapPrediction('hair', 'short', [
    'bowlCutHair',
    'shortHair',
    'curlyShortHair',
    'mohawk',
    'shavedHead',
  ])
  .mapPrediction('hair', 'medium', ['dreads', 'straightHair'])
  .mapPrediction('hair', 'long', [
    'wavyBob',
    'bangs',
    'braids',
    'bunHair',
    'curlyBob',
    'froBun',
  ])
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('hairColor', 'brown', [HairColors.Brown])
  .mapPrediction('hairColor', 'blond', [HairColors.Red])
  .mapPrediction('hairColor', 'gray', [HairColors.Red])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Yellow])
  .mapPrediction('skinTone', 'light', [SkinTones.White])
  .mapPrediction('facialHair', 'none', ['none'])
  .mapPrediction('facialHair', 'facial_hair', [
    'beard',
    'chinHair',
    'fuzz',
    'mustache',
  ])
  .addColors('background', [
    BackgroundColors.Purple,
    BackgroundColors.LightBlue,
    BackgroundColors.Grey,
    BackgroundColors.Rose,
    BackgroundColors.Red,
    BackgroundColors.Purpose,
  ])
  .addColors('hair', [
    HairColors.Black,
    HairColors.Red,
    HairColors.Brown,
    HairColors.Main,
    HairColors.Secondary,
    HairColors.Secondary2,
    HairColors.Teal,
    HairColors.DarkGray,
    HairColors.Purple,
  ])
  .addColors('head', [
    SkinTones.Dark,
    SkinTones.Yellow,
    SkinTones.White,
    SkinTones.Main,
  ])
  .addColors('faceHair', [
    HairColors.Black,
    HairColors.Brown,
    HairColors.Red,
    HairColors.Main,
    HairColors.Secondary,
    HairColors.Secondary2,
  ])
  .addColors('eyes', [
    AccentColors.EyeBlack,
    AccentColors.EyeMain,
    AccentColors.EyeDetail,
  ])
  .addColors('accessories', [AccentColors.AccessoryBlack])
  .addColors('mouth', [AccentColors.MouthPink, AccentColors.MouthMain])
  // Accessories
  .addItem('accessories', 'catEars', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 40,
  })
  .addItem('accessories', 'clownNose', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .addItem('accessories', 'faceMask', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('accessories', 'glasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .addItem('accessories', 'mustache', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('accessories', 'sailormoonCrown', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('accessories', 'sleepMask', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  .addItem('accessories', 'sunglasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .setOptional('accessories')
  // Eyes
  .addItem('eyes', 'angry', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'cherry', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'confused', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'normal', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'sad', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'sleepy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'starstruck', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'winking', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  // Face Hair
  .addItem('faceHair', 'beard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('faceHair', 'chinHair', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .addItem('faceHair', 'fuzz', {
    position: fromHeadOffset(-percentage('0.3%'), -percentage('1%')),
    layer: 1,
  })
  .addItem('faceHair', 'mustache', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 30,
  })
  .setOptional('faceHair')
  // Hair
  .addItem('hair', 'bangs', {
    position: fromHeadOffset(percentage('0%'), -percentage('1.5%')),
    layer: 5,
  })
  .addItem('hair', 'bowlCutHair', {
    position: fromHeadOffset(-percentage('1%'), -percentage('1.4%')),
    layer: 5,
  })
  .addItem('hair', 'braids', {
    position: fromHeadOffset(percentage('0%'), -percentage('1.6%')),
    layer: 5,
  })
  .addItem('hair', 'bunHair', {
    position: fromHeadOffset(-percentage('0.5%'), -percentage('0.7%')),
    layer: 5,
  })
  .addItem('hair', 'curlyBob', {
    position: fromHeadOffset(-percentage('3%'), -percentage('1.3%')),
    layer: 5,
  })
  .addItem('hair', 'curlyShortHair', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'dreads', {
    position: fromHeadOffset(-percentage('0.3%'), -percentage('1.8%')),
    layer: 5,
  })
  .addItem('hair', 'froBun', {
    position: fromHeadOffset(-percentage('0.2%'), -percentage('7.1%')),
    layer: 5,
  })
  .addItem('hair', 'halfShavedHead', {
    position: fromHeadOffset(-percentage('0.1%'), -percentage('1.6%')),
    layer: 5,
  })
  .addItem('hair', 'hijab', {
    position: fromHeadOffset(percentage('0.5%'), -percentage('2%')),
    layer: 5,
  })
  .addItem('hair', 'mohawk', {
    position: fromHeadOffset(-percentage('0.3%'), -percentage('1.5%')),
    layer: 5,
  })
  .addItem('hair', 'shavedHead', {
    position: fromHeadOffset(percentage('0%'), -percentage('1.5%')),
    layer: 5,
  })
  .addItem('hair', 'shortHair', {
    position: fromHeadOffset(-percentage('0.5%'), -percentage('1.5%')),
    layer: 5,
  })
  .addItem('hair', 'straightHair', {
    position: fromHeadOffset(-percentage('0.3%'), -percentage('1.5%')),
    layer: 5,
  })
  .addItem('hair', 'wavyBob', {
    position: fromHeadOffset(-percentage('0.2%'), -percentage('1.5%')),
    layer: 5,
  })
  // Head
  .addItem('head', 'standart', {
    position: fromHeadOffset(-percentage('0%'), percentage('0%')),
    layer: 1,
  })
  // Mouth
  .addItem('mouth', 'awkwardSmile', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'braces', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'gapSmile', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'kawaii', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'openedSmile', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'openSad', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'teethSmile', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'unimpressed', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
