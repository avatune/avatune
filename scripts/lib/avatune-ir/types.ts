/**
 * Language-neutral intermediate representation for native Avatune renderers.
 *
 * This module is the Android reuse point: `emit-swift` consumes it today and a
 * future `emit-kotlin` will consume the same structures unchanged. Keep it free
 * of anything Swift-specific.
 *
 * The representation is a *tokenised SVG template* rather than a drawing tree.
 * Native renderers hand SVG to a real SVG engine, so the generator's job is not
 * to describe geometry — it is to make the SVG safe for that engine and to pull
 * out the two things an engine cannot do for us: substituting the per-avatar
 * colour, and applying effects the engine does not implement.
 *
 * Two invariants the emitters rely on:
 *
 * 1. Ordered arrays, never records, wherever JS insertion order is semantically
 *    load-bearing. `selectItems` iterates `Object.keys(colorPalettes)` and
 *    resolves `connectedColors` during that same loop, so a map would silently
 *    reorder colour resolution.
 * 2. Colour slots are proven, not guessed. A slot is only emitted when exactly
 *    one candidate recipe reproduces it across every probe colour.
 */

export const IR_VERSION = 2

export type ColorOpName =
  | 'lighten'
  | 'darken'
  | 'saturate'
  | 'desaturate'
  | 'rotate'

export type ColorOp = { op: ColorOpName; amount: number }

export type RGBA = [number, number, number, number]

export type LengthIR = { unit: 'points' | 'percent'; value: number }

/**
 * How one colour-dependent site in an item's SVG is derived from the category
 * colour the selector assigned.
 */
export type ColorSlotIR =
  | { kind: 'themeColor' }
  | { kind: 'derived'; ops: ColorOp[] }

/**
 * An effect the target SVG engine cannot apply, hoisted onto the fragment so
 * the native renderer can perform it with a platform call.
 */
export type EffectIR =
  | { kind: 'blend'; mode: 'multiply' | 'screen' }
  | {
      kind: 'dropShadow'
      dx: number
      dy: number
      stdDeviation: number
      color: RGBA
    }
  | { kind: 'blur'; stdDeviation: number }

/**
 * A slice of an item that can be drawn in one pass.
 *
 * Most items are a single fragment with no effects. An item is split only where
 * it carries a blend mode or a filter, because those have to be applied around
 * the draw rather than inside the SVG.
 *
 * `segments.length === slots.length + 1`; the SVG is rebuilt by interleaving
 * resolved colours between the segments.
 */
export interface FragmentIR {
  segments: string[]
  slots: ColorSlotIR[]
  /** Applied outermost-first around this fragment's draw. */
  effects: EffectIR[]
}

export interface ItemIR {
  key: string
  layer: number
  /** Resolved as `x = xAbs + size * xRatio`; all theme positions are linear. */
  position: { xAbs: number; xRatio: number; yAbs: number; yRatio: number }
  /** Intrinsic viewport, scaled by `size / theme.style.size` when drawn. */
  width: number
  height: number
  /** Empty for `none` items, whose `code()` returns an empty string. */
  fragments: FragmentIR[]
}

export interface CategoryIR {
  category: string
  /** Always an array, even where the theme declared a single colour. */
  palette: string[]
  /**
   * `Object.keys` order of the theme's item collection. Load-bearing.
   * May be empty: a theme can declare a palette for a category it has no
   * artwork for, and that category still receives a colour.
   */
  items: ItemIR[]
}

export interface ThemeStyleIR {
  size: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: LengthIR
}

export interface ThemeIR {
  irVersion: typeof IR_VERSION
  /** Short name, e.g. `kyute`. */
  theme: string
  /** Workspace package directory, e.g. `kyute-theme`. */
  packageName: string
  /** Provenance for generated-file headers. */
  npmVersion: string
  style: ThemeStyleIR
  backgroundPalette: string[]
  /** In palette-declaration order, which is the order selection iterates. */
  categories: CategoryIR[]
  /** Ordered [dependent, source] pairs. */
  connectedColors: Array<[string, string]>
  predictorMappings?: {
    hair?: Record<string, string[]>
    faceHair?: Record<string, string[]>
    hairColor?: Record<string, string[]>
    skinTone?: Record<string, string[]>
  }
}
