/**
 * Fixture for the seeded-random port.
 *
 * `hashString` and `seededRandom` are imported from `@avatune/utils` rather
 * than reimplemented here, so the expected values are produced by the same code
 * the web renderers run.
 *
 * The three hazards this fixture exists to pin down:
 *
 *  - `charCodeAt` walks UTF-16 code units, so Swift must iterate `String.utf16`
 *    rather than `unicodeScalars`. Emoji and other non-BMP characters hash
 *    differently under the two.
 *  - `Math.abs(-2147483648)` is 2147483648 in JS but traps in Swift for Int32,
 *    so the hash must widen to Int64 before taking the absolute value.
 *  - The LCG's intermediate `value * 9301 + 49297` peaks around 2.17e9 for a
 *    plain seed and reaches ~1.9e13 for a hashed one — well past Int32.
 */

import { hashString, seededRandom } from '@avatune/utils'
import { SEED_CATEGORIES, SEEDS } from './inputs'

export interface RandomRow {
  input: string
  /** Result of `hashString`, which is already `Math.abs`-ed. */
  hash: number
  /** First three draws of `seededRandom(input)`. */
  values: [number, number, number]
  note?: string
}

export interface NumberFormatRow {
  value: number
  /** `String(value)`, which Swift's `Double.description` does not match. */
  text: string
  note?: string
}

/**
 * Hashes to exactly Int32.min, making `Math.abs` overflow a 32-bit signed
 * integer. Found by solving the recurrence backwards; a naive Int32 port traps
 * on this input.
 */
const INT32_MIN_HASH_INPUT = 'ysoa29udd蓢'

const EDGE_CASE_INPUTS: Array<{ input: string; note: string }> = [
  { input: '', note: 'empty string hashes to 0' },
  { input: 'a', note: 'single ASCII code unit' },
  {
    input: INT32_MIN_HASH_INPUT,
    note: 'raw hash is Int32.min; Math.abs overflows Int32',
  },
  {
    input: '👩🏽‍🚀',
    note: 'non-BMP + ZWJ + modifier: 7 UTF-16 units, 4 scalars',
  },
  { input: '🎨🖌️', note: 'surrogate pairs must hash as code units' },
  { input: 'Àéïøü-unicode-test', note: 'BMP accents, already used as a seed' },
  { input: '日本語のシード', note: 'CJK, single-unit BMP' },
  // A lone surrogate is deliberately excluded: JSON.stringify emits it
  // unpaired, and strict decoders reject the result, so it cannot survive the
  // fixture round-trip. UTF-16 iteration is covered by the emoji cases above
  // and asserted directly in SeededRandomTests.
  {
    input: 'x'.repeat(512),
    note: 'long input drives the hash through many wraps',
  },
  { input: 'seed999', note: 'large positive hash; first LCG step ~1.8e13' },
]

const NUMBER_FORMAT_VALUES: Array<{ value: number; note: string }> = [
  { value: 0, note: 'Swift Double.description gives "0.0"' },
  { value: 1, note: 'Swift Double.description gives "1.0"' },
  { value: 42, note: 'integral seed, the common case' },
  { value: -7, note: 'negative integral' },
  { value: 1.5, note: 'non-integral round-trips identically' },
  { value: 0.1, note: 'shortest round-trip representation' },
  { value: 1e21, note: 'JS switches to exponent notation at 1e21' },
  { value: 1e-7, note: 'JS switches to exponent notation below 1e-6' },
  { value: 2 ** 53, note: 'largest exactly representable integer' },
]

function draw(input: string): [number, number, number] {
  const next = seededRandom(input)
  return [next(), next(), next()]
}

export function buildRandomFixture() {
  const rows: RandomRow[] = []
  const seen = new Set<string>()

  const push = (input: string, note?: string) => {
    if (seen.has(input)) return
    seen.add(input)
    rows.push({ input, hash: hashString(input), values: draw(input), note })
  }

  for (const { input, note } of EDGE_CASE_INPUTS) push(input, note)

  // The exact strings selectItems hashes: `${seed}-${category}-item` and
  // `${seed}-${category}-color` for every seed and category in the repo.
  for (const seed of SEEDS) {
    push(seed)
    for (const category of SEED_CATEGORIES) {
      push(`${seed}-${category}-item`)
      push(`${seed}-${category}-color`)
    }
  }

  const numbers: NumberFormatRow[] = NUMBER_FORMAT_VALUES.map(
    ({ value, note }) => ({ value, text: String(value), note }),
  )

  return { rows, numbers }
}
