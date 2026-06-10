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
  x: size * percentage('0%'),
  y: size * percentage('0%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

const atHead = (layer: number) => ({
  position: fromHeadOffset(percentage('0%'), percentage('0%')),
  layer,
})

export default createTheme<BaseAvatarItem>()
  .withStyle({
    size: 64,
    borderRadius: '100%',
  })
  .connectColors('hair', ['faceHair'])
  .mapPrediction('hair', 'short', ['shaved', 'topknot'])
  .mapPrediction('hair', 'medium', ['chonmage', 'bun'])
  .mapPrediction('hair', 'long', ['ronin', 'warriorTail'])
  .mapPrediction('hairColor', 'black', [
    HairColors.SumiBlack,
    HairColors.IndigoBlack,
  ])
  .mapPrediction('hairColor', 'brown', [HairColors.Umber, HairColors.Chestnut])
  .mapPrediction('hairColor', 'blond', [HairColors.Wheat])
  .mapPrediction('hairColor', 'gray', [HairColors.Silver])
  .mapPrediction('skinTone', 'dark', [SkinTones.Umber])
  .mapPrediction('skinTone', 'medium', [SkinTones.Amber, SkinTones.Bronze])
  .mapPrediction('skinTone', 'light', [SkinTones.Washi, SkinTones.Sand])
  .mapPrediction('faceHair', 'none', ['none'])
  .mapPrediction('faceHair', 'facial_hair', ['mustache', 'beard'])
  .addColors('background', [
    BackgroundColors.Washi,
    BackgroundColors.Vermilion,
    BackgroundColors.IndigoNight,
    BackgroundColors.Sumi,
    BackgroundColors.Pine,
  ])
  .addColors('head', [
    SkinTones.Washi,
    SkinTones.Sand,
    SkinTones.Amber,
    SkinTones.Bronze,
    SkinTones.Umber,
  ])
  .addColors('hair', [
    HairColors.SumiBlack,
    HairColors.IndigoBlack,
    HairColors.Umber,
    HairColors.Chestnut,
    HairColors.Wheat,
    HairColors.Silver,
  ])
  .addColors('body', [
    ClothingColors.Indigo,
    ClothingColors.Charcoal,
    ClothingColors.Crimson,
    ClothingColors.Pine,
  ])
  .addColors('faceHair', [
    HairColors.SumiBlack,
    HairColors.Chestnut,
    HairColors.Silver,
  ])
  .addColors('eyes', [
    AccentColors.EyeSumi,
    AccentColors.EyeBrown,
    AccentColors.EyeSteel,
  ])
  .addColors('mouth', [AccentColors.MouthRose, AccentColors.MouthVermilion])
  .addColors('faceDetails', [
    AccentColors.DetailCrimson,
    AccentColors.DetailIndigo,
  ])
  .addColors('accessories', [
    AccentColors.MaskOniCrimson,
    AccentColors.MaskLacquerBlack,
    AccentColors.MaskIndigo,
  ])
  .addColors('hats', [
    AccentColors.HatStraw,
    AccentColors.HatIron,
    AccentColors.HatLacquerRed,
  ])
  // Head
  .addItem('head', 'standard', atHead(1))
  .addItem('head', 'broad', atHead(1))
  // Hair
  .addItem('hair', 'topknot', atHead(5))
  .addItem('hair', 'chonmage', atHead(5))
  .addItem('hair', 'bun', atHead(5))
  .addItem('hair', 'ronin', atHead(5))
  .addItem('hair', 'warriorTail', atHead(5))
  .addItem('hair', 'shaved', atHead(5))
  // Body
  .addItem('body', 'kimono', atHead(10))
  .addItem('body', 'katana', atHead(10))
  .addItem('body', 'armor', atHead(10))
  // Mouth
  .addItem('mouth', 'stern', atHead(15))
  .addItem('mouth', 'grim', atHead(15))
  .addItem('mouth', 'shout', atHead(15))
  // Eyes
  .addItem('eyes', 'stern', atHead(20))
  .addItem('eyes', 'fierce', atHead(20))
  .addItem('eyes', 'calm', atHead(20))
  .addItem('eyes', 'focused', atHead(20))
  // Face Details
  .addItem('faceDetails', 'scar', atHead(25))
  .addItem('faceDetails', 'warpaint', atHead(25))
  .setOptional('faceDetails')
  // Face Hair
  .addItem('faceHair', 'mustache', atHead(30))
  .addItem('faceHair', 'beard', atHead(30))
  .setOptional('faceHair')
  // Accessories (oni half-masks)
  .addItem('accessories', 'oniMask', atHead(38))
  .addItem('accessories', 'menpo', atHead(38))
  .setOptional('accessories')
  // Hats
  .addItem('hats', 'kasa', atHead(40))
  .addItem('hats', 'kabuto', atHead(40))
  .setOptional('hats')
