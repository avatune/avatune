import type { ComponentType, SVGProps } from 'react'
import type { SvgProps } from 'react-native-svg'
import type { Component as SvelteComponent } from 'svelte'
import type { SVGAttributes as SvelteSVGAttributes } from 'svelte/elements'
import type { DefineComponent, SVGAttributes as VueSVGAttributes } from 'vue'

/**
 * Position offset for an avatar item
 */
export type Position =
  | {
      x: number | string
      y: number | string
    }
  | ((size: number) => {
      x: number | string
      y: number | string
    })

/**
 * Base avatar item that can be either vanilla (SVG code) or React component
 */
export interface BaseAvatarItem {
  /** Position offset to place the item correctly in the avatar */
  position: Position
  /** Layer order (similar to z-index) - higher values render on top */
  layer: number
  /** Color of the item */
  color?: string
}

/**
 * Props passed to avatar SVG components
 */
export interface AvatarSvgProps {
  color?: string
  uid?: string
}

/**
 * Vanilla avatar item with raw SVG code
 */
export interface VanillaAvatarItem extends BaseAvatarItem {
  /** Raw SVG code as a string */
  code: (props: AvatarSvgProps) => string
}

/**
 * React avatar item with a React component
 */
export interface ReactAvatarItem extends BaseAvatarItem {
  /** React component to render */
  Component: ComponentType<SVGProps<SVGSVGElement> & AvatarSvgProps>
}

/**
 * React Native avatar item with a React Native component
 */
export interface ReactNativeAvatarItem extends BaseAvatarItem {
  /** React Native component to render */
  Component: ComponentType<SvgProps & AvatarSvgProps>
}

/**
 * Vue avatar item with a Vue component
 */
export interface VueAvatarItem extends BaseAvatarItem {
  /** Vue component to render */
  Component: DefineComponent<
    VueSVGAttributes &
      AvatarSvgProps & {
        className?: string
        style?: string
      }
  >
}

/**
 * Svelte avatar item with a Svelte component
 */
export interface SvelteAvatarItem extends BaseAvatarItem {
  /** Svelte component to render */
  Component: SvelteComponent<
    SvelteSVGAttributes<SVGSVGElement> &
      AvatarSvgProps & {
        className?: string
        style?: string
      }
  >
}

/**
 * Avatar item can be vanilla, React, React Native, Vue, or Svelte
 */
export type AvatarItem =
  | BaseAvatarItem
  | VanillaAvatarItem
  | ReactAvatarItem
  | ReactNativeAvatarItem
  | VueAvatarItem
  | SvelteAvatarItem

/**
 * Collection of avatar items by identifier
 */
export type AvatarItemCollection<
  T extends AvatarItem = AvatarItem,
  Identifier extends string = string,
> = Record<Identifier, T>

/**
 * Predictor result types
 */
export type HairLengthPredictorClass = 'short' | 'medium' | 'long'

export type HairColorPredictorClass = 'black' | 'brown' | 'blond' | 'gray'

export type SkinTonePredictorClass = 'dark' | 'medium' | 'light'

export type FacialHairPredictorClass = 'none' | 'facial_hair'

/**
 * Consolidated predictor results type
 */
export interface Predictions {
  hairLength?: HairLengthPredictorClass
  hairColor?: HairColorPredictorClass
  skinTone?: SkinTonePredictorClass
  facialHair?: FacialHairPredictorClass
}

/**
 * Mapping from predictor result to asset identifiers
 * Each predictor class maps to an array of possible identifiers
 */
export type PredictorMapping<Identifiers extends string = string> = {
  [key: string]: Identifiers[]
}

/**
 * Mapping from predictor result to colors
 * Each predictor class maps to an array of possible colors
 */
export type ColorMapping = {
  [key: string]: string[]
}

/**
 * Color options for avatar parts
 * Can be a single color or an array of colors to choose from
 */
export type ColorOptions = string | string[]

/**
 * Complete predictor mappings for a theme
 * Maps predictor results to specific asset identifiers/colors
 */
export interface ThemePredictorMappings {
  hair?: PredictorMapping
  hairColor?: ColorMapping
  skinTone?: ColorMapping
  facialHair?: PredictorMapping
}

/**
 * Color palettes for each avatar part
 * Defines available colors that can be randomly selected when using seed
 */
export interface ThemeColorPalettes {
  background: ColorOptions
  accessories?: ColorOptions
  glasses?: ColorOptions
  hats?: ColorOptions
  hair: ColorOptions
  faceDetails?: ColorOptions
  body: ColorOptions
  ears: ColorOptions
  eyebrows: ColorOptions
  eyes: ColorOptions
  faceHair?: ColorOptions
  forelock: ColorOptions
  head: ColorOptions
  mouth: ColorOptions
  neck?: ColorOptions
  nose: ColorOptions
}

export type ThemeStyle = {
  size: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number | string
  borderRadius?: number | string
}

/**
 * Connected colors configuration
 * Defines which avatar parts should share the same color
 * Key is the dependent part, value is the source part to copy color from
 */
export type ConnectedColors = Partial<
  Record<AvatarPartCategory, AvatarPartCategory>
>

/**
 * Complete theme defining all avatar parts
 */
export interface Theme<T extends AvatarItem> {
  style: ThemeStyle
  accessories?: AvatarItemCollection<T>
  glasses?: AvatarItemCollection<T>
  hats?: AvatarItemCollection<T>
  hair: AvatarItemCollection<T>
  faceDetails?: AvatarItemCollection<T>
  body: AvatarItemCollection<T>
  ears: AvatarItemCollection<T>
  eyebrows: AvatarItemCollection<T>
  eyes: AvatarItemCollection<T>
  faceHair?: AvatarItemCollection<T>
  forelock?: AvatarItemCollection<T>
  head: AvatarItemCollection<T>
  mouth: AvatarItemCollection<T>
  neck?: AvatarItemCollection<T>
  nose: AvatarItemCollection<T>
  colorPalettes: ThemeColorPalettes
  predictorMappings?: ThemePredictorMappings
  connectedColors?: ConnectedColors
}

/**
 * Vanilla theme with SVG code strings
 */
export type VanillaTheme = Theme<VanillaAvatarItem>

/**
 * React theme with React components
 */
export type ReactTheme = Theme<ReactAvatarItem>

/**
 * React Native theme with React Native components
 */
export type ReactNativeTheme = Theme<ReactNativeAvatarItem>

/**
 * Vue theme with Vue components
 */
export type VueTheme = Theme<VueAvatarItem>

/**
 * Svelte theme with Svelte components
 */
export type SvelteTheme = Theme<SvelteAvatarItem>

/**
 * Avatar part categories
 */
export type AvatarPartCategory = Exclude<
  keyof Theme<AvatarItem>,
  'style' | 'predictorMappings' | 'colorPalettes' | 'connectedColors'
>

/**
 * Extract all identifiers from a theme category
 */
export type ExtractIdentifiers<T extends AvatarItemCollection> = keyof T

/**
 * Type-safe configuration for a specific theme
 * Provides autocomplete for identifiers
 */
export type AvatarConfig<I extends AvatarItem, T extends Theme<I>> = {
  seed?: string | number
  accessories?: T['accessories'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['accessories']>
    : never
  glasses?: T['glasses'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['glasses']>
    : never
  hats?: T['hats'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['hats']>
    : never
  hair?: ExtractIdentifiers<T['hair']>
  faceDetails?: T['faceDetails'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['faceDetails']>
    : never
  body?: ExtractIdentifiers<T['body']>
  ears?: ExtractIdentifiers<T['ears']>
  eyebrows?: ExtractIdentifiers<T['eyebrows']>
  eyes?: ExtractIdentifiers<T['eyes']>
  faceHair?: T['faceHair'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['faceHair']>
    : never
  forelock?: T['forelock'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['forelock']>
    : never
  head?: ExtractIdentifiers<T['head']>
  mouth?: ExtractIdentifiers<T['mouth']>
  neck?: T['neck'] extends AvatarItemCollection<I>
    ? ExtractIdentifiers<T['neck']>
    : never
  nose?: ExtractIdentifiers<T['nose']>
  backgroundColor?: string
  accessoriesColor?: T['accessories'] extends AvatarItemCollection<I>
    ? string
    : never
  glassesColor?: T['glasses'] extends AvatarItemCollection<I> ? string : never
  hatsColor?: T['hats'] extends AvatarItemCollection<I> ? string : never
  hairColor?: string
  faceDetailsColor?: T['faceDetails'] extends AvatarItemCollection<I>
    ? string
    : never
  bodyColor?: string
  earsColor?: string
  eyebrowsColor?: string
  eyesColor?: string
  faceHairColor?: T['faceHair'] extends AvatarItemCollection<I> ? string : never
  forelockColor?: string
  headColor?: string
  mouthColor?: string
  neckColor?: T['neck'] extends AvatarItemCollection<I> ? string : never
  noseColor?: string
}
