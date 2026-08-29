/**
 * Shared inputs for the generated parity fixtures.
 */

import type { AvatarPartCategory } from '@avatune/types'
// Reused rather than copied: the visual-regression baselines in tests/vanilla
// are rendered from this exact list, so the native parity fixtures and the PNG
// snapshots stay describable by the same seed index.
import { SEEDS as VANILLA_SEEDS } from '../../../tests/vanilla/src/seeds'

export const SEEDS: readonly string[] = VANILLA_SEEDS

/**
 * Every category `selectItems` can derive a per-category random value for,
 * including `background`, which is drawn outside the main loop.
 */
export const SEED_CATEGORIES: readonly (AvatarPartCategory | 'background')[] = [
  'background',
  'accessories',
  'glasses',
  'hats',
  'hair',
  'faceDetails',
  'body',
  'ears',
  'eyebrows',
  'eyes',
  'faceHair',
  'forelock',
  'head',
  'mouth',
  'neck',
  'nose',
]

/**
 * Probe colours for classifying paint sites, and the stress inputs for the
 * colord port. Spread across hue, saturation and lightness so that no two
 * distinct operation chains agree on all of them.
 */
export const PROBE_COLORS: readonly string[] = [
  '#FF0000',
  '#3A7BD5',
  '#12E28C',
  '#808080',
  '#C0A16B',
  '#4B0F2A',
  '#0F1E3C',
  '#E8D5C4',
]

/**
 * Colours that exercise the branches a textbook HSL port gets wrong: the
 * saturation-zero guard, both lightness clamps, and colord's hue normalisation
 * where a hue of 0 comes back as 360.
 */
export const COLOR_EDGE_CASES: readonly string[] = [
  '#000000',
  '#ffffff',
  '#010101',
  '#fefefe',
  '#7f7f7f',
  '#808080',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#00ffff',
  '#ff00ff',
  '#ffff00',
  '#010000',
  '#fffefe',
  '#123456',
]
