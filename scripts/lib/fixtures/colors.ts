/**
 * Fixture for the colord port.
 *
 * This is the highest-value test in the native suite. colord does not use the
 * textbook HSL formulas — it converts RGB to HSV and derives HSL from that, and
 * `rotate` rounds the hue to an integer before adding. A port written from the
 * usual formulas is wrong by one or two units per channel almost everywhere,
 * which never fails loudly: it surfaces only as "the visual diff is slightly off
 * on every theme", by which point the cause is expensive to find.
 *
 * Expected values come from the real colord library, evaluated over every
 * operation chain the asset packages can produce plus single-operation sweeps,
 * crossed with every palette colour in the repo and deliberate edge cases.
 *
 * Rows are `[inputIndex, chainIndex, expectedHex]` rather than objects: the
 * cross product is ~16k rows, and the verbose form costs several megabytes of
 * committed diff noise for no added clarity.
 */

import { colord } from 'colord'
import type { ColorChain } from '../avatune-ir/color-chains'
import { chainId } from '../avatune-ir/color-chains'
import type { ColorOp, ColorOpName } from '../avatune-ir/types'
import { COLOR_EDGE_CASES } from './inputs'

export type ColorRow = [number, number, string]

export interface ColorConversionRow {
  input: string
  hsl: { h: number; s: number; l: number }
  hue: number
  hex: string
}

/** Amounts chosen to include the no-op, the clamps, and the values assets use. */
const SWEEP_AMOUNTS = [0, 0.01, 0.08, 0.25, 0.5, 1]
const SWEEP_ROTATIONS = [-360, -158, -34, -14, -7, 0, 3, 43, 90, 180, 190, 360]
const SWEEP_OPS: ColorOpName[] = ['lighten', 'darken', 'saturate', 'desaturate']

export function applyChain(input: string, ops: ColorOp[]): string {
  let value = colord(input)
  for (const { op, amount } of ops) {
    value = value[op](amount)
  }
  return value.toHex()
}

/**
 * Single-operation chains, so that when a multi-step chain disagrees the suite
 * also says which primitive drifted rather than only that the chain did.
 */
function sweepChains(): ColorChain[] {
  const chains: ColorChain[] = []
  for (const op of SWEEP_OPS) {
    for (const amount of SWEEP_AMOUNTS) {
      chains.push({ id: chainId([{ op, amount }]), ops: [{ op, amount }] })
    }
  }
  for (const amount of SWEEP_ROTATIONS) {
    chains.push({
      id: chainId([{ op: 'rotate', amount }]),
      ops: [{ op: 'rotate', amount }],
    })
  }
  return chains
}

export function buildColorFixture(
  harvested: ColorChain[],
  paletteColors: string[],
) {
  const inputs = [
    ...new Set(
      [...paletteColors, ...COLOR_EDGE_CASES].map((c) => c.toLowerCase()),
    ),
  ].sort()

  const chains = [
    ...new Map([...harvested, ...sweepChains()].map((c) => [c.id, c])).values(),
  ].sort((a, b) => a.id.localeCompare(b.id))

  const rows: ColorRow[] = []
  for (const [chainIndex, chain] of chains.entries()) {
    for (const [inputIndex, input] of inputs.entries()) {
      rows.push([inputIndex, chainIndex, applyChain(input, chain.ops)])
    }
  }

  // Raw conversions, so a broken port fails at the RGB<->HSL boundary rather
  // than several layers up inside a chain.
  const conversions: ColorConversionRow[] = inputs.map((input) => {
    const value = colord(input)
    const hsl = value.toHsl()
    return {
      input,
      hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
      hue: value.hue(),
      hex: value.toHex(),
    }
  })

  return {
    inputs,
    chains: chains.map((c) => ({ id: c.id, ops: c.ops })),
    rows,
    conversions,
  }
}
