import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import { AccentColors, BackgroundColors, SkinTones } from './colors'

const getHeadPosition = (size: number) => ({
  x: size * percentage('27%'),
  y: size * percentage('20%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 400,
    borderRadius: '100%',
  })
  .connectColors('hair', ['faceHair'])
  .connectColors('head', ['ears'])
  .mapPrediction('hair', 'short', ['dougFunny', 'mrT', 'fonze'])
  .mapPrediction('hair', 'medium', ['fonze'])
  .mapPrediction('hair', 'long', ['full', 'dannyPhantom'])
  .mapPrediction('hairColor', 'black', [AccentColors.Black])
  .mapPrediction('hairColor', 'brown', [AccentColors.Black])
  .mapPrediction('hairColor', 'blond', [AccentColors.Canary])
  .mapPrediction('hairColor', 'gray', [AccentColors.White])
  .mapPrediction('skinTone', 'dark', [SkinTones.Topaz])
  .mapPrediction('skinTone', 'medium', [SkinTones.Cost])
  .mapPrediction('skinTone', 'light', [SkinTones.Apricot])
  .addColors('background', [BackgroundColors.Seashell])
  .addColors('hair', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  .addColors('head', [SkinTones.Topaz, SkinTones.Cost, SkinTones.Apricot])
  .addColors('faceHair', [
    AccentColors.Black,
    AccentColors.White,
    AccentColors.Lavender,
    AccentColors.Sky,
    AccentColors.Salmon,
    AccentColors.Canary,
  ])
  .addColors('eyes', [AccentColors.Black])
  .addColors('eyebrows', [AccentColors.Black])
  .addColors('glasses', [AccentColors.Black])
  .addColors('mouth', [AccentColors.Black])
  .addColors('noses', [AccentColors.Black])
  .addColors('ears', [SkinTones.Topaz, SkinTones.Cost, SkinTones.Apricot])
  .addColors('accessories', [AccentColors.Canary])
  .addColors('body', [AccentColors.Lavender])
  .addColors('body', [AccentColors.Sky])
  .addColors('body', [AccentColors.Salmon])
  .addColors('body', [AccentColors.Canary])
  // Accessories
  .addItem('accessories', 'studEarRing', {
    position: fromHeadOffset(-percentage('1%'), percentage('42%')),
    layer: 41,
  })
  .addItem('accessories', 'hoopEarRing', {
    position: fromHeadOffset(-percentage('0.5%'), percentage('42%')),
    layer: 41,
  })
  .setOptional('accessories')
  // Body
  .addItem('body', 'collaredShirt', {
    position: fromHeadOffset(-percentage('11%'), percentage('58%')),
    layer: 10,
  })
  .addItem('body', 'crewShirt', {
    position: fromHeadOffset(-percentage('11%'), percentage('58%')),
    layer: 10,
  })
  .addItem('body', 'openShirt', {
    position: fromHeadOffset(-percentage('11%'), percentage('58%')),
    layer: 10,
  })
  // Ears
  .addItem('ears', 'medium', {
    position: fromHeadOffset(percentage('0%'), percentage('33%')),
    layer: 40,
  })
  .addItem('ears', 'small', {
    position: fromHeadOffset(percentage('1%'), percentage('34%')),
    layer: 40,
  })
  // Eyebrows
  .addItem('eyebrows', 'down', {
    position: fromHeadOffset(percentage('7%'), percentage('20%')),
    layer: 25,
  })
  .addItem('eyebrows', 'eyelashesDown', {
    position: fromHeadOffset(percentage('7%'), percentage('20%')),
    layer: 25,
  })
  .addItem('eyebrows', 'eyelashesUp', {
    position: fromHeadOffset(percentage('7%'), percentage('20%')),
    layer: 25,
  })
  .addItem('eyebrows', 'up', {
    position: fromHeadOffset(percentage('6%'), percentage('20%')),
    layer: 25,
  })
  // Eyes
  .addItem('eyes', 'eyeshadow', {
    position: fromHeadOffset(percentage('14%'), percentage('25%')),
    layer: 20,
  })
  .addItem('eyes', 'round', {
    position: fromHeadOffset(percentage('14%'), percentage('25%')),
    layer: 20,
  })
  .addItem('eyes', 'smiling', {
    position: fromHeadOffset(percentage('15%'), percentage('25%')),
    layer: 20,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('14%'), percentage('25%')),
    layer: 20,
  })
  // Face Hair
  .addItem('faceHair', 'beard', {
    position: fromHeadOffset(percentage('10%'), percentage('27%')),
    layer: 30,
  })
  .addItem('faceHair', 'scruff', {
    position: fromHeadOffset(percentage('7%'), percentage('25%')),
    layer: 30,
  })
  .setOptional('faceHair')
  // Glasses
  .addItem('glasses', 'round', {
    position: fromHeadOffset(percentage('5%'), percentage('22%')),
    layer: 35,
  })
  .addItem('glasses', 'square', {
    position: fromHeadOffset(percentage('3%'), percentage('20%')),
    layer: 35,
  })
  .setOptional('glasses')
  // Hair
  .addItem('hair', 'dannyPhantom', {
    position: fromHeadOffset(-percentage('8.5%'), -percentage('3%')),
    layer: 15,
  })
  .addItem('hair', 'dougFunny', {
    position: fromHeadOffset(-percentage('5%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'fonze', {
    position: fromHeadOffset(-percentage('8.5%'), -percentage('5%')),
    layer: 15,
  })
  .addItem('hair', 'full', {
    position: fromHeadOffset(-percentage('14%'), -percentage('3%')),
    layer: 15,
  })
  .addItem('hair', 'mrT', {
    position: fromHeadOffset(-percentage('7.5%'), -percentage('4%')),
    layer: 15,
  })
  .addItem('hair', 'pixie', {
    position: fromHeadOffset(-percentage('12%'), -percentage('2%')),
    layer: 15,
  })
  .addItem('hair', 'turban', {
    position: fromHeadOffset(-percentage('7%'), -percentage('4%')),
    layer: 15,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  // Mouth
  .addItem('mouth', 'frown', {
    position: fromHeadOffset(percentage('18%'), percentage('42%')),
    layer: 32,
  })
  .addItem('mouth', 'laughing', {
    position: fromHeadOffset(percentage('19%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'nervous', {
    position: fromHeadOffset(percentage('18%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'pucker', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'sad', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 32,
  })
  .addItem('mouth', 'surprised', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 32,
  })
  // Noses
  .addItem('noses', 'curve', {
    position: fromHeadOffset(percentage('23%'), percentage('32%')),
    layer: 21,
  })
  .addItem('noses', 'pointed', {
    position: fromHeadOffset(percentage('23%'), percentage('32%')),
    layer: 21,
  })
  .addItem('noses', 'round', {
    position: fromHeadOffset(percentage('23%'), percentage('32%')),
    layer: 21,
  })
