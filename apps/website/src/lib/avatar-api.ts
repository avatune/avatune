import type { VanillaTheme } from '@avatune/types'
import { avatar } from '@avatune/vanilla'
import {
  type AvatarApiThemeName,
  avatarApiThemeNames,
  avatarApiThemes,
} from './avatar-api-themes.generated'

export const themeNames = avatarApiThemeNames

const excludedThemeKeys: Record<string, true> = {
  style: true,
  predictorMappings: true,
  colorPalettes: true,
  connectedColors: true,
}

export function getTheme(themeName: string): VanillaTheme | undefined {
  return avatarApiThemes[themeName as AvatarApiThemeName]
}

export function renderAvatarSvg(
  theme: VanillaTheme,
  searchParams: URLSearchParams,
): string {
  const config: Record<string, string | number> = {}
  const seed = searchParams.get('seed')

  if (seed) config.seed = seed

  const partCategories = Object.keys(theme).filter(
    (key) => !excludedThemeKeys[key],
  )

  for (const category of partCategories) {
    const value = searchParams.get(category)
    if (value) config[category] = value

    const colorKey = `${category}Color`
    const colorValue = searchParams.get(colorKey)
    if (colorValue) config[colorKey] = colorValue
  }

  const backgroundColor = searchParams.get('backgroundColor')
  if (backgroundColor) config.backgroundColor = backgroundColor

  const borderRadius = searchParams.get('borderRadius')
  if (borderRadius !== null) {
    const numericBorderRadius = Number(borderRadius)
    config.borderRadius = Number.isFinite(numericBorderRadius)
      ? `${numericBorderRadius}%`
      : borderRadius
  }

  const size =
    Number.parseInt(searchParams.get('size') || '0', 10) || theme.style.size

  return avatar({
    theme,
    size,
    ...config,
  } as Parameters<typeof avatar>[0])
}

export const imageHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=31536000, immutable',
} as const
