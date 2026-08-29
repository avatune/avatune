/**
 * Harvests the exact set of colour transformations an asset package can apply.
 *
 * Each asset package's `rslib.shared.ts` maps source hexes to build-time
 * expressions. Most are the identity `{color}`, but 70 of 586 items route the
 * theme colour through a colord chain. Because `item.code()` bakes the result
 * in, the generator cannot read a chain back out of the SVG — it has to know
 * the candidate set up front and identify each paint site by matching probe
 * renders against candidates evaluated with the real colord library.
 *
 * Harvesting the candidates (rather than guessing them) is what makes the
 * classification exact: a match is a proof, and an ambiguous or unmatched site
 * is an error rather than a coin flip.
 */

import { join } from 'node:path'
import type { ColorOp, ColorOpName } from './types'

/**
 * `{colord(color).rotate(-34).saturate(0.13).lighten(0.37).toHex()}`
 *
 * The `-?` is mandatory: 24 sites across miniavs, nevmstas and retro-cartoon
 * use negative `rotate` amounts, and without it they fail to match and surface
 * as "unresolved paint site" — a converter bug that isn't one.
 */
const CHAIN_PATTERN =
  /^\{colord\(color\)((?:\.[a-zA-Z]+\(-?[0-9.]+\))+)\.toHex\(\)\}$/

const OP_PATTERN = /\.([a-zA-Z]+)\((-?[0-9.]+)\)/g

const KNOWN_OPS = new Set<ColorOpName>([
  'lighten',
  'darken',
  'saturate',
  'desaturate',
  'rotate',
])

/** The identity expression: this paint site is the raw theme colour. */
const THEME_COLOR_EXPRESSION = '{color}'

export interface ColorChain {
  /** Stable key for deduplication and fixture naming, e.g. `lighten:0.53|desaturate:0.27`. */
  id: string
  ops: ColorOp[]
}

export function chainId(ops: ColorOp[]): string {
  return ops.map((o) => `${o.op}:${o.amount}`).join('|')
}

function parseChain(expression: string): ColorOp[] | null {
  const match = CHAIN_PATTERN.exec(expression)
  if (!match) return null

  const ops: ColorOp[] = []
  OP_PATTERN.lastIndex = 0
  for (const op of match[1].matchAll(OP_PATTERN)) {
    const name = op[1] as ColorOpName
    if (!KNOWN_OPS.has(name)) {
      throw new Error(
        `Unknown colord operation '${name}' in ${expression}. ` +
          `The native colour port implements ${[...KNOWN_OPS].join(', ')}; ` +
          `add it there and to ColorOperation.swift before using it in assets.`,
      )
    }
    ops.push({ op: name, amount: Number.parseFloat(op[2]) })
  }
  return ops
}

export interface HarvestedPackage {
  assetsPackage: string
  /** Distinct colord chains this package can produce. */
  chains: ColorChain[]
  /** Source hexes that map to the untransformed theme colour. */
  themeColorHexes: string[]
  /** Source hexes that map to a colord chain, keyed by chain id. */
  derivedHexes: Record<string, string[]>
}

/**
 * Imports an asset package's replacement map and extracts its colour grammar.
 *
 * Bun imports TypeScript directly, so this reads the authoring source rather
 * than a build artifact — the map is plain data with no bundler dependency.
 */
export async function harvestColorChains(
  assetsPackage: string,
  packagesDir: string = join(process.cwd(), 'packages'),
): Promise<HarvestedPackage> {
  const modulePath = join(
    packagesDir,
    'assets',
    assetsPackage,
    'rslib.shared.ts',
  )
  const module = (await import(modulePath)) as {
    getReplaceAttrValues?: (
      colorPropName?: string,
      uidPropName?: string,
    ) => Record<string, string>
  }

  if (typeof module.getReplaceAttrValues !== 'function') {
    throw new Error(
      `${assetsPackage}/rslib.shared.ts does not export getReplaceAttrValues(). ` +
        `The Swift generator needs it to identify colour-dependent paint sites; ` +
        `without it every derived colour would look like an unresolved site.`,
    )
  }

  const replacements = module.getReplaceAttrValues('color', 'uid')
  if (!replacements || typeof replacements !== 'object') {
    throw new Error(
      `${assetsPackage}: getReplaceAttrValues() returned ${typeof replacements}, expected an object.`,
    )
  }

  const byId = new Map<string, ColorChain>()
  const themeColorHexes: string[] = []
  const derivedHexes: Record<string, string[]> = {}

  for (const [source, expression] of Object.entries(replacements)) {
    // uid replacements are structural, not colour; ids are dropped by the
    // converter so they never reach the IR.
    if (!source.startsWith('#')) continue

    if (expression === THEME_COLOR_EXPRESSION) {
      themeColorHexes.push(source.toLowerCase())
      continue
    }

    const ops = parseChain(expression)
    if (!ops) continue

    const id = chainId(ops)
    if (!byId.has(id)) byId.set(id, { id, ops })
    if (!derivedHexes[id]) derivedHexes[id] = []
    derivedHexes[id].push(source.toLowerCase())
  }

  return {
    assetsPackage,
    chains: [...byId.values()],
    themeColorHexes,
    derivedHexes,
  }
}
