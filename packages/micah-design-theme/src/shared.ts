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
  .mapPrediction('hair', 'short', ['pixie', 'mrT'])
  .mapPrediction('hair', 'medium', ['dannyPhantom', 'dougFunny', 'fonze'])
  .mapPrediction('hair', 'long', ['full', 'turban'])
  .mapPrediction('hairColor', 'black', [HairColors.Black])
  .mapPrediction('hairColor', 'brown', [HairColors.Brown])
  .mapPrediction('hairColor', 'blond', [HairColors.Blonde])
  .mapPrediction('hairColor', 'gray', [HairColors.Gray])
  .mapPrediction('skinTone', 'dark', [SkinTones.Dark])
  .mapPrediction('skinTone', 'medium', [SkinTones.Medium])
  .mapPrediction('skinTone', 'light', [SkinTones.Light])
  .addColor('background', BackgroundColors.SkyBlue)
  .addColor('background', BackgroundColors.MintGreen)
  .addColor('background', BackgroundColors.LightPink)
  .addColor('background', BackgroundColors.Lavender)
  .addColor('background', BackgroundColors.Peach)
  .addColor('background', BackgroundColors.LightGray)
  .addColor('hair', HairColors.Black)
  .addColor('hair', HairColors.Brown)
  .addColor('hair', HairColors.Blonde)
  .addColor('hair', HairColors.Red)
  .addColor('hair', HairColors.Gray)
  .addColor('head', SkinTones.Light)
  .addColor('head', SkinTones.Medium)
  .addColor('head', SkinTones.Dark)
  .addColor('body', ClothingColors.White)
  .addColor('body', ClothingColors.Blue)
  .addColor('body', ClothingColors.Green)
  .addColor('body', ClothingColors.Red)
  .addColor('body', ClothingColors.Yellow)
  .addColor('body', ClothingColors.Purple)
  .addColor('faceHair', HairColors.Black)
  .addColor('faceHair', HairColors.Brown)
  .addColor('faceHair', HairColors.Blonde)
  .addColor('faceHair', HairColors.Red)
  .addColor('faceHair', HairColors.Gray)
  .addColor('eyes', AccentColors.EyeColor)
  .addColor('eyebrows', AccentColors.EyeColor)
  .addColor('glasses', AccentColors.EyeColor)
  .addColor('mouth', AccentColors.MouthColor)
  .addColor('noses', AccentColors.MouthColor)
  .addColor('ears', SkinTones.Light)
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
    position: fromHeadOffset(percentage('11%'), percentage('58%')),
    layer: 10,
  })
  // Ears
  .addItem('ears', 'medium', {
    position: fromHeadOffset(-percentage('2%'), percentage('30%')),
    layer: 40,
  })
  .addItem('ears', 'small', {
    position: fromHeadOffset(-percentage('2%'), percentage('30%')),
    layer: 40,
  })
  // Eyebrows
  .addItem('eyebrows', 'down', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  .addItem('eyebrows', 'eyelashesDown', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  .addItem('eyebrows', 'eyelashesUp', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  .addItem('eyebrows', 'up', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 25,
  })
  // Eyes
  .addItem('eyes', 'eyeshadow', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'round', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'smiling', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  // Face Hair
  .addItem('faceHair', 'beard', {
    position: fromHeadOffset(percentage('7%'), percentage('25%')),
    layer: 30,
  })
  .addItem('faceHair', 'scruff', {
    position: fromHeadOffset(percentage('7%'), percentage('25%')),
    layer: 30,
  })
  .setOptional('faceHair')
  // Glasses
  .addItem('glasses', 'round', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .addItem('glasses', 'square', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 35,
  })
  .setOptional('glasses')
  // Hair
  .addItem('hair', 'dannyPhantom', {
    position: fromHeadOffset(-percentage('8.5%'), -percentage('3%')),
    layer: 15,
  })
  .addItem('hair', 'dougFunny', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'fonze', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'full', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'mrT', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'pixie', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('hair', 'turban', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  // Mouth
  .addItem('mouth', 'frown', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 22,
  })
  .addItem('mouth', 'laughing', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 22,
  })
  .addItem('mouth', 'nervous', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 22,
  })
  .addItem('mouth', 'pucker', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 22,
  })
  .addItem('mouth', 'sad', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 22,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 22,
  })
  .addItem('mouth', 'smirk', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 22,
  })
  .addItem('mouth', 'surprised', {
    position: fromHeadOffset(percentage('20%'), percentage('40%')),
    layer: 22,
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
