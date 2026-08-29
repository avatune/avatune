/**
 * Visual parity between the Swift renderer and the web renderer.
 *
 * Compares against the PNG baselines already committed for `@avatune/vanilla`,
 * so both renderers are held to the same pictures and no second corpus of
 * snapshots has to be maintained.
 *
 * Requires a Swift toolchain and CoreGraphics, so it is skipped anywhere else —
 * the ubuntu CI job runs the numeric suites and this stays a pre-release step on
 * a Mac. `swift/README.md` documents it.
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { SEEDS } from '../../vanilla/src/seeds'
import { CHANNEL_TOLERANCE, thresholdFor } from './thresholds'

const REPO_ROOT = join(import.meta.dir, '..', '..', '..')
const SWIFT_DIR = join(REPO_ROOT, 'swift')
const BASELINES = join(
  REPO_ROOT,
  'tests',
  'vanilla',
  'src',
  '__snapshots__',
  'seed',
)
const TMP = join(import.meta.dir, '..', '.tmp')
const SIZE = 400

function hasSwift(): boolean {
  if (process.platform !== 'darwin') return false
  try {
    execFileSync('swift', ['--version'], { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

/** Themes with committed seed baselines, discovered rather than hardcoded. */
function baselineThemes(): string[] {
  if (!existsSync(BASELINES)) return []
  const { readdirSync } = require('node:fs') as typeof import('node:fs')
  return readdirSync(BASELINES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

interface Comparison {
  differingPercent: number
  meanError: number
}

async function compare(a: string, b: string): Promise<Comparison> {
  const [left, right] = await Promise.all(
    [a, b].map((path) =>
      sharp(path)
        .flatten({ background: '#ffffff' })
        .raw()
        .toBuffer({ resolveWithObject: true }),
    ),
  )

  if (
    left.info.width !== right.info.width ||
    left.info.height !== right.info.height
  ) {
    return { differingPercent: 100, meanError: 255 }
  }

  const channels = left.info.channels
  const pixels = left.data.length / channels
  let differing = 0
  let total = 0

  for (let index = 0; index < pixels; index++) {
    const offset = index * channels
    let worst = 0
    let sum = 0
    for (let channel = 0; channel < 3; channel++) {
      const delta = Math.abs(
        left.data[offset + channel] - right.data[offset + channel],
      )
      if (delta > worst) worst = delta
      sum += delta
    }
    total += sum / 3
    if (worst > CHANNEL_TOLERANCE) differing += 1
  }

  return {
    differingPercent: (differing / pixels) * 100,
    meanError: total / pixels,
  }
}

/** Writes a side-by-side plus difference image, so a failure is inspectable. */
async function writeDiff(name: string, baseline: string, rendered: string) {
  const width = SIZE * 3 + 16
  await sharp({
    create: {
      width,
      height: SIZE,
      channels: 3,
      background: { r: 220, g: 220, b: 220 },
    },
  })
    .composite([
      {
        input: await sharp(baseline).flatten({ background: '#fff' }).toBuffer(),
        left: 0,
        top: 0,
      },
      {
        input: await sharp(rendered).flatten({ background: '#fff' }).toBuffer(),
        left: SIZE + 8,
        top: 0,
      },
      {
        input: await sharp(baseline)
          .flatten({ background: '#fff' })
          .composite([
            {
              input: await sharp(rendered)
                .flatten({ background: '#fff' })
                .toBuffer(),
              blend: 'difference',
            },
          ])
          .negate()
          .toBuffer(),
        left: SIZE * 2 + 16,
        top: 0,
      },
    ])
    .png()
    .toFile(join(TMP, `${name}.diff.png`))
}

const enabled = hasSwift()
const themes = baselineThemes()

// Generous: this builds the Swift package and renders every avatar, which is
// far past bun's default hook timeout.
//
// The guard is repeated here rather than left to the `describe.skipIf`s below:
// a top-level `beforeAll` runs even when every suite in the file is skipped, so
// without it the ubuntu CI job builds the snapshot tool and fails on the AppKit
// it has no way to provide.
beforeAll(() => {
  if (!enabled || themes.length === 0) return

  rmSync(TMP, { recursive: true, force: true })
  mkdirSync(TMP, { recursive: true })

  const jobs = themes.flatMap((theme) =>
    SEEDS.map((seed, index) => ({
      theme,
      seed,
      name: `${theme}-seed-${index + 1}`,
      size: SIZE,
    })),
  )
  const jobsPath = join(TMP, 'jobs.json')
  writeFileSync(jobsPath, JSON.stringify(jobs))

  // Built in release: a debug build spends more time in the SVG parser than
  // the whole comparison takes.
  execFileSync(
    'swift',
    [
      'build',
      '-c',
      'release',
      '--product',
      'AvatuneSnapshot',
      '--package-path',
      SWIFT_DIR,
    ],
    { stdio: 'inherit' },
  )
  execFileSync(
    join(SWIFT_DIR, '.build', 'release', 'AvatuneSnapshot'),
    [jobsPath, TMP],
    // The exported SVG is compared too, so the snapshot tool writes both.
    { stdio: 'inherit', env: { ...process.env, AVATUNE_EMIT_SVG: '1' } },
  )
}, 600_000)

afterAll(() => {
  if (!process.env.CI && !process.env.KEEP_SWIFT_DIFFS) {
    rmSync(TMP, { recursive: true, force: true })
  }
})

describe.skipIf(!enabled || themes.length === 0)('Swift visual parity', () => {
  for (const theme of themes) {
    describe(theme, () => {
      const threshold = thresholdFor(theme)

      for (const [index, seed] of SEEDS.entries()) {
        const name = `${theme}-seed-${index + 1}`

        test(`${name} (${seed})`, async () => {
          const baseline = join(BASELINES, theme, `${name}.png`)
          const rendered = join(TMP, `${name}.png`)

          expect(existsSync(baseline)).toBe(true)
          expect(existsSync(rendered)).toBe(true)

          const result = await compare(baseline, rendered)
          if (
            result.differingPercent > threshold.maxDifferingPercent ||
            result.meanError > threshold.maxMeanError
          ) {
            await writeDiff(name, baseline, rendered)
          }

          expect(result.differingPercent).toBeLessThanOrEqual(
            threshold.maxDifferingPercent,
          )
          expect(result.meanError).toBeLessThanOrEqual(threshold.maxMeanError)
        })
      }
    })
  }
})

describe.skipIf(!enabled || themes.length === 0)('Swift SVG export', () => {
  // `ResolvedAvatar.svg(size:)` recomposes a document from the same fragments
  // the renderer draws, re-attaching the blend modes and filters that were
  // hoisted out for native drawing. Rendering that export with the same engine
  // that produced the baselines isolates the exporter from Core Graphics
  // entirely: a difference here is a composition bug, not antialiasing.
  for (const theme of themes) {
    describe(theme, () => {
      const threshold = thresholdFor(theme)

      for (const [index, seed] of SEEDS.entries()) {
        const name = `${theme}-seed-${index + 1}`

        test(`${name} (${seed})`, async () => {
          const baseline = join(BASELINES, theme, `${name}.png`)
          const exported = join(TMP, `${name}.svg`)
          expect(existsSync(exported)).toBe(true)

          const result = await compare(baseline, exported)
          expect(result.differingPercent).toBeLessThanOrEqual(
            threshold.maxDifferingPercent,
          )
          expect(result.meanError).toBeLessThanOrEqual(threshold.maxMeanError)
        })
      }
    })
  }
})
