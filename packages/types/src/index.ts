import type { ComponentType, SVGProps } from 'react'
import type { Component as SvelteComponent } from 'svelte'
import type { DefineComponent } from 'vue'

/**
 * Position offset for an avatar item
 */
export interface Position {
  x: number
  y: number
}

/**
 * Base avatar item that can be either vanilla (SVG code) or React component
 */
export interface BaseAvatarItem {
  /** Position offset to place the item correctly in the avatar */
  position: Position
  /** Layer order (similar to z-index) - higher values render on top */
  layer: number
  /** Tags for categorization and filtering (e.g., ['blond', 'long'] for hair) */
  tags: string[]
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
  Component: DefineComponent<any, any, any>
}

/**
 * Svelte avatar item with a Svelte component
 */
export interface SvelteAvatarItem extends BaseAvatarItem {
  /** Svelte component to render */
  Component: SvelteComponent<any, any>
}

/**
 * Avatar item can be vanilla, React, Vue, or Svelte
 */
export type AvatarItem =
  | VanillaAvatarItem
  | ReactAvatarItem
  | VueAvatarItem
  | SvelteAvatarItem

/**
 * Type guard to check if an item is a vanilla item
 */
export function isVanillaItem(item: AvatarItem): item is VanillaAvatarItem {
  return 'code' in item
}

/**
 * Type guard to check if an item is a React item
 */
export function isReactItem(item: AvatarItem): item is ReactAvatarItem {
  return 'Component' in item
}

/**
 * Collection of avatar items by identifier
 */
export type AvatarItemCollection<T extends AvatarItem = AvatarItem> = Record<
  string,
  T
>

/**
 * Complete theme defining all avatar parts
 */
export interface Theme<T extends AvatarItem = AvatarItem> {
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
export type AvatarPartCategory = keyof Theme

/**
 * Configuration for avatar generation
 * - String value = identifier (e.g., { hair: 'long' })
 * - String[] value = tags to filter by (e.g., { hair: ['blond', 'long'] })
 * - Can include 'seed' for reproducible generation
 */
export type AvatarConfig =
  | (Partial<Record<AvatarPartCategory, string | string[]>> &
      Partial<Record<`${AvatarPartCategory}Color`, string>>)
  | {
      seed: string | number
    }

/**
 * Result of avatar generation
 */
export interface AvatarResult {
  /** Selected items for each part */
  selected: Partial<Record<AvatarPartCategory, AvatarItem>>
  /** Identifiers of selected items */
  identifiers: Partial<Record<AvatarPartCategory, string>>
}
