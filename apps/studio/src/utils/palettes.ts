import type {
  CategoryId,
  PaletteAssignments,
  PaletteConnections,
  ThemeColorCategory,
} from '../types'

export interface PaletteLookup {
  paletteByCategory: PaletteAssignments
  paletteConnections: PaletteConnections
}

/**
 * Follows a category's connections to the one that actually owns the color.
 * Stops on a cycle rather than looping, so malformed state still renders.
 */
export const resolveColorSource = (
  connections: PaletteConnections,
  category: ThemeColorCategory,
): ThemeColorCategory => {
  const seen = new Set<ThemeColorCategory>([category])
  let current = category

  while (true) {
    const next = connections[current as CategoryId]
    if (!next || seen.has(next)) return current
    seen.add(next)
    current = next
  }
}

export const resolvePaletteId = (
  { paletteByCategory, paletteConnections }: PaletteLookup,
  category: ThemeColorCategory,
): string | undefined =>
  paletteByCategory[resolveColorSource(paletteConnections, category)]

const chainReaches = (
  connections: PaletteConnections,
  from: CategoryId,
  target: CategoryId,
): boolean => {
  const seen = new Set<CategoryId>()
  let current: CategoryId | undefined = from

  while (current && !seen.has(current)) {
    if (current === target) return true
    seen.add(current)
    current = connections[current]
  }

  return false
}

/** True when connecting `category` to `target` would close a loop. */
export const wouldConnectionCycle = (
  connections: PaletteConnections,
  category: CategoryId,
  target: CategoryId,
): boolean => chainReaches(connections, target, category)
