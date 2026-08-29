/**
 * Fixture for the generated artwork templates.
 *
 * The Swift modules carry roughly two megabytes of SVG embedded as raw string
 * literals. The hazard there is not logic but transcription: a raw-literal fence
 * that the content can close early, a dropped escape, a segment joined in the
 * wrong order. All of those produce Swift that compiles perfectly and renders
 * nothing like the web.
 *
 * So this records, for every item, the length and hash of the SVG the template
 * should rebuild at a known colour. Hashes keep the fixture small enough to
 * commit; a handful of full samples are included for the shapes most likely to
 * break, since a hash mismatch alone is a poor error message.
 */

import { hashString } from '@avatune/utils'
import { renderFragment } from '../avatune-ir/build-theme-ir'
import type { ThemeIR } from '../avatune-ir/types'

/** Unlike any probe colour, so a slot frozen at generation time is caught. */
export const ARTWORK_COLOR = '#7a3ec8'

export interface ArtworkRow {
  theme: string
  category: string
  key: string
  /** One entry per fragment, in draw order. */
  fragments: Array<{ length: number; hash: number }>
}

export interface ArtworkSample extends ArtworkRow {
  svgs: string[]
  why: string
}

function shouldSample(
  category: string,
  svgs: string[],
  slots: number,
  effects: number,
): string | undefined {
  if (svgs.length > 1) return 'splits into multiple fragments'
  if (effects > 0) return 'carries a native effect'
  if (slots >= 8) return 'many colour slots'
  // A literal `"#` sequence is exactly what closes a single-pound raw string
  // early, so at least one item containing it is always sampled in full.
  if (svgs[0]?.includes('"#') && category === 'head')
    return 'contains a quote-hash sequence'
  return undefined
}

export function buildArtworkFixture(themes: ThemeIR[]) {
  const rows: ArtworkRow[] = []
  const samples: ArtworkSample[] = []

  for (const ir of themes) {
    for (const category of ir.categories) {
      for (const item of category.items) {
        if (item.fragments.length === 0) continue

        const svgs = item.fragments.map((fragment) =>
          renderFragment(fragment, ARTWORK_COLOR),
        )
        const row: ArtworkRow = {
          theme: ir.theme,
          category: category.category,
          key: item.key,
          fragments: svgs.map((svg) => ({
            length: svg.length,
            hash: hashString(svg),
          })),
        }
        rows.push(row)

        const slots = item.fragments.reduce((n, f) => n + f.slots.length, 0)
        const effects = item.fragments.reduce((n, f) => n + f.effects.length, 0)
        const why = shouldSample(category.category, svgs, slots, effects)
        if (why && samples.length < 24) samples.push({ ...row, svgs, why })
      }
    }
  }

  return { color: ARTWORK_COLOR, rows, samples }
}
