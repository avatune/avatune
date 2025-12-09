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
  y: size * percentage('15%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 400,
    borderRadius: '100%',
    borderWidth: 2,
    borderColor: AccentColors.Primary,
  })
  .mapPrediction('hair', 'short', [
    'bald',
    'elvis',
    'mediumTopknot',
    'shortTopknot',
    'stylish',
  ])
  .mapPrediction('hair', 'medium', ['medium', 'curly'])
  .mapPrediction('hair', 'long', ['messy', 'beanie'])
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
  .addItem('ears', 'big', {
    position: fromHeadOffset(-percentage('8%'), percentage('30%')),
    layer: Layer.Head,
  })
  .addItem('ears', 'biten', {
    position: fromHeadOffset(-percentage('9%'), percentage('31%')),
    layer: Layer.Head,
  })
  .addItem('ears', 'ringEarring', {
    position: fromHeadOffset(-percentage('8%'), percentage('31%')),
    layer: Layer.Head,
  })
  .addItem('ears', 'small', {
    position: fromHeadOffset(-percentage('8%'), percentage('31%')),
    layer: Layer.Head,
  })
  .addItem('ears', 'standard', {
    position: fromHeadOffset(-percentage('8%'), percentage('31%')),
    layer: Layer.Head,
  })
  .addItem('ears', 'studEarrings', {
    position: fromHeadOffset(-percentage('8%'), percentage('30%')),
    layer: Layer.Head,
  })
  // Eyes
  .addItem('eyes', 'big', {
    position: fromHeadOffset(percentage('10%'), percentage('30%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'happy', {
    position: fromHeadOffset(percentage('10%'), percentage('30%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'small', {
    position: fromHeadOffset(percentage('10%'), percentage('30%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'standard', {
    position: fromHeadOffset(percentage('10%'), percentage('30%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyelashes', {
    position: fromHeadOffset(percentage('8.5%'), percentage('29%')),
    layer: Layer.Eyes,
  })
  .addItem('eyes', 'eyelids', {
    position: fromHeadOffset(percentage('8.5%'), percentage('30%')),
    layer: Layer.Eyes,
  })
  // FaceDetails
  .addItem('faceDetails', 'chinDimple1', {
    position: fromHeadOffset(percentage('1%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple2', {
    position: fromHeadOffset(percentage('1%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple3', {
    position: fromHeadOffset(percentage('1%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .addItem('faceDetails', 'chinDimple4', {
    position: fromHeadOffset(percentage('1%'), percentage('42%')),
    layer: Layer.Eyes,
  })
  .setOptional('faceDetails')
  // Glasses
  .addItem('glasses', 'brow', {
    position: fromHeadOffset(-percentage('1%'), percentage('25%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'patch', {
    position: fromHeadOffset(-percentage('1%'), percentage('26%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'round', {
    position: fromHeadOffset(-percentage('1%'), percentage('27%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'square', {
    position: fromHeadOffset(-percentage('1%'), percentage('27%')),
    layer: Layer.Accessories,
  })
  .addItem('glasses', 'stylish', {
    position: fromHeadOffset(-percentage('1%'), percentage('28%')),
    layer: Layer.Accessories,
  })
  .setOptional('glasses')
  // Hair
  .addItem('hair', 'bald', {
    position: fromHeadOffset(-percentage('5%'), -percentage('10.5%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'curly', {
    position: fromHeadOffset(-percentage('5%'), -percentage('10%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'elvis', {
    position: fromHeadOffset(-percentage('5%'), -percentage('12%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'mediumTopknot', {
    position: fromHeadOffset(-percentage('5%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'messy', {
    position: fromHeadOffset(-percentage('5%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'shortTopknot', {
    position: fromHeadOffset(-percentage('5%'), -percentage('11%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'stylish', {
    position: fromHeadOffset(-percentage('5%'), -percentage('14%')),
    layer: Layer.Hair,
  })
  .addItem('hair', 'beanie', {
    position: fromHeadOffset(-percentage('4%'), -percentage('12%')),
    layer: Layer.Accessories,
  })
  // Head
  .addItem('head', 'beardMustache', {
    position: fromHeadOffset(-percentage('1%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'beardSharp', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'beardSlim', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'beardStandard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'bristle', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'bristleMustache', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'chin', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  .addItem('head', 'sharp', {
    position: fromHeadOffset(percentage('0%'), percentage('2%')),
    layer: Layer.Head,
  })
  .addItem('head', 'standard', {
    position: fromHeadOffset(percentage('0%'), percentage('0%')),
    layer: Layer.Head,
  })
  // Mouth
  .addItem('mouth', 'chin', {
    position: fromHeadOffset(percentage('18%'), percentage('51%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'philtrum1', {
    position: fromHeadOffset(percentage('18%'), percentage('51%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'philtrum2', {
    position: fromHeadOffset(percentage('17.25%'), percentage('51%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'sad', {
    position: fromHeadOffset(percentage('18.5%'), percentage('53%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'small', {
    position: fromHeadOffset(percentage('18.5%'), percentage('53%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'smile', {
    position: fromHeadOffset(percentage('18.25%'), percentage('53%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'tongue1', {
    position: fromHeadOffset(percentage('18.25%'), percentage('51%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'tongue2', {
    position: fromHeadOffset(percentage('18.375%'), percentage('51%')),
    layer: Layer.Mouth,
  })
  .addItem('mouth', 'vampire', {
    position: fromHeadOffset(percentage('17%'), percentage('52%')),
    layer: Layer.Mouth,
  })
  // Nose
  .addItem('nose', 'big', {
    position: fromHeadOffset(percentage('19%'), percentage('33%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'bigWide', {
    position: fromHeadOffset(percentage('19%'), percentage('33%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'small', {
    position: fromHeadOffset(percentage('19%'), percentage('33%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'standard', {
    position: fromHeadOffset(percentage('20%'), percentage('33%')),
    layer: Layer.Mouth,
  })
  .addItem('nose', 'wide', {
    position: fromHeadOffset(percentage('18.5%'), percentage('33%')),
    layer: Layer.Mouth,
  })
