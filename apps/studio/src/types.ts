export type CategoryId =
  | 'head'
  | 'hair'
  | 'eyes'
  | 'eyebrows'
  | 'mouth'
  | 'nose'
  | 'ears'
  | 'body'
  | 'glasses'
  | 'faceHair'
  | 'accessories'
  | 'faceDetails'
  | 'forelock'
  | 'hats'

export type ThemeColorCategory = CategoryId | 'background'

export interface ThemeColor {
  id: string
  name: string
  value: string
}

export interface ThemePalette {
  id: string
  name: string
  colors: ThemeColor[]
}

export type PaletteAssignments = Partial<Record<ThemeColorCategory, string>>

export type ThemeFillTransform =
  | {
      type: 'darken' | 'lighten' | 'saturate' | 'desaturate' | 'rotate'
      amount: number
    }
  | { type: 'grayscale' | 'invert' }

export interface ThemeFillChain {
  type: 'custom'
  sourceColor?: string
  transforms: ThemeFillTransform[]
}

export type ThemeFillBinding = { type: 'primary' } | ThemeFillChain

export type ThemeFillBindings = Record<number, ThemeFillBinding>

export interface Category {
  id: CategoryId
  label: string
  optional?: boolean
}

export interface Asset {
  id: string
  name: string
  file: string
  dataUrl: string
  category: CategoryId
  xPercent: number
  usesThemeColor: boolean
  yPercent: number
  layer: number
  scale: number
  width?: number
  height?: number
}

export interface ThemeData {
  headAsset: Asset | null
  assets: Asset[]
  themeName: string
  size: number
  borderRadius: string
  palettes: ThemePalette[]
  paletteByCategory: PaletteAssignments
  secondaryColorChains: ThemeFillChain[]
}

export const CATEGORIES: Category[] = [
  { id: 'head', label: 'Head', optional: false },
  { id: 'hair', label: 'Hair', optional: false },
  { id: 'eyes', label: 'Eyes', optional: false },
  { id: 'eyebrows', label: 'Eyebrows', optional: false },
  { id: 'mouth', label: 'Mouth', optional: false },
  { id: 'nose', label: 'Nose', optional: false },
  { id: 'ears', label: 'Ears', optional: false },
  { id: 'body', label: 'Body', optional: false },
  { id: 'glasses', label: 'Glasses', optional: true },
  { id: 'faceHair', label: 'Facial Hair', optional: true },
  { id: 'accessories', label: 'Accessories', optional: true },
  { id: 'faceDetails', label: 'Face Details', optional: true },
  { id: 'forelock', label: 'Forelock', optional: true },
  { id: 'hats', label: 'Hats', optional: true },
]
