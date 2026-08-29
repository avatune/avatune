/**
 * Turns an item's SVG into a template with proven colour slots.
 *
 * `item.code()` bakes the avatar's colour into the SVG, so the generator cannot
 * read a recipe back out of the result. Instead it renders the item with several
 * adversarial probe colours and compares: any hex that varies with the probe is
 * colour-dependent, and its recipe is whichever candidate chain — harvested from
 * the asset package and evaluated with the real colord library — reproduces it
 * for *every* probe.
 *
 * That makes classification a proof rather than a heuristic. Zero matches or
 * more than one is a hard error; the generator never guesses.
 */

import { colord } from 'colord'
import type { ColorChain } from './color-chains'
import type { ColorSlotIR } from './types'

/** Hex colours, which are the only colour form that survives the asset build. */
const HEX = /(#[0-9a-fA-F]{3,8}\b)/

const normalizeHex = (value: string) => {
  const digits = value.slice(1).toLowerCase()
  if (digits.length === 3 || digits.length === 4) {
    return `#${[...digits].map((d) => d + d).join('')}`
  }
  return `#${digits}`
}

export interface Template {
  segments: string[]
  slots: ColorSlotIR[]
}

/**
 * @param renders one SVG per probe colour, in the same order as `probes`
 */
export function tokenize(
  renders: string[],
  probes: string[],
  chains: ColorChain[],
  label: string,
): Template {
  const parts = renders.map((render) => render.split(HEX))

  const lengths = new Set(parts.map((p) => p.length))
  if (lengths.size !== 1) {
    throw new Error(
      `${label}: probe renders differ structurally (${[...lengths].join(' vs ')} tokens). ` +
        `Only colours may vary with the probe colour.`,
    )
  }

  const expected = chains.map((chain) => ({
    chain,
    values: probes.map((probe) =>
      normalizeHex(
        chain.ops
          .reduce((color, { op, amount }) => color[op](amount), colord(probe))
          .toHex(),
      ),
    ),
  }))
  const probeValues = probes.map(normalizeHex)

  const segments: string[] = []
  const slots: ColorSlotIR[] = []
  let buffer = ''

  for (let index = 0; index < parts[0].length; index++) {
    const values = parts.map((p) => p[index])
    const distinct = new Set(values)

    if (distinct.size === 1) {
      buffer += values[0]
      continue
    }

    if (
      !HEX.test(parts[0][index]) ||
      !/^#[0-9a-fA-F]{3,8}$/.test(parts[0][index])
    ) {
      throw new Error(
        `${label}: non-colour text varies with the probe colour at token ${index}. ` +
          `The template can only parameterise colours.`,
      )
    }

    const observed = values.map(normalizeHex)

    if (observed.every((value, i) => value === probeValues[i])) {
      segments.push(buffer)
      buffer = ''
      slots.push({ kind: 'themeColor' })
      continue
    }

    const matches = expected.filter((candidate) =>
      candidate.values.every((value, i) => value === observed[i]),
    )

    if (matches.length === 1) {
      segments.push(buffer)
      buffer = ''
      slots.push({ kind: 'derived', ops: matches[0].chain.ops })
      continue
    }

    throw new Error(
      matches.length === 0
        ? `${label}: colour slot ${slots.length} matches no known chain ` +
            `(observed ${observed.slice(0, 3).join(', ')}...). The asset package's ` +
            `getReplaceAttrValues() may have gained an expression the parser does not read.`
        : `${label}: colour slot ${slots.length} is ambiguous — ${matches.length} chains ` +
            `reproduce it (${matches.map((m) => m.chain.id).join(', ')}). Add a probe colour ` +
            `that separates them.`,
    )
  }

  segments.push(buffer)
  return { segments, slots }
}
