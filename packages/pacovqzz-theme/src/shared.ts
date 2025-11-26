import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import {
  BackgroundColors,
  ClothingColors,
  HairColors,
  HeadColors,
} from './colors'

const WIDTH = 260

const getHeadPosition = (size: number) => ({
  x: size * percentage('-12%'),
  y: size * percentage('0%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: WIDTH,
    borderRadius: '100%',
  })
  .mapPrediction('hair', 'short', ['short', 'mohawk'])
  .mapPrediction('hair', 'medium', [
    'medium',
    'mediumCap',
    'curly',
    'curlyBandana',
  ])
  .mapPrediction('hair', 'long', ['long', 'longBeanie'])
  .mapPrediction('hairColor', 'black', [HairColors.Blue])
  .mapPrediction('hairColor', 'brown', [HairColors.Beige])
  .mapPrediction('hairColor', 'blond', [HairColors.Gold])
  .mapPrediction('hairColor', 'gray', [HairColors.Green])
  .mapPrediction('skinTone', 'dark', [HeadColors.Dark, HeadColors.Tan])
  .mapPrediction('skinTone', 'medium', [HeadColors.Medium])
  .mapPrediction('skinTone', 'light', [
    HeadColors.Light1,
    HeadColors.Light2,
    HeadColors.Blue,
  ])
  .addColors('hair', [
    HairColors.Green,
    HairColors.Gold,
    HairColors.Blue,
    HairColors.Beige,
  ])
  .addColors('head', [
    HeadColors.Light1,
    HeadColors.Light2,
    HeadColors.Medium,
    HeadColors.Tan,
    HeadColors.Dark,
    HeadColors.Blue,
  ])
  .addColors('background', [
    BackgroundColors.Pink,
    BackgroundColors.Yellow,
    BackgroundColors.Blue,
    BackgroundColors.Orange,
  ])
  .addColors('body', [
    ClothingColors.DarkGreen,
    ClothingColors.DarkBlue,
    ClothingColors.Tan,
    ClothingColors.Charcoal,
  ])
  .addColors('eyes', ['#000000'])
  .addColors('mouth', ['#000000'])
  // Body
  .addItem('body', 'hoodie', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 0,
  })
  .addItem('body', 'overall', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('body', 'overshirt1', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('body', 'overshirt2', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('body', 'pufferJacket', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 0,
  })
  .addItem('body', 'tshirt1', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  .addItem('body', 'tshirt2', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 10,
  })
  // Eyes
  .addItem('eyes', 'apathetic', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'glasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'heartSunglasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'matrixSunglasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'opened', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'roundSunglasses', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 20,
  })
  // Hair
  .addItem('hair', 'curly', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'curlyBandana', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'longBeanie', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'mediumCap', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'mohawk', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  .addItem('hair', 'short', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 5,
  })
  // Head
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 1,
  })
  // Mouth
  .addItem('mouth', 'apathetic', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'beard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'bristle1', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'bristle2', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'confused', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'happy', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'meh', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
  .addItem('mouth', 'mustache', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: 15,
  })
