export type CategoryId =
  | 'head'
  | 'hair'
  | 'eyes'
  | 'eyebrows'
  | 'mouth'
  | 'nose'
  | 'ears'
  | 'neck'
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

/** Category → the category whose color it reuses, e.g. `{ ears: 'head' }`. */
export type PaletteConnections = Partial<Record<CategoryId, CategoryId>>

export const PREDICTORS = ['hair', 'hairColor', 'skinTone', 'faceHair'] as const

export type Predictor = (typeof PREDICTORS)[number]

/** Predictor result → the item identifiers or color values it may select. */
export type PredictorMappings = Partial<
  Record<Predictor, Record<string, string[]>>
>

export interface PredictorSpec {
  id: Predictor
  label: string
  /** The category whose items or colors this predictor's results choose from. */
  category: CategoryId
  target: 'item' | 'color'
  /** The classes the trained model can return. */
  classes: readonly string[]
}

export const PREDICTOR_SPECS: readonly PredictorSpec[] = [
  {
    id: 'hair',
    label: 'Hair length',
    category: 'hair',
    target: 'item',
    classes: ['short', 'medium', 'long'],
  },
  {
    id: 'hairColor',
    label: 'Hair color',
    category: 'hair',
    target: 'color',
    classes: ['black', 'brown', 'blond', 'gray'],
  },
  {
    id: 'skinTone',
    label: 'Skin tone',
    category: 'head',
    target: 'color',
    classes: ['dark', 'medium', 'light'],
  },
  {
    id: 'faceHair',
    label: 'Facial hair',
    category: 'faceHair',
    target: 'item',
    classes: ['none', 'facial_hair'],
  },
]

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
  paletteConnections: PaletteConnections
  predictorMappings: PredictorMappings
  optionalCategories: CategoryId[]
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
  { id: 'neck', label: 'Neck', optional: true },
  { id: 'body', label: 'Body', optional: false },
  { id: 'glasses', label: 'Glasses', optional: true },
  { id: 'faceHair', label: 'Facial Hair', optional: true },
  { id: 'accessories', label: 'Accessories', optional: true },
  { id: 'faceDetails', label: 'Face Details', optional: true },
  { id: 'forelock', label: 'Forelock', optional: true },
  { id: 'hats', label: 'Hats', optional: true },
]
