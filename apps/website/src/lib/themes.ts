import type { ReactTheme } from '@avatune/types'
import {
  type ThemeInfo,
  themeInfos,
  themeMap,
} from './theme-registry.generated'

export function getTheme(themeId: string): ReactTheme {
  const fallbackTheme = themeMap.kyute
  if (!fallbackTheme) throw new Error('Missing theme: kyute')
  return themeMap[themeId] ?? fallbackTheme
}

export function getThemeInfo(themeId: string): ThemeInfo {
  const fallbackThemeInfo = themeInfos[0]
  if (!fallbackThemeInfo) throw new Error('Missing theme metadata')
  return themeInfos.find((theme) => theme.id === themeId) ?? fallbackThemeInfo
}

export type { ThemeInfo }
export { themeInfos, themeMap }
