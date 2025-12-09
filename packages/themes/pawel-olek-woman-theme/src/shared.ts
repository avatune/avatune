import { createTheme, fromHead } from '@avatune/theme-builder'
import type { BaseAvatarItem } from '@avatune/types'
import { percentage } from '@avatune/utils'
import { AccentColors, BackgroundColors, HairColors, SkinTones } from './colors'

export enum Layer {
  Background = 0,
  Head = 10,
  Body = 20,
  Hair = 30,
  Eyes = 40,
  Eyebrows = 41,
  Mouth = 50,
  Accessories = 60,
}

const getHeadPosition = (size: number) => ({
  x: size * percentage('26%'),
  y: size * percentage('18%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 400,
    borderRadius: '100%',
    borderWidth: 2,
    borderColor: AccentColors.Primary,
  })
  .mapPrediction('hair', 'short', ['bob'])
  .mapPrediction('hair', 'medium', ['medium'])
  .mapPrediction('hair', 'long', ['long', 'lowBun', 'stickBun'])
  .addColors('background', [BackgroundColors.Default])
  .addColors('ears', [SkinTones.Light, SkinTones.Dark])
  .addColors('eyes', [AccentColors.Primary])
  .addColors('faceDetails', [AccentColors.Primary])
  .addColors('glasses', [AccentColors.Primary])
  .addColors('hair', [HairColors.Black])
  .addColors('head', [SkinTones.Light, SkinTones.Dark])
  .addColors('mouth', [AccentColors.Primary])
  .addColors('nose', [AccentColors.Primary])
  // Ears
  .addItem('ears', 'dropEarrings', {
    position: fromHeadOffset(-percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  .addItem('ears', 'sharp', {
    position: fromHeadOffset(-percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  .addItem('ears', 'standard', {
    position: fromHeadOffset(-percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  // Eyes
  .addItem('eyes', 'big', {
    position: fromHeadOffset(percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'happy', {
    position: fromHeadOffset(percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'small', {
    position: fromHeadOffset(percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('9%'), percentage('27%')),
    layer: Layer.Eyes,
  })
  // FaceDetails
  .addItem('faceDetails', 'chinDimple1', {
    position: fromHeadOffset(percentage('0%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple2', {
    position: fromHeadOffset(percentage('0%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple3', {
    position: fromHeadOffset(percentage('0%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple4', {
    position: fromHeadOffset(percentage('0%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  // Glasses
  .addItem('glasses', 'patch', {
    position: fromHeadOffset(percentage('0%'), percentage('25%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'round', {
    position: fromHeadOffset(-percentage('1.25%'), percentage('25%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'square', {
    position: fromHeadOffset(-percentage('1.25%'), percentage('25%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'stylish', {
    position: fromHeadOffset(-percentage('1.25%'), percentage('25%')),
    layer: Layer.Accessories,
  })
  // Hair
  .addItem('hair', 'bob', {
    position: fromHeadOffset(-percentage('6%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'long', {
    position: fromHeadOffset(-percentage('10%'), -percentage('14%')),
    layer: Layer.Eyes,
  })
  .addItem('hair', 'lowBun', {
    position: fromHeadOffset(-percentage('6%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'medium', {
    position: fromHeadOffset(-percentage('10%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'stickBun', {
    position: fromHeadOffset(-percentage('6%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'hijab', {
    position: fromHeadOffset(-percentage('3%'), -percentage('7%')),
    layer: Layer.Accessories,
  })
  // Head
  .addItem('head', 'chin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  // Mouth
  .addItem('mouth', 'chin', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'philtrum1', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'philtrum2', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'sad', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'small', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'tongue1', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'tongue2', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'vampire', {
    position: fromHeadOffset(percentage('17.5%'), percentage('49%')),
    layer: Layer.Mouth,
  })
  // Nose
  .addItem('nose', 'big', {
    position: fromHeadOffset(percentage('20%'), percentage('31%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'small', {
    position: fromHeadOffset(percentage('20%'), percentage('31%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'standard', {
    position: fromHeadOffset(percentage('20%'), percentage('31%')),
    layer: Layer.Mouth,
  })
