import type { ComponentType } from 'react'

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
  Component: ComponentType<any>
}

/**
 * Avatar item can be either vanilla or React
 */
export type AvatarItem = VanillaAvatarItem | ReactAvatarItem

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
 * Avatar part categories
 */
export type AvatarPartCategory = keyof Theme

/**
 * Configuration for avatar generation - can specify by identifier or by tags
 */
export interface AvatarConfig {
  /** Specific identifiers for each part (e.g., { hair: 'long-blond' }) */
  parts?: Partial<Record<AvatarPartCategory, string>>
  /** Tags to filter parts (e.g., { hair: ['blond', 'long'] }) */
  tags?: Partial<Record<AvatarPartCategory, string[]>>
  /** Random seed for reproducible generation */
  seed?: string | number
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
