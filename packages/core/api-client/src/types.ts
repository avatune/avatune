import type fatinVerseTheme from '@avatune/fatin-verse-theme/vanilla'
import type kyuteTheme from '@avatune/kyute-theme/vanilla'
import type micahTheme from '@avatune/micah-theme/vanilla'
import type miniavsTheme from '@avatune/miniavs-theme/vanilla'
import type nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import type pacovqzzTheme from '@avatune/pacovqzz-theme/vanilla'
import type {
  AvatarConfig,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import type yanliuTheme from '@avatune/yanliu-theme/vanilla'
import type { ThemeName } from './theme-names.generated.js'

export type { ThemeName } from './theme-names.generated.js'

/**
 * Base parameters available for all themes
 */
export interface BaseAvatarParams {
  /** Avatar size in pixels */
  size?: number
  /** Random seed for consistent generation */
  seed?: string | number
  /** Background color (hex) */
  backgroundColor?: string
}

/**
 * Extract API params from a theme type
 */
type ThemeToApiParams<
  T extends VanillaTheme,
  Name extends ThemeName,
> = BaseAvatarParams & { theme: Name } & Partial<
    AvatarConfig<VanillaAvatarItem, T>
  >

/**
 * Yanliu theme parameters (derived from actual theme)
 */
export type YanliuParams = ThemeToApiParams<typeof yanliuTheme, 'yanliu'>

/**
 * Nevmstas theme parameters (derived from actual theme)
 */
export type NevmstasParams = ThemeToApiParams<typeof nevmstasTheme, 'nevmstas'>

/**
 * Miniavs theme parameters (derived from actual theme)
 */
export type MiniavsParams = ThemeToApiParams<typeof miniavsTheme, 'miniavs'>

/**
 * Micah theme parameters (derived from actual theme)
 */
export type MicahParams = ThemeToApiParams<typeof micahTheme, 'micah'>

/**
 * Kyute theme parameters (derived from actual theme)
 */
export type KyuteParams = ThemeToApiParams<typeof kyuteTheme, 'kyute'>

/**
 * Fatin Verse theme parameters (derived from actual theme)
 */
export type FatinVerseParams = ThemeToApiParams<
  typeof fatinVerseTheme,
  'fatin-verse'
>

/**
 * Pacovqzz theme parameters (derived from actual theme)
 */
export type PacovqzzParams = ThemeToApiParams<typeof pacovqzzTheme, 'pacovqzz'>

/**
 * Union type of all theme parameters
 */
export type AvatarParams =
  | YanliuParams
  | NevmstasParams
  | MiniavsParams
  | MicahParams
  | KyuteParams
  | FatinVerseParams
  | PacovqzzParams

/**
 * Generic avatar parameters when theme is not specified
 */
export interface GenericAvatarParams extends BaseAvatarParams {
  theme: ThemeName
  [key: string]: string | number | undefined
}

/**
 * API client configuration
 */
export interface AvatuneClientConfig {
  /** Base URL for the API (default: https://www.avatune.dev/api/svg/) */
  baseUrl?: string
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number
}

/**
 * API error response
 */
export interface ApiError {
  error: string
  message?: string
  availableThemes?: string[]
  retryAfter?: number
}

/**
 * Rate limit error
 */
export interface RateLimitError extends ApiError {
  error: 'Rate limit exceeded'
  retryAfter: number
}
