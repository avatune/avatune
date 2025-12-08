import ashleySeoTheme from '@avatune/ashley-seo-theme/svelte'
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/svelte'
import pawelOlekWomanTheme from '@avatune/pawel-olek-woman-theme/svelte'
import type { SvelteTheme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import { type ThemeInfo, themeInfos } from './create-avatar-showcase'

export const themeMap: Record<string, SvelteTheme> = {
  kyute: kyuteTheme,
  micah: micahTheme,
  miniavs: miniavsTheme,
  pacovqzz: pacovqzzTheme,
  yanliu: yanliuTheme,
  nevmstas: nevmstasTheme,
  fatinVerse: fatinVerseTheme,
  ashleySeo: ashleySeoTheme,
  pawelOlekMan: pawelOlekManTheme,
  pawelOlekWoman: pawelOlekWomanTheme,
}

export function getTheme(themeId: string): SvelteTheme {
  return themeMap[themeId] ?? themeMap.kyute
}

export function getThemeInfo(themeId: string): ThemeInfo {
  return themeInfos.find((t) => t.id === themeId) ?? themeInfos[0]
}

export { themeInfos }
export type { ThemeInfo }
