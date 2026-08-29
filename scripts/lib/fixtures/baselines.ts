/**
 * Copies a sample of the web renderer's PNG baselines into the Swift package.
 *
 * Two reasons this is worth the committed bytes:
 *
 *  - The mirrored `avatune-swift` repository contains only `swift/`, so a suite
 *    reaching into `tests/vanilla` would have nothing to compare against there.
 *    Bundling makes the package self-verifying wherever it lands.
 *  - The full visual-parity run needs a Mac and a Swift toolchain. These run
 *    anywhere `swift test` does, including the iOS simulator, which is the one
 *    platform the macOS suite cannot speak for.
 *
 * One seed per theme, not the whole corpus: this is a tripwire for a renderer
 * that has gone wrong on a platform, not a replacement for the 400-avatar run.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs'
import { join } from 'node:path'

/** Index into `tests/vanilla/src/seeds.ts`, one representative avatar. */
const SEED_INDEX = 1

export interface BaselineRow {
  theme: string
  seed: string
  /** File name inside the fixtures directory. */
  file: string
  size: number
}

export function copyBaselines(
  baselinesDir: string,
  destination: string,
  seeds: readonly string[],
): { rows: BaselineRow[]; copied: number } {
  if (!existsSync(baselinesDir)) return { rows: [], copied: 0 }

  // Cleared first so a removed theme cannot leave a stale PNG that the suite
  // would happily keep comparing against.
  rmSync(destination, { recursive: true, force: true })
  mkdirSync(destination, { recursive: true })

  const themes = readdirSync(baselinesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const rows: BaselineRow[] = []
  let copied = 0

  for (const theme of themes) {
    const name = `${theme}-seed-${SEED_INDEX + 1}.png`
    const source = join(baselinesDir, theme, name)
    if (!existsSync(source)) continue

    copyFileSync(source, join(destination, name))
    copied += 1
    rows.push({
      theme,
      seed: seeds[SEED_INDEX],
      file: name,
      // The vanilla suite renders its baselines at 400px.
      size: 400,
    })
  }

  return { rows, copied }
}
