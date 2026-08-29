/**
 * Assembles the complete IR for a theme: ordering and palettes from the built
 * theme object, artwork from probe renders of each item.
 */

import { colord } from 'colord'
import type { ColorChain } from './color-chains'
import type { LoadedTheme, VanillaItem } from './load-themes'
import { probePosition, toArray, toLength } from './load-themes'
import { isPlainSvg, normalizeIds, splitFragments } from './svg-transform'
import { tokenize } from './tokenize'
import {
  type CategoryIR,
  type FragmentIR,
  IR_VERSION,
  type ItemIR,
  type ThemeIR,
  type ThemeStyleIR,
} from './types'

/**
 * Colours chosen to spread across hue, saturation and lightness so that no two
 * distinct operation chains agree on all of them.
 */
/** A theme's IR alongside the live module the fixtures still need. */
export interface ThemeBundle {
  loaded: LoadedTheme
  ir: ThemeIR
}

export const PROBE_COLORS = [
  '#ff0000',
  '#3a7bd5',
  '#12e28c',
  '#808080',
  '#c0a16b',
  '#4b0f2a',
  '#0f1e3c',
  '#e8d5c4',
]

const VIEWPORT = /^<svg\b[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"/

function readViewport(
  svg: string,
  label: string,
): { width: number; height: number } {
  const match = VIEWPORT.exec(svg)
  if (!match) {
    throw new Error(`${label}: root <svg> has no numeric width/height`)
  }
  return { width: Number(match[1]), height: Number(match[2]) }
}

function buildStyle(style: Record<string, unknown>): ThemeStyleIR {
  const borderWidth = style.borderWidth
  return {
    size: style.size as number,
    backgroundColor: style.backgroundColor as string | undefined,
    borderColor: style.borderColor as string | undefined,
    borderWidth:
      borderWidth === undefined
        ? undefined
        : typeof borderWidth === 'number'
          ? borderWidth
          : Number.parseFloat(String(borderWidth)) || 0,
    borderRadius: toLength(style.borderRadius),
  }
}

/**
 * Renders an item under every probe colour and reduces it to fragments.
 *
 * Items needing no transformation — the large majority — are tokenised from the
 * original string, so the generator never reserialises SVG it does not have to
 * touch.
 */
function buildArtwork(
  item: VanillaItem,
  chains: ColorChain[],
  label: string,
): { fragments: FragmentIR[]; width: number; height: number } {
  // Ids are normalised before anything else reads the SVG, so a rebuild that
  // only reshuffles random uid suffixes produces byte-identical output.
  const renders = PROBE_COLORS.map((color) =>
    normalizeIds(item.code({ color, uid: 'avatune' })),
  )
  if (!renders[0]) return { fragments: [], width: 0, height: 0 }

  const { width, height } = readViewport(renders[0], label)
  const fragments = buildFragments(renders, chains, label)
  return { fragments, width, height }
}

function buildFragments(
  renders: string[],
  chains: ColorChain[],
  label: string,
): FragmentIR[] {
  if (isPlainSvg(renders[0])) {
    const { segments, slots } = tokenize(renders, PROBE_COLORS, chains, label)
    return [{ segments, slots, effects: [] }]
  }

  const split = renders.map((render) => splitFragments(render, label))
  const counts = new Set(split.map((fragments) => fragments.length))
  if (counts.size !== 1) {
    throw new Error(
      `${label}: fragment count varies with the probe colour (${[...counts].join(' vs ')}). ` +
        `Splitting must depend only on structure.`,
    )
  }

  return split[0].map((fragment, index) => {
    const { segments, slots } = tokenize(
      split.map((fragments) => fragments[index].svg),
      PROBE_COLORS,
      chains,
      `${label} fragment ${index}`,
    )
    return { segments, slots, effects: fragment.effects }
  })
}

export function buildThemeIR(
  theme: LoadedTheme,
  chains: ColorChain[],
): ThemeIR {
  const { module, info } = theme

  // Load-bearing: selection iterates this exact key order and resolves
  // connectedColors against colours assigned earlier in the same pass.
  const paletteOrder = Object.keys(module.colorPalettes).filter(
    (key) => key !== 'background',
  )

  const categories: CategoryIR[] = paletteOrder.map((category) => {
    const collection = module[category] as
      | Record<string, VanillaItem>
      | undefined

    const items: ItemIR[] = Object.entries(collection ?? {}).map(
      ([key, item]) => {
        const label = `${info.name}/${category}.${key}`
        const { fragments, width, height } = buildArtwork(item, chains, label)

        return {
          key,
          layer: item.layer ?? 0,
          position: probePosition(item.position, label),
          width,
          height,
          fragments,
        }
      },
    )

    return {
      category,
      palette: toArray(module.colorPalettes[category]),
      items,
    }
  })

  return {
    irVersion: IR_VERSION,
    theme: info.name,
    packageName: info.packageName,
    npmVersion: theme.version,
    style: buildStyle(module.style as Record<string, unknown>),
    backgroundPalette: toArray(module.colorPalettes.background),
    categories,
    connectedColors: Object.entries(module.connectedColors ?? {}) as Array<
      [string, string]
    >,
    predictorMappings: module.predictorMappings,
  }
}

/**
 * Rebuilds a fragment's SVG for a given resolved colour — the same operation
 * the native renderers perform, kept here so the losslessness test can compare
 * a reconstructed item against what `item.code()` produces.
 */
export function renderFragment(fragment: FragmentIR, color: string): string {
  let out = fragment.segments[0]
  for (let index = 0; index < fragment.slots.length; index++) {
    const slot = fragment.slots[index]
    const value =
      slot.kind === 'themeColor'
        ? color
        : slot.ops
            .reduce((c, { op, amount }) => c[op](amount), colord(color))
            .toHex()
    out += value + fragment.segments[index + 1]
  }
  return out
}
