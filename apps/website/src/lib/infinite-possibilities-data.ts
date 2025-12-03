import ashleySeoTheme from '@avatune/ashley-seo-theme/vanilla'
import fatinVerseTheme from '@avatune/fatin-verse-theme/vanilla'
import micahTheme from '@avatune/micah-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vanilla'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/vanilla'
import pawelOlekWomanTheme from '@avatune/pawel-olek-woman-theme/vanilla'
import type { VanillaTheme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/vanilla'

/**
 * Calculates the total number of combinations for a theme based only on assets (items)
 * Colors are not included in the calculation
 */
function calculateCombinations(theme: VanillaTheme): number {
  let combinations = 1

  // Multiply all item options across all categories
  for (const key of Object.keys(theme)) {
    const collection = theme[key as keyof typeof theme]
    if (
      !collection ||
      key === 'style' ||
      key === 'colorPalettes' ||
      key === 'predictorMappings' ||
      key === 'connectedColors'
    )
      continue

    const itemCount = Object.keys(collection).length
    if (itemCount > 0) {
      combinations *= itemCount
    }
  }

  return combinations
}

export const TOTAL_COMBINATIONS = [
  miniavsTheme,
  yanliuTheme,
  nevmstasTheme,
  micahTheme,
  pacovqzzTheme,
  fatinVerseTheme,
  pawelOlekManTheme,
  pawelOlekWomanTheme,
  ashleySeoTheme,
].reduce((acc, theme) => {
  console.log(theme, calculateCombinations(theme))
  return acc + calculateCombinations(theme)
}, 0)
