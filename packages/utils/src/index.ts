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
function pickRandom<T>(items: T[], random?: () => number): T | undefined {
  if (items.length === 0) return undefined
  if (!random) return items[0]
  const index = Math.floor(random() * items.length)
  return items[index]
}

/**
 * Select an item from a collection based on identifier
 */
export function selectItem<I extends AvatarItem>(
  collection: AvatarItemCollection<I>,
  identifier?: string,
  random?: () => number,
): { key: string; item: I } | null {
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

/**
 * Parse border radius value (handles both numbers and percentage strings)
 */
export function parseBorderRadius(
  borderRadius: number | string | undefined,
  size: number,
): number {
  if (!borderRadius) return 0
  if (typeof borderRadius === 'number') return borderRadius

  // Handle percentage strings like "50%"
  if (borderRadius.includes('%')) {
    return (Number.parseFloat(borderRadius) / 100) * size
  }

  // Handle numeric strings like "20px" or "20"
  return Number.parseFloat(borderRadius)
}

/**
 * Parse border width value (handles both numbers and strings)
 */
export function parseBorderWidth(
  borderWidth: number | string | undefined,
): number {
  if (!borderWidth) return 0
  if (typeof borderWidth === 'number') return borderWidth
  return Number.parseFloat(borderWidth)
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
function getPredictorIdentifiers<I extends AvatarItem, T extends Theme<I>>(
  category: AvatarPartCategory,
  predictions: Predictions,
  theme: T,
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
function getPredictorColors<I extends AvatarItem, T extends Theme<I>>(
  category: AvatarPartCategory,
  predictions: Predictions,
  theme: T,
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
function selectIdentifier<I extends AvatarItem, T extends Theme<I>>(
  category: AvatarPartCategory,
  config: AvatarConfig<I, T>,
  predictions: Predictions | undefined,
  theme: T,
  random?: () => number,
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
      const collection = theme[category]
      if (!collection) return undefined
      const result = selectItem(collection, undefined, random)
      return result?.key
    },
  )
}

/**
 * Select color with priority: explicit > connected > predictor > palette
 */
export function selectColorValue<I extends AvatarItem, T extends Theme<I>>(
  category: AvatarPartCategory,
  config: AvatarConfig<I, T>,
  predictions: Predictions | undefined,
  theme: T,
  colors: Partial<Record<AvatarPartCategory, string>>,
  random?: () => number,
): string | undefined {
  return selectWithPriority(
    // Priority 1: Explicit from config
    () => config[`${category}Color`],
    // Priority 2: Connected color
    () => {
      const sourceCategory = theme.connectedColors?.[category]
      return sourceCategory ? colors[sourceCategory] : undefined
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
export function selectItems<I extends AvatarItem, T extends Theme<I>>(
  config: AvatarConfig<I, T>,
  theme: T,
  predictions?: Predictions,
): {
  selected: Partial<Record<AvatarPartCategory, I>>
  identifiers: Partial<Record<AvatarPartCategory, string>>
  colors: Partial<Record<AvatarPartCategory, string>>
  style: T['style']
  seed?: string | number
} {
  const seed = predictions
    ? JSON.stringify(predictions)
    : (config.seed ?? 'avatune')
  const random = seededRandom(seed)

  const selected: Partial<Record<AvatarPartCategory, I>> = {}
  const identifiers: Partial<Record<AvatarPartCategory, string>> = {}
  const colors: Partial<Record<AvatarPartCategory, string>> = {}

  // Select background color
  const backgroundColor = selectWithPriority(
    // Priority 1: Explicit from config
    () => config.backgroundColor,
    // Priority 2: Random from palette
    () => selectColor(theme.colorPalettes.background, random),
  )

  // Create style object with selected background color
  const style: T['style'] = {
    ...theme.style,
    backgroundColor,
  }

  const allCategories = Object.keys(theme.colorPalettes).filter(
    (key) => key !== 'background',
  ) as AvatarPartCategory[]

  for (const category of allCategories) {
    // Select item (shape/asset)
    const identifier = selectIdentifier(
      category,
      config,
      predictions,
      theme,
      random,
    )

    if (identifier && theme[category]) {
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
      colors,
      random,
    )

    if (color) {
      colors[category] = color
    }
  }

  return { selected, identifiers, colors, style, seed: config.seed }
}
