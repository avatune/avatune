/**
 * Proves the Swift generator's SVG transformation loses nothing.
 *
 * The native renderers do not draw from a description of the artwork — they
 * rebuild the item's SVG from a template and hand it to an SVG engine. So the
 * question this suite answers is narrow and total: for every item, does the
 * rebuilt SVG render the same as what `item.code()` produces?
 *
 * That covers, in one assertion per item, all three build-time transforms:
 * colour tokenisation, alpha-mask normalisation, and fragment splitting. It runs
 * under sharp and needs no Swift toolchain, so it gates the generator on any
 * machine.
 */

import { afterAll, describe, expect, test } from 'bun:test'
import { join } from 'node:path'
import { colord } from 'colord'
import sharp from 'sharp'
import {
  buildThemeIR,
  PROBE_COLORS,
  renderFragment,
} from '../../../scripts/lib/avatune-ir/build-theme-ir'
import { harvestColorChains } from '../../../scripts/lib/avatune-ir/color-chains'
import { loadThemes } from '../../../scripts/lib/avatune-ir/load-themes'
import type { FragmentIR, ItemIR } from '../../../scripts/lib/avatune-ir/types'

/** A colour unlike any probe, so a slot frozen to a probe value is caught. */
const VERIFY_COLOR = '#7a3ec8'

/** Effects are hoisted out of the SVG, so the comparison strips them too. */
function stripEffects(svg: string): string {
  return svg
    .replace(/\s*filter="url\(#[^"]*\)"/g, '')
    .replace(/style="([^"]*)"/g, (_match, body: string) => {
      const kept = body
        .split(';')
        .filter(
          (d) => d.trim() !== '' && !d.trim().startsWith('mix-blend-mode'),
        )
      return kept.length > 0 ? `style="${kept.join(';')}"` : ''
    })
}

/**
 * Re-attaches a blend mode so the comparison exercises it. Filters cannot be
 * re-attached without rebuilding their whole graph, so items carrying one are
 * compared with effects stripped from both sides; their parameters are asserted
 * structurally instead, and their appearance by the Swift snapshot suite.
 */
function reattachBlend(svg: string, fragment: FragmentIR): string {
  const blend = fragment.effects.find((e) => e.kind === 'blend')
  if (!blend) return svg
  return svg.replace(
    /^(<svg\b[^>]*>)([\s\S]*)(<\/svg>)$/,
    (_m, open: string, body: string, close: string) =>
      `${open}<g style="mix-blend-mode:${blend.mode}">${body}</g>${close}`,
  )
}

/** Merges fragments back into one document, in draw order. */
function recombine(item: ItemIR, color: string): string {
  const rendered = item.fragments.map((fragment) =>
    reattachBlend(renderFragment(fragment, color), fragment),
  )
  if (rendered.length === 1) return rendered[0]

  const bodies = rendered.map((svg) =>
    svg.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>$/, ''),
  )
  const open = rendered[0].match(/^<svg\b[^>]*>/)?.[0] ?? '<svg>'
  return `${open}${bodies.join('')}</svg>`
}

async function raster(svg: string) {
  return sharp(Buffer.from(svg))
    .flatten({ background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true })
}

/** Worst per-channel difference; identical renders give 0. */
function worstDelta(
  a: { data: Buffer; info: sharp.OutputInfo },
  b: { data: Buffer; info: sharp.OutputInfo },
): number {
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    return Number.POSITIVE_INFINITY
  }
  let worst = 0
  const length = Math.min(a.data.length, b.data.length)
  for (let i = 0; i < length; i++) {
    const delta = Math.abs(a.data[i] - b.data[i])
    if (delta > worst) worst = delta
  }
  return worst
}

// `bun test` runs from the package directory, but the loaders resolve packages
// relative to the working directory by default.
const REPO_ROOT = join(import.meta.dir, '..', '..', '..')
const PACKAGES = join(REPO_ROOT, 'packages')

const themes = await loadThemes(PACKAGES)
const bundles = await Promise.all(
  themes.map(async (loaded) => ({
    loaded,
    ir: buildThemeIR(
      loaded,
      (await harvestColorChains(loaded.info.assetsPackageName, PACKAGES))
        .chains,
    ),
  })),
)

const failures: string[] = []

afterAll(() => {
  if (failures.length > 0) {
    console.error(`\n${failures.length} item(s) did not round-trip:`)
    for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`)
  }
})

describe('SVG template round-trip', () => {
  for (const { loaded, ir } of bundles) {
    describe(ir.theme, () => {
      for (const category of ir.categories) {
        for (const item of category.items) {
          const label = `${category.category}/${item.key}`

          test(label, async () => {
            const source = (
              loaded.module[category.category] as Record<
                string,
                { code: (props: { color: string; uid: string }) => string }
              >
            )[item.key]

            const original = source.code({
              color: VERIFY_COLOR,
              uid: 'avatune',
            })
            if (!original) {
              expect(item.fragments).toHaveLength(0)
              return
            }

            const rebuilt = recombine(item, VERIFY_COLOR)
            const hasFilter = original.includes('<filter')

            const [a, b] = await Promise.all([
              raster(hasFilter ? stripEffects(original) : original),
              raster(hasFilter ? stripEffects(rebuilt) : rebuilt),
            ])

            const delta = worstDelta(a, b)
            if (delta > 1)
              failures.push(`${ir.theme}/${label}: max channel delta ${delta}`)
            expect(delta).toBeLessThanOrEqual(1)
          })
        }
      }
    })
  }
})

/**
 * Composes an item the way `avatar()` does — a nested `<svg>` inside a
 * translated group over opaque backdrop — so a blend that reaches the canvas
 * shows up as a difference.
 */
function overBackdrop(body: string): string {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">' +
    '<rect width="600" height="600" fill="#e8b04a"/>' +
    `<g transform="translate(40,40)">${body}</g></svg>`
  )
}

describe('blend hoisting', () => {
  // A blend under a mask, filter or reduced opacity composites against that
  // group's own empty backdrop, so it never reaches the avatar beneath it.
  // Hoisting one of those to a native blend mode would apply an effect the web
  // renderer does not, so the generator has to tell the two cases apart.
  for (const { loaded, ir } of bundles) {
    for (const category of ir.categories) {
      for (const item of category.items) {
        const source = (
          loaded.module[category.category] as Record<
            string,
            { code: (props: { color: string; uid: string }) => string }
          >
        )[item.key]
        const original = source.code({ color: VERIFY_COLOR, uid: 'avatune' })
        if (!original?.includes('mix-blend-mode')) continue

        test(`${ir.theme}/${category.category}/${item.key}`, async () => {
          const hoisted = item.fragments.some((f) =>
            f.effects.some((e) => e.kind === 'blend'),
          )

          const withoutBlend = original
            .replace(/style="mix-blend-mode:[a-z]+"/g, '')
            .replace(/;?mix-blend-mode:[a-z]+/g, '')

          const [a, b] = await Promise.all([
            raster(overBackdrop(original)),
            raster(overBackdrop(withoutBlend)),
          ])
          const reachesCanvas = worstDelta(a, b) > 1

          expect(hoisted).toBe(reachesCanvas)
        })
      }
    }
  }
})

describe('colour slots', () => {
  test('every slot re-derives its colour from the theme colour alone', () => {
    for (const { ir } of bundles) {
      for (const category of ir.categories) {
        for (const item of category.items) {
          for (const fragment of item.fragments) {
            expect(fragment.segments).toHaveLength(fragment.slots.length + 1)
            for (const slot of fragment.slots) {
              if (slot.kind !== 'derived') continue
              // A derived slot must actually transform: an identity chain would
              // mean the classifier matched the wrong recipe.
              const applied = slot.ops
                .reduce(
                  (c, { op, amount }) => c[op](amount),
                  colord(VERIFY_COLOR),
                )
                .toHex()
              expect(applied).not.toBe(VERIFY_COLOR)
            }
          }
        }
      }
    }
  })

  test('templates are free of probe colours', () => {
    const probes = new Set(PROBE_COLORS.map((c) => c.toLowerCase()))
    for (const { ir } of bundles) {
      for (const category of ir.categories) {
        for (const item of category.items) {
          for (const fragment of item.fragments) {
            for (const segment of fragment.segments) {
              for (const probe of probes) {
                expect(segment.toLowerCase()).not.toContain(probe)
              }
            }
          }
        }
      }
    }
  })
})
