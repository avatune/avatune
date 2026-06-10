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
  .mapPrediction('hair', 'short', ['buzz', 'shaved', 'spikes', 'slicked'])
  .mapPrediction('hair', 'medium', ['mohawk', 'undercut'])
  .mapPrediction('hair', 'long', ['bob', 'ponytail'])
  .mapPrediction('hairColor', 'black', [HairColors.JetBlack])
  .mapPrediction('hairColor', 'brown', [HairColors.UltraViolet])
  .mapPrediction('hairColor', 'blond', [HairColors.AcidGreen])
  .mapPrediction('hairColor', 'gray', [HairColors.IceWhite])
  .mapPrediction('skinTone', 'dark', [SkinTones.Deep])
  .mapPrediction('skinTone', 'medium', [SkinTones.Warm, SkinTones.Bronze])
  .mapPrediction('skinTone', 'light', [SkinTones.Pale])
  .mapPrediction('faceHair', 'none', ['none'])
  .mapPrediction('faceHair', 'facial_hair', ['stubble', 'goatee'])
  .addColors('background', [
    BackgroundColors.NightPurple,
    BackgroundColors.DeepBlue,
    BackgroundColors.Charcoal,
    BackgroundColors.Synthwave,
    BackgroundColors.Violet,
  ])
  .addColors('head', [
    SkinTones.Pale,
    SkinTones.Warm,
    SkinTones.Bronze,
    SkinTones.Deep,
    SkinTones.Synthetic,
  ])
  .addColors('hair', [
    HairColors.NeonPink,
    HairColors.Cyan,
    HairColors.AcidGreen,
    HairColors.UltraViolet,
    HairColors.JetBlack,
    HairColors.IceWhite,
  ])
  .addColors('body', [
    ClothingColors.Carbon,
    ClothingColors.Midnight,
    ClothingColors.Crimson,
    ClothingColors.Slate,
  ])
  .addColors('faceHair', [
    HairColors.NeonPink,
    HairColors.Cyan,
    HairColors.JetBlack,
  ])
  .addColors('eyes', [
    AccentColors.EyeCyan,
    AccentColors.EyeAmber,
    AccentColors.EyeRed,
  ])
  .addColors('mouth', [AccentColors.MouthRose, AccentColors.MouthCoral])
  .addColors('glasses', [
    AccentColors.VisorCyan,
    AccentColors.VisorMagenta,
    AccentColors.VisorLime,
  ])
  .addColors('faceDetails', [
    AccentColors.DetailGreen,
    AccentColors.DetailPink,
    AccentColors.DetailCyan,
  ])
  // Head
  .addItem('head', 'standard', atHead(1))
  .addItem('head', 'angular', atHead(1))
  // Hair
  .addItem('hair', 'mohawk', atHead(5))
  .addItem('hair', 'undercut', atHead(5))
  .addItem('hair', 'bob', atHead(5))
  .addItem('hair', 'spikes', atHead(5))
  .addItem('hair', 'slicked', atHead(5))
  .addItem('hair', 'buzz', atHead(5))
  .addItem('hair', 'ponytail', atHead(5))
  .addItem('hair', 'shaved', atHead(5))
  // Body
  .addItem('body', 'jacket', atHead(10))
  .addItem('body', 'hoodie', atHead(10))
  .addItem('body', 'vest', atHead(10))
  // Mouth
  .addItem('mouth', 'neutral', atHead(15))
  .addItem('mouth', 'smirk', atHead(15))
  .addItem('mouth', 'grin', atHead(15))
  // Eyes
  .addItem('eyes', 'standard', atHead(20))
  .addItem('eyes', 'cyber', atHead(20))
  .addItem('eyes', 'determined', atHead(20))
  .addItem('eyes', 'happy', atHead(20))
  // Face Details
  .addItem('faceDetails', 'circuits', atHead(25))
  .addItem('faceDetails', 'scar', atHead(25))
  .addItem('faceDetails', 'blush', atHead(25))
  .setOptional('faceDetails')
  // Face Hair
  .addItem('faceHair', 'stubble', atHead(30))
  .addItem('faceHair', 'goatee', atHead(30))
  .setOptional('faceHair')
  // Glasses
  .addItem('glasses', 'visor', atHead(35))
  .addItem('glasses', 'goggles', atHead(35))
  .setOptional('glasses')
