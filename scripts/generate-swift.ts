#!/usr/bin/env bun
/**
 * Generates the parity fixtures the native Avatune renderers are verified
 * against.
 *
 * Expected values are produced by the same code the web renderers run —
 * `selectItems` and `seededRandom` from `@avatune/utils`, and the real colord
 * library — so the fixtures describe actual behaviour rather than intended
 * behaviour. The Swift suite in swift/Tests/AvatuneCoreTests reads them; the
 * future Kotlin suite will read the same files.
 *
 * Requires a prior `bun run build`: theme metadata is read by importing each
 * package's built `dist/vanilla.js`, which is the only source that knows the
 * real identifier-to-asset binding.
 *
 * Usage: bun scripts/generate-swift.ts [--verbose]
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { buildThemeIR, type ThemeBundle } from './lib/avatune-ir/build-theme-ir'
import {
  type ColorChain,
  harvestColorChains,
} from './lib/avatune-ir/color-chains'
import { type LoadedTheme, loadThemes } from './lib/avatune-ir/load-themes'
import { emitSwiftSources } from './lib/emit-swift'
import { buildArtworkFixture } from './lib/fixtures/artwork'
import { copyBaselines } from './lib/fixtures/baselines'
import { buildColorFixture } from './lib/fixtures/colors'
import { SEEDS } from './lib/fixtures/inputs'
import { buildRandomFixture } from './lib/fixtures/random'
import { buildSelectionFixture } from './lib/fixtures/selection'

const SWIFT_DIR = join(process.cwd(), 'swift')
const FIXTURES_DIR = join(SWIFT_DIR, 'Tests', 'AvatuneCoreTests', 'Fixtures')
// Artwork is verified by the suite that can see the generated theme modules,
// and SwiftPM scopes resources to their own target.
const THEME_FIXTURES_DIR = join(
  SWIFT_DIR,
  'Tests',
  'AvatuneThemesTests',
  'Fixtures',
)

const HEADER = {
  generator: 'scripts/generate-swift.ts',
  warning:
    'AUTO-GENERATED. Do not edit by hand. Run `bun run generate:swift` to refresh.',
}

/** Writes only when content changes, so unrelated builds leave no diff. */
function writeIfChanged(
  path: string,
  content: string,
  verbose: boolean,
): boolean {
  let existing: string | undefined
  try {
    existing = readFileSync(path, 'utf-8')
  } catch {
    existing = undefined
  }
  if (existing === content) {
    if (verbose) console.log(`  unchanged  ${path}`)
    return false
  }
  writeFileSync(path, content, 'utf-8')
  console.log(`  ${existing === undefined ? 'created' : 'updated'}    ${path}`)
  return true
}

function writeJson(
  name: string,
  body: unknown,
  verbose: boolean,
  directory: string = FIXTURES_DIR,
): boolean {
  const content = `${JSON.stringify({ ...HEADER, ...(body as object) }, null, 2)}\n`
  return writeIfChanged(join(directory, name), content, verbose)
}

/**
 * Colour chains per asset package, so an item is only ever matched against the
 * chains its own package can produce. Two themes share pawel-olek-assets, so
 * packages are visited once.
 */
async function harvestChains(
  themes: LoadedTheme[],
  verbose: boolean,
): Promise<Map<string, ColorChain[]>> {
  const byPackage = new Map<string, ColorChain[]>()

  for (const assetsPackage of [
    ...new Set(themes.map((t) => t.info.assetsPackageName)),
  ].sort()) {
    const harvested = await harvestColorChains(assetsPackage)
    byPackage.set(assetsPackage, harvested.chains)
    if (verbose) {
      console.log(
        `  ${assetsPackage}: ${harvested.chains.length} chain(s), ` +
          `${harvested.themeColorHexes.length} theme-colour hex(es)`,
      )
    }
  }

  return byPackage
}

function allPaletteColors(bundles: ThemeBundle[]): string[] {
  const colors = new Set<string>()
  for (const { ir } of bundles) {
    for (const category of ir.categories) {
      for (const color of category.palette) colors.add(color)
    }
    for (const color of ir.backgroundPalette) colors.add(color)
  }
  return [...colors]
}

async function main() {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: { verbose: { type: 'boolean', default: false } },
  })
  const verbose = values.verbose ?? false

  const themes = await loadThemes()
  console.log(`Loaded ${themes.length} built theme(s).`)

  const chainsByPackage = await harvestChains(themes, verbose)

  const bundles: ThemeBundle[] = themes.map((loaded) => ({
    loaded,
    ir: buildThemeIR(
      loaded,
      chainsByPackage.get(loaded.info.assetsPackageName) ?? [],
    ),
  }))

  const chains = [
    ...new Map(
      [...chainsByPackage.values()].flat().map((c) => [c.id, c]),
    ).values(),
  ]
  const paletteColors = allPaletteColors(bundles)

  const fragments = bundles.flatMap((b) =>
    b.ir.categories.flatMap((c) => c.items.flatMap((i) => i.fragments)),
  )
  const slots = fragments.reduce((n, f) => n + f.slots.length, 0)
  const effects = fragments.filter((f) => f.effects.length > 0).length
  console.log(
    `Built IR: ${fragments.length} fragment(s), ${slots} colour slot(s), ` +
      `${effects} with native effect(s); ${chains.length} chain(s) over ${paletteColors.length} palette colour(s).`,
  )

  const emitted = emitSwiftSources(
    bundles.map((b) => b.ir),
    SWIFT_DIR,
  )
  console.log(
    `Swift sources: ${emitted.written} file(s) written, ${emitted.removed} stale removed, ` +
      `${(emitted.bytes / 1024 / 1024).toFixed(2)} MB total.`,
  )

  mkdirSync(FIXTURES_DIR, { recursive: true })
  mkdirSync(THEME_FIXTURES_DIR, { recursive: true })

  const selection = buildSelectionFixture(bundles)
  const colors = buildColorFixture(chains, paletteColors)
  const random = buildRandomFixture()
  const artwork = buildArtworkFixture(bundles.map((b) => b.ir))

  // Bundled so the package can verify itself without the JavaScript repo, and
  // so the iOS simulator has something absolute to compare against.
  const baselines = copyBaselines(
    join(process.cwd(), 'tests', 'vanilla', 'src', '__snapshots__', 'seed'),
    join(THEME_FIXTURES_DIR, 'Baselines'),
    SEEDS,
  )

  const changed = [
    writeJson('selection.json', selection, verbose),
    writeJson('colors.json', colors, verbose),
    writeJson('random.json', random, verbose),
    writeJson('artwork.json', artwork, verbose, THEME_FIXTURES_DIR),
    writeJson(
      'baselines.json',
      { rows: baselines.rows },
      verbose,
      THEME_FIXTURES_DIR,
    ),
  ].filter(Boolean).length

  console.log(
    `\nselection: ${selection.cases.length} case(s) across ${selection.themes.length} theme(s)`,
  )
  console.log(
    `colors:    ${colors.rows.length} row(s) over ${colors.chains.length} chain(s) x ${colors.inputs.length} colour(s), ${colors.conversions.length} conversion(s)`,
  )
  console.log(
    `random:    ${random.rows.length} hash row(s), ${random.numbers.length} number format row(s)`,
  )
  console.log(
    `artwork:   ${artwork.rows.length} item(s), ${artwork.samples.length} full sample(s)`,
  )
  console.log(`baselines: ${baselines.copied} reference image(s) bundled`)
  console.log(`${changed} file(s) written.`)
}

await main()
