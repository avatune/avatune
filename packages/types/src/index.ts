import type { ComponentType, SVGProps } from 'react'
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
 * Vanilla avatar item with raw SVG code
 */
export interface VanillaAvatarItem extends BaseAvatarItem {
  /** Raw SVG code as a string */
  code: string
}

/**
 * React avatar item with a React component
 */
export interface ReactAvatarItem extends BaseAvatarItem {
  /** React component to render */
  Component: ComponentType<SVGProps<SVGSVGElement>>
}

/**
 * Vue avatar item with a Vue component
 */
export interface VueAvatarItem extends BaseAvatarItem {
  /** Vue component to render */
  Component: DefineComponent<
    VueSVGAttributes & {
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
    SvelteSVGAttributes<SVGSVGElement> & {
      className?: string
      style?: string
    }
  >
}

/**
 * Avatar item can be vanilla, React, Vue, or Svelte
 */
export type AvatarItem =
  | BaseAvatarItem
  | VanillaAvatarItem
  | ReactAvatarItem
  | VueAvatarItem
  | SvelteAvatarItem

/**
 * Collection of avatar items by identifier
 */
export type AvatarItemCollection<
  T extends AvatarItem = AvatarItem,
  Identifier extends string = string,
> = Record<Identifier, T>

export type HairLengthPredictorClass = 'short' | 'medium' | 'long'

export type HairColorPredictorClass = 'black' | 'brown' | 'blond' | 'gray'

export type SkinTonePredictorClass = 'dark' | 'medium' | 'light'

export type ThemeStyle = {
  size: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number | string
  borderRadius?: number | string
}

/**
 * Complete theme defining all avatar parts
 */
export interface Theme<T extends AvatarItem = AvatarItem> {
  style: ThemeStyle
  body: AvatarItemCollection<T>
  ears: AvatarItemCollection<T>
  eyebrows: AvatarItemCollection<T>
  eyes: AvatarItemCollection<T>
  hair: AvatarItemCollection<T>
  head: AvatarItemCollection<T>
  mouth: AvatarItemCollection<T>
  noses: AvatarItemCollection<T>
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
export type AvatarPartCategory = Exclude<keyof Theme, 'style' | 'predictions'>

/**
 * Extract all identifiers from a theme category
 */
export type ExtractIdentifiers<T extends AvatarItemCollection> = keyof T

/**
 * Type-safe configuration for a specific theme
 * Provides autocomplete for identifiers
 */
export type TypedAvatarConfig<T extends Theme> = {
  seed?: string | number
  body?: ExtractIdentifiers<T['body']>
  ears?: ExtractIdentifiers<T['ears']>
  eyebrows?: ExtractIdentifiers<T['eyebrows']>
  eyes?: ExtractIdentifiers<T['eyes']>
  hair?: ExtractIdentifiers<T['hair']>
  head?: ExtractIdentifiers<T['head']>
  mouth?: ExtractIdentifiers<T['mouth']>
  noses?: ExtractIdentifiers<T['noses']>
  bodyColor?: string
  earsColor?: string
  eyebrowsColor?: string
  eyesColor?: string
  hairColor?: string
  headColor?: string
  mouthColor?: string
  nosesColor?: string
}

/**
 * Configuration for avatar generation
 * - String value = identifier (e.g., { hair: 'long' })
 * - Can include 'seed' for reproducible generation
 */
export type AvatarConfig<A extends AvatarItem = AvatarItem, T = Theme<A>> = {
  seed?: string | number
} & Partial<{ [K in keyof T]: string }> &
  Partial<{ [K in keyof T as `${K & string}Color`]: string }>
