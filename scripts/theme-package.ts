/**
 * Readers for an existing theme package pair (`<name>-theme` + its assets), used
 * by the scripts that move a theme in and out of Avatune Studio.
 */

import { existsSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import type {
  ThemeFillBinding,
  ThemeFillBindings,
} from '../apps/studio/src/types'
import {
  applyThemeFillBinding,
  getSvgFillParts,
  parseColordChain,
} from '../apps/studio/src/utils/svgColors'

export interface ThemePackage {
  name: string
  themeDirectory: string
  assetsDirectory: string
  assetsPackage: string
  /** `${category}.${identifier}` → SVG path relative to the assets package src. */
  svgPathByItem: Map<string, string>
  /** Literal SVG attribute value → the build's `{color}` or colord expression. */
  replacements: Record<string, string>
}

const readBalancedBraces = (source: string, start: number) => {
  let depth = 0
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    else if (source[index] === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start + 1, index)
    }
  }
  throw new Error('Unbalanced braces in vanilla.ts')
}

/**
 * `vanilla.ts` binds each item identifier to an SVG import, and names the assets
 * package it imports them from — the only place that pairing is written down.
 */
const readItemIdentifiers = (vanillaSource: string) => {
  const assetsPackage = vanillaSource.match(
    /from '(@avatune\/[\w-]+-assets)'/,
  )?.[1]
  if (!assetsPackage) {
    throw new Error('Could not find the assets package import in vanilla.ts')
  }

  const identifiers = new Map<string, string>()
  for (const block of vanillaSource.matchAll(
    /\.withComponents\(\s*'(\w+)'\s*,\s*\{/g,
  )) {
    const body = readBalancedBraces(
      vanillaSource,
      (block.index ?? 0) + block[0].length - 1,
    )
    for (const entry of body.matchAll(/(\w+):\s*\{\s*code:\s*(\w+)/g)) {
      identifiers.set(`${block[1]}.${entry[1]}`, entry[2])
    }
  }

  return { assetsPackage, identifiers }
}

/** `svg.ts` maps each import identifier to the SVG file it was loaded from. */
const readSvgPaths = (svgSource: string) => {
  const paths = new Map<string, string>()
  for (const match of svgSource.matchAll(
    /import\s+(\w+)\s+from\s+'\.\/([^']+\.svg)\?raw'/g,
  )) {
    paths.set(match[1], match[2])
  }
  return paths
}

export const resolveThemeDirectory = (repoRoot: string, themeName: string) =>
  resolve(repoRoot, 'packages', 'themes', `${themeName}-theme`)

export const readThemePackage = async (
  repoRoot: string,
  themeName: string,
): Promise<ThemePackage> => {
  const themeDirectory = resolveThemeDirectory(repoRoot, themeName)
  const vanillaPath = resolve(themeDirectory, 'src', 'vanilla.ts')
  if (!existsSync(vanillaPath)) {
    throw new Error(`No vanilla.ts in ${resolve(themeDirectory, 'src')}`)
  }

  const { assetsPackage, identifiers } = readItemIdentifiers(
    readFileSync(vanillaPath, 'utf8'),
  )
  const assetsDirectory = resolve(
    repoRoot,
    'packages',
    'assets',
    basename(assetsPackage),
  )
  const svgPaths = readSvgPaths(
    readFileSync(resolve(assetsDirectory, 'src', 'svg.ts'), 'utf8'),
  )
  const { getReplaceAttrValues } = await import(
    resolve(assetsDirectory, 'rslib.shared.ts')
  )

  const svgPathByItem = new Map<string, string>()
  for (const [item, identifier] of identifiers) {
    const path = svgPaths.get(identifier)
    if (path) svgPathByItem.set(item, path)
  }

  return {
    name: themeName,
    themeDirectory,
    assetsDirectory,
    assetsPackage,
    svgPathByItem,
    replacements: getReplaceAttrValues('color', 'uid'),
  }
}

export const readItemSvg = (
  themePackage: ThemePackage,
  svgPath: string,
): string =>
  readFileSync(resolve(themePackage.assetsDirectory, 'src', svgPath), 'utf8')

/**
 * The asset build replaces literal fill values with `{color}` or a colord chain,
 * matching the raw SVG's hex exactly. Reading the same map back turns each
 * themed fill into the Studio binding that produced it.
 */
const toFillBinding = (replacement: string): ThemeFillBinding | null => {
  const expression = replacement.replace(/^\{|\}$/g, '')
  if (expression === 'color') return { type: 'primary' }

  const chain = parseColordChain(
    expression.replace(/^colord\(color\)/, 'colord(themeColor)'),
  )
  return chain ? { type: 'custom', ...chain } : null
}

const FILL_ATTRIBUTES = /(\sfill\s*=\s*)(["'])(.*?)\2/g
const SENTINEL_BASE = 0xe00000

/**
 * A themed fill is written as a literal hex in hand-drawn assets but as
 * `currentColor` in ones Studio generated, and Studio's indexer ignores
 * `currentColor`. Swapping every themed fill for a unique sentinel colour first
 * gives both origins the same index space, then the sentinels become the plain
 * colour the asset shows before a palette is applied.
 */
export const readThemedFills = (
  svg: string,
  replacements: Record<string, string>,
  previewColor: string,
): { svg: string; bindings: ThemeFillBindings } => {
  const bindingByExpression = new Map<string, ThemeFillBinding>()
  for (const expression of new Set(Object.values(replacements))) {
    const binding = toFillBinding(expression)
    if (binding) bindingByExpression.set(expression, binding)
  }

  const expressions = [...bindingByExpression.keys()]
  const toSentinels = (offset: number) =>
    new Map(
      expressions.map((expression, index) => [
        expression,
        `#${(SENTINEL_BASE + offset + index).toString(16)}`,
      ]),
    )

  let sentinels = toSentinels(0)
  for (
    let offset = expressions.length;
    [...sentinels.values()].some((sentinel) =>
      svg.toLowerCase().includes(sentinel),
    );
    offset += expressions.length
  ) {
    sentinels = toSentinels(offset)
  }

  const marked = svg.replace(
    FILL_ATTRIBUTES,
    (attribute, prefix: string, quote: string, value: string) => {
      const sentinel = sentinels.get(replacements[value] ?? '')
      return sentinel ? `${prefix}${quote}${sentinel}${quote}` : attribute
    },
  )

  const bindingBySentinel = new Map(
    [...sentinels].map(([expression, sentinel]) => [
      sentinel,
      bindingByExpression.get(expression) as ThemeFillBinding,
    ]),
  )
  const bindings: ThemeFillBindings = {}
  for (const part of getSvgFillParts(marked)) {
    const binding = bindingBySentinel.get(part.value.toLowerCase())
    if (binding) bindings[part.index] = binding
  }

  let resolved = marked
  for (const [sentinel, binding] of bindingBySentinel) {
    resolved = resolved.replaceAll(
      sentinel,
      applyThemeFillBinding(previewColor, binding),
    )
  }

  return { svg: resolved, bindings }
}

export const hasThemedStroke = (
  svg: string,
  replacements: Record<string, string>,
): boolean =>
  [...svg.matchAll(/\sstroke\s*=\s*["']([^"']+)["']/g)].some(
    (match) => replacements[match[1]],
  )
