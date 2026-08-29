/**
 * Fixture for the item-selection port.
 *
 * Expected values come from the real `selectItems` in `@avatune/utils`, so this
 * pins the behaviour the web renderers actually have rather than the behaviour
 * the code appears to have. What it exists to catch:
 *
 *  - Palette iteration order. `selectItems` walks `Object.keys(colorPalettes)`
 *    and resolves `connectedColors` against colours assigned earlier in that
 *    same pass, so a Swift port backed by a Dictionary silently produces wrong
 *    colours wherever a theme connects one category to another.
 *  - The weighted `none` branch, which gives `none` a 2/3 share rather than a
 *    uniform one.
 *  - The explicit > connected > predictor > palette priority chain.
 *
 * The theme data each case needs is embedded in the fixture, so the parity
 * tests stand alone rather than depending on generated theme modules.
 */

import type { Predictions } from '@avatune/types'
import { selectItems } from '@avatune/utils'
import type { ThemeBundle } from '../avatune-ir/build-theme-ir'
import { SEEDS } from './inputs'

export interface FixtureItem {
  key: string
  layer: number
  position: { xAbs: number; xRatio: number; yAbs: number; yRatio: number }
}

export interface FixtureCategory {
  category: string
  palette: string[]
  /**
   * Ordered identifiers. May be empty: a theme can declare a palette entry for
   * a category it has no items for (fatin-verse does this for `ears`), and
   * `selectItems` still assigns that category a colour.
   */
  items: FixtureItem[]
}

export interface FixtureTheme {
  name: string
  style: {
    size: number
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    borderRadius?: string | number
  }
  backgroundPalette: string[]
  /** In palette order, which is the order `selectItems` iterates. */
  categories: FixtureCategory[]
  connectedColors: Array<[string, string]>
  predictorMappings?: Record<string, Record<string, string[]>>
}

export interface SelectionCase {
  theme: string
  label: string
  config: Record<string, unknown>
  predictions?: Predictions
  /**
   * `JSON.stringify(predictions)` — the literal string used as the base seed
   * when predictions are supplied. Recorded because it depends on JS key
   * insertion order, which a Swift port cannot observe and must reproduce.
   */
  predictionsSeed?: string
  expect: {
    identifiers: Record<string, string>
    colors: Record<string, string>
    style: Record<string, unknown>
  }
}

/**
 * Every palette category in iteration order, carrying whatever items the theme
 * defines for it. Driven by `paletteOrder` rather than the item collections,
 * because a category with no collection still takes part in colour selection.
 */
function categoriesOf({ ir }: ThemeBundle): FixtureCategory[] {
  return ir.categories.map((category) => ({
    category: category.category,
    palette: category.palette,
    items: category.items.map((item) => ({
      key: item.key,
      layer: item.layer,
      position: item.position,
    })),
  }))
}

function toFixtureTheme(bundle: ThemeBundle): FixtureTheme {
  const { ir, loaded } = bundle
  const style = loaded.module.style as Record<string, unknown>
  return {
    name: ir.theme,
    style: {
      size: ir.style.size,
      backgroundColor: style.backgroundColor as string | undefined,
      borderColor: style.borderColor as string | undefined,
      borderWidth: style.borderWidth as number | undefined,
      borderRadius: style.borderRadius as string | number | undefined,
    },
    backgroundPalette: ir.backgroundPalette,
    categories: categoriesOf(bundle),
    connectedColors: ir.connectedColors,
    predictorMappings: ir.predictorMappings,
  }
}

/**
 * Deterministically picks a representative identifier from a category: the
 * second named entry where one exists, so the choice differs from the
 * first-item fallback `selectItem` returns when no random value is supplied.
 */
function representative(items: FixtureItem[]): string | undefined {
  const named = items.filter((i) => i.key !== 'none')
  if (named.length === 0) return items[0]?.key
  return named[Math.min(1, named.length - 1)].key
}

const PREDICTION_CASES: Predictions[] = [
  // Written in the canonical key order the Swift port must reproduce:
  // hairLength, hairColor, skinTone, faceHair.
  { hairLength: 'short', hairColor: 'black', skinTone: 'light' },
  { hairLength: 'long', hairColor: 'blond', skinTone: 'dark' },
  {
    hairLength: 'medium',
    hairColor: 'brown',
    skinTone: 'medium',
    faceHair: 'facial_hair',
  },
  { hairColor: 'gray', skinTone: 'medium', faceHair: 'none' },
]

function runCase(
  bundle: ThemeBundle,
  label: string,
  config: Record<string, unknown>,
  predictions?: Predictions,
): SelectionCase {
  const result = selectItems(
    config as never,
    bundle.loaded.module as never,
    predictions,
  )
  return {
    theme: bundle.ir.theme,
    label,
    config,
    predictions,
    predictionsSeed: predictions ? JSON.stringify(predictions) : undefined,
    expect: {
      identifiers: result.identifiers as Record<string, string>,
      colors: result.colors as Record<string, string>,
      style: result.style as Record<string, unknown>,
    },
  }
}

export function buildSelectionFixture(themes: ThemeBundle[]) {
  const cases: SelectionCase[] = []

  for (const theme of themes) {
    const categories = categoriesOf(theme)
    const byName = new Map(categories.map((c) => [c.category, c.items]))

    // Every seed, default configuration: the common path, and the same seeds
    // the vanilla PNG baselines use.
    for (const seed of SEEDS) {
      cases.push(runCase(theme, `seed:${seed}`, { seed }))
    }

    // No seed at all — exercises the undefined-random first-item fallback.
    cases.push(runCase(theme, 'no-seed', {}))

    // Explicit identifier overrides, one category at a time, so a failure names
    // the category rather than the whole config.
    for (const { category, items } of categories
      .filter((c) => c.items.length)
      .slice(0, 6)) {
      const pick = representative(items)
      if (!pick) continue
      cases.push(
        runCase(theme, `explicit:${category}=${pick}`, {
          seed: 'explicit-identifier',
          [category]: pick,
        }),
      )
    }

    // Explicit colour overrides, including one on a category that is the source
    // of a connectedColors link, to prove dependents follow the override.
    const connectedSource = theme.ir.connectedColors[0]?.[1]
    const colorTargets = [
      ...new Set([
        connectedSource,
        ...theme.ir.categories.slice(0, 3).map((c) => c.category),
      ]),
    ].filter((c): c is string => Boolean(c))
    for (const category of colorTargets) {
      cases.push(
        runCase(theme, `explicit-color:${category}`, {
          seed: 'explicit-color',
          [`${category}Color`]: '#123456',
        }),
      )
    }

    // Style overrides.
    cases.push(
      runCase(theme, 'style-overrides', {
        seed: 'style',
        backgroundColor: '#abcdef',
        borderRadius: '25%',
      }),
    )
    cases.push(
      runCase(theme, 'numeric-radius', { seed: 'style', borderRadius: 24 }),
    )

    // Numeric seeds, which go through `String(seed)` and are a known formatting
    // divergence between JS and Swift.
    cases.push(runCase(theme, 'numeric-seed:1', { seed: 1 }))
    cases.push(runCase(theme, 'numeric-seed:42', { seed: 42 }))

    // Predictions replace the seed entirely with JSON.stringify(predictions).
    if (theme.ir.predictorMappings) {
      for (const [index, predictions] of PREDICTION_CASES.entries()) {
        cases.push(
          runCase(
            theme,
            `predictions:${index}`,
            { seed: 'ignored' },
            predictions,
          ),
        )
      }
    }

    // A combined config, to catch interactions the isolated cases miss.
    const hair = byName.get('hair')
    const combined: Record<string, unknown> = { seed: 'combined' }
    if (hair?.length) {
      const pick = representative(hair)
      if (pick) combined.hair = pick
    }
    combined.headColor = '#f0c8a0'
    combined.backgroundColor = '#202020'
    cases.push(runCase(theme, 'combined', combined))
  }

  return { themes: themes.map(toFixtureTheme), cases }
}
