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

export interface Category {
  id: CategoryId
  label: string
  optional?: boolean
}

export interface Asset {
  id: string
  name: string
  file: File
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

export const DEFAULT_LAYERS: Record<CategoryId, number> = {
  head: 1,
  hair: 15,
  eyes: 20,
  eyebrows: 25,
  mouth: 32,
  nose: 21,
  ears: 40,
  body: 10,
  glasses: 35,
  faceHair: 30,
  accessories: 41,
  faceDetails: 25,
  forelock: 15,
  hats: 15,
}
