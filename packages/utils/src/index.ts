import type {
  AvatarConfig,
  AvatarItem,
  AvatarItemCollection,
  AvatarPartCategory,
  ColorOptions,
  Predictions,
  Theme,
} from '@avatune/types'

/**
 * Simple string hash function
 */
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Simple seeded random number generator for reproducible results
 */
export function seededRandom(seed: string | number): () => number {
  let value = typeof seed === 'number' ? seed : hashString(seed)
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/**
 * Pick random element from array using seeded random
 */
function pickRandom<T>(items: T[], random: () => number): T | undefined {
  if (items.length === 0) return undefined
  const index = Math.floor(random() * items.length)
  return items[index]
}

/**
 * Select an item from a collection based on identifier
 */
export function selectItem<T extends AvatarItem>(
  collection: AvatarItemCollection<T>,
  identifier?: string,
  random?: () => number,
): { key: string; item: T } | null {
  if (identifier && collection[identifier]) {
    return { key: identifier, item: collection[identifier] }
  }

  const candidates = Object.entries(collection)

  if (candidates.length === 0) {
    return null
  }

  // Pick random item (or first if no random function)
  const index = random ? Math.floor(random() * candidates.length) : 0
  const selected = candidates[index]

  if (!selected) {
    return null
  }

  const [key, item] = selected

  return { key, item }
}

/**
 * Select color from options (string or array)
 */
export function selectColor(
  options: ColorOptions | undefined,
  random: () => number = Math.random,
): string | undefined {
  if (!options) return undefined
  if (typeof options === 'string') return options
  return pickRandom(options, random)
}

/**
 * Higher-order function to create position functions with offsets
 * from a base position function
 */
export function offsetFrom(
  basePosition: (size: number) => { x: number; y: number },
) {
  return (xRatio: number, yRatio: number) => (size: number) => {
    const base = basePosition(size)
    return {
      x: base.x + size * xRatio,
      y: base.y + size * yRatio,
    }
  }
}

export function percentage(value: string) {
  return Number.parseFloat(value) / 100
}

export function themeStyleToStyleProp(
  style: Theme['style'],
  output: 'object' | 'string' = 'object',
) {
  const backgroundColor = style.backgroundColor
  const borderColor = style.borderColor
  const borderWidth = style.borderWidth
  const borderRadius = style.borderRadius

  if (output === 'object') {
    return {
      backgroundColor,
      border:
        borderWidth && borderColor
          ? `${borderWidth}px solid ${borderColor}`
          : undefined,
      borderRadius,
    }
  }

  return [
    backgroundColor ? `background-color: ${backgroundColor};` : false,
    borderWidth && borderColor
      ? `border: ${borderWidth}px solid ${borderColor};`
      : false,
    borderRadius ? `border-radius: ${borderRadius};` : false,
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * Generic priority-based selector
 * Tries strategies in order until one returns a non-undefined value
 */
type SelectionStrategy<T> = () => T | undefined

function selectWithPriority<T>(
  ...strategies: SelectionStrategy<T>[]
): T | undefined {
  for (const strategy of strategies) {
    const result = strategy()
    if (result !== undefined) return result
  }
  return undefined
}

/**
 * Get predictor result identifiers for a category
 */
function getPredictorIdentifiers<T extends AvatarItem>(
  category: AvatarPartCategory,
  predictions: Predictions,
  theme: Theme<T>,
): string[] | undefined {
  if (category !== 'hair' || !theme.predictorMappings?.hair) {
    return undefined
  }

  const { hairLength } = predictions
  if (!hairLength) return undefined

  return theme.predictorMappings.hair[hairLength]
}

/**
 * Get predictor result colors for a category
 */
function getPredictorColors<T extends AvatarItem>(
  category: AvatarPartCategory,
  predictions: Predictions,
  theme: Theme<T>,
): string[] | undefined {
  const { predictorMappings } = theme
  if (!predictorMappings) return undefined

  // Hair-based categories use hairColor predictor
  if (category === 'hair' || category === 'eyebrows') {
    const { hairColor } = predictions
    if (!hairColor || !predictorMappings.hairColor) return undefined
    return predictorMappings.hairColor[hairColor]
  }

  // Skin-based categories use skinTone predictor
  if (category === 'head' || category === 'ears') {
    const { skinTone } = predictions
    if (!skinTone || !predictorMappings.skinTone) return undefined
    return predictorMappings.skinTone[skinTone]
  }

  return undefined
}

/**
 * Select identifier with priority: explicit > predictor > random
 */
function selectIdentifier<T extends AvatarItem>(
  category: AvatarPartCategory,
  config: AvatarConfig,
  predictions: Predictions | undefined,
  theme: Theme<T>,
  random: () => number,
): string | undefined {
  return selectWithPriority(
    // Priority 1: Explicit from config
    () => {
      const explicit = config[category]
      return typeof explicit === 'string' ? explicit : undefined
    },
    // Priority 2: Predictor-based
    () => {
      if (!predictions) return undefined
      const candidates = getPredictorIdentifiers(category, predictions, theme)
      return candidates ? pickRandom(candidates, random) : undefined
    },
    // Priority 3: Random from collection
    () => {
      const result = selectItem(theme[category], undefined, random)
      return result?.key
    },
  )
}

/**
 * Select color with priority: explicit > connected > predictor > palette
 */
function selectColorValue<T extends AvatarItem>(
  category: AvatarPartCategory,
  config: AvatarConfig,
  predictions: Predictions | undefined,
  theme: Theme<T>,
  random: () => number,
  selectedColors: Partial<Record<AvatarPartCategory, string>>,
): string | undefined {
  return selectWithPriority(
    // Priority 1: Explicit from config
    () => config[`${category}Color`],
    // Priority 2: Connected color
    () => {
      const sourceCategory = theme.connectedColors?.[category]
      return sourceCategory ? selectedColors[sourceCategory] : undefined
    },
    // Priority 3: Predictor-based
    () => {
      if (!predictions) return undefined
      const candidates = getPredictorColors(category, predictions, theme)
      return candidates ? pickRandom(candidates, random) : undefined
    },
    // Priority 4: Random from palette
    () => {
      const palette =
        theme.colorPalettes?.[category as keyof typeof theme.colorPalettes]
      return selectColor(palette, random)
    },
  )
}

/**
 * Select items and colors for avatar generation
 * Supports explicit config, ML predictors, and random fallbacks
 */
export function selectItems<T extends AvatarItem>(
  config: AvatarConfig,
  theme: Theme<T>,
  predictions?: Predictions,
): {
  selected: Partial<Record<AvatarPartCategory, T>>
  identifiers: Partial<Record<AvatarPartCategory, string>>
  colors: Partial<Record<AvatarPartCategory, string>>
  seed?: string | number
} {
  const random =
    config.seed !== undefined ? seededRandom(config.seed) : Math.random

  const selected: Partial<Record<AvatarPartCategory, T>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}
  const colors: Partial<Record<AvatarPartCategory, string>> = {}

  const allCategories = Object.keys(theme.colorPalettes) as AvatarPartCategory[]
  for (const category of allCategories) {
    // Select item (shape/asset)
    const identifier = selectIdentifier(
      category,
      config,
      predictions,
      theme,
      random,
    )

    if (identifier) {
      const item = theme[category][identifier]
      if (item) {
        selected[category] = item
        identifiers[category] = identifier
      }
    }

    // Select color
    const color = selectColorValue(
      category,
      config,
      predictions,
      theme,
      random,
      colors,
    )

    if (color) {
      colors[category] = color
    }
  }

  return { selected, identifiers, colors, seed: config.seed }
}
