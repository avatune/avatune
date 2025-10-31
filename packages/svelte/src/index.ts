import type { SvelteTheme, TypedAvatarConfig } from '@avatune/types'
import AvatarComponent from './Avatar.svelte'

export type AvatarProps<T extends SvelteTheme = SvelteTheme> =
  TypedAvatarConfig<T> & {
    theme: SvelteTheme
    width?: number
    height?: number
    class?: string
    style?: string
  }

/**
 * Avatar component for Svelte.
 *
 * Note: Due to Svelte 5 generics limitations, autocomplete for specific identifiers
 * is not available. Props accept `string | string[]` types.
 *
 * For type-safe props with autocomplete, use React or Vue.
 */
export const Avatar = AvatarComponent
