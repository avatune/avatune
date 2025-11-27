import fatinVerseTheme from '@avatune/fatin-verse-theme/vanilla'
import micahTheme from '@avatune/micah-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vanilla'
import type { AvatarPartCategory, VanillaTheme } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/vanilla'

/**
 * Calculates the total number of combinations for a theme based only on assets (items)
 * Colors are not included in the calculation
 */
function calculateCombinations(theme: VanillaTheme): number {
  let combinations = 1

  const categoryNames: AvatarPartCategory[] = [
    'accessories',
    'glasses',
    'hats',
    'hair',
    'faceDetails',
    'body',
    'ears',
    'eyebrows',
    'eyes',
    'faceHair',
    'forelock',
    'head',
    'mouth',
    'neck',
    'noses',
  ]

  // Multiply all item options across all categories
  for (const category of categoryNames) {
    const collection = theme[category]
    if (!collection) continue

    const itemCount = Object.keys(collection).length
    if (itemCount > 0) {
      combinations *= itemCount
    }
  }

  return combinations
}

// Calculate combinations for each theme at build time
export const COMBINATIONS: Record<string, number> = {
  miniavs: calculateCombinations(miniavsTheme),
  yanliu: calculateCombinations(yanliuTheme),
  nevmstas: calculateCombinations(nevmstasTheme),
  micah: calculateCombinations(micahTheme),
  pacovqzz: calculateCombinations(pacovqzzTheme),
  fatinVerse: calculateCombinations(fatinVerseTheme),
}

export const TOTAL_COMBINATIONS = Object.values(COMBINATIONS).reduce(
  (sum, count) => sum + count,
  0,
)
