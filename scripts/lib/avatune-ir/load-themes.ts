/**
 * Loads built theme packages.
 *
 * The built artifact is the only correct source for the identifier -> asset
 * binding: filename conventions disagree with theme identifiers for 119 of 606
 * items (kebab/camel drift, categories that borrow another folder's SVGs, one
 * asset package serving two themes, and typos frozen into filenames). Only
 * `withComponents` in each theme's `vanilla.ts` knows the real mapping, so we
 * import and execute `dist/vanilla.js` rather than parsing sources.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { discoverThemes, type ThemeInfo } from '../../shared'
import type { LengthIR } from './types'

export interface VanillaItem {
  position:
    | { x: number; y: number }
    | ((size: number) => { x: number; y: number })
  layer: number
  code: (props: { color?: string; uid?: string }) => string
}

export interface VanillaThemeModule {
  style: { size: number } & Record<string, unknown>
  colorPalettes: Record<string, string | string[]>
  connectedColors?: Record<string, string>
  predictorMappings?: Record<string, Record<string, string[]>>
  [category: string]: unknown
}

export interface LoadedTheme {
  info: ThemeInfo
  /** The live runtime theme object from `dist/vanilla.js`. */
  module: VanillaThemeModule
  version: string
}

/**
 * Recovers `{ abs, ratio }` from a position, which may be a constant or a
 * function of `size`. Every theme position is linear (verified across all 606
 * items), so two samples determine it; a third guards against future drift.
 */
export function probePosition(
  position: VanillaItem['position'],
  label: string,
) {
  const at = typeof position === 'function' ? position : () => position
  const p0 = at(0)
  const p1 = at(1000)
  const probe = at(377)

  const xRatio = (Number(p1.x) - Number(p0.x)) / 1000
  const yRatio = (Number(p1.y) - Number(p0.y)) / 1000
  const xAbs = Number(p0.x)
  const yAbs = Number(p0.y)

  const dx = Math.abs(xAbs + 377 * xRatio - Number(probe.x))
  const dy = Math.abs(yAbs + 377 * yRatio - Number(probe.y))
  if (dx > 1e-9 || dy > 1e-9) {
    throw new Error(
      `${label}: position is not linear in size (residual dx=${dx}, dy=${dy}). ` +
        `The native renderers resolve positions as 'abs + size * ratio'; a ` +
        `non-linear position needs an IR change, not a workaround.`,
    )
  }

  return { xAbs, xRatio, yAbs, yRatio }
}

export function toLength(value: unknown): LengthIR | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') return { unit: 'points', value }
  if (typeof value === 'string') {
    const numeric = Number.parseFloat(value)
    if (Number.isNaN(numeric)) return undefined
    return value.includes('%')
      ? { unit: 'percent', value: numeric }
      : { unit: 'points', value: numeric }
  }
  return undefined
}

export function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

/**
 * Imports every discoverable theme's built vanilla entrypoint.
 *
 * Throws when a build is missing rather than skipping the theme: a silently
 * absent theme would produce native output that looks complete but isn't.
 */
export async function loadThemes(
  packagesDir: string = join(process.cwd(), 'packages'),
): Promise<LoadedTheme[]> {
  const infos = discoverThemes(packagesDir)
  const missing: string[] = []
  const present: Array<{ info: ThemeInfo; dist: string; pkg: string }> = []

  for (const info of infos) {
    const themeDir = join(packagesDir, 'themes', info.packageName)
    const dist = join(themeDir, 'dist', 'vanilla.js')
    if (existsSync(dist)) {
      present.push({ info, dist, pkg: join(themeDir, 'package.json') })
    } else {
      missing.push(info.packageName)
    }
  }

  if (missing.length === infos.length) {
    throw new Error(
      `No theme has been built. Run 'bun run build' first — ` +
        `generate-swift reads packages/themes/*/dist/vanilla.js.`,
    )
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing build output for: ${missing.join(', ')}. ` +
        `Run 'bun run build' (or build those packages) before generating.`,
    )
  }

  const loaded: LoadedTheme[] = []
  for (const { info, dist, pkg } of present) {
    const module = ((await import(dist)) as { default: VanillaThemeModule })
      .default
    const version =
      (JSON.parse(readFileSync(pkg, 'utf-8')) as { version?: string })
        .version ?? '0.0.0'
    loaded.push({ info, module, version })
  }

  return loaded
}
