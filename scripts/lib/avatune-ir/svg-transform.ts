/**
 * Makes an item's SVG safe for a native SVG engine, and pulls out the effects
 * such engines do not implement.
 *
 * Two transforms, both driven by what SwiftDraw actually supports:
 *
 *  - Alpha masks become equivalent luminance masks. Mask coverage is
 *    `luminance x alpha`, so painting the mask content white collapses it to
 *    `alpha` — exactly what `mask-type: alpha` means. Without this, an engine
 *    with no `mask-type` support reads the content's brightness as coverage,
 *    and since some mask content is filled with the *theme colour*, the mask
 *    would silently vary with the avatar's skin tone.
 *
 *  - Blend modes and filters are hoisted out of the SVG onto fragments, so the
 *    native renderer can apply them with a platform call around the draw.
 *    Splitting is safe because a nested `<svg>` does not isolate blending: the
 *    blended element composites against everything already on the canvas, which
 *    is what drawing a later fragment over an earlier one reproduces.
 */

import { type AnyNode, type Element, isTag, isText } from 'domhandler'
import { parseDocument } from 'htmlparser2'
import type { EffectIR, RGBA } from './types'

/** Elements that define paint or clipping rather than drawing anything. */
const DEFINITION_TAGS = new Set([
  'defs',
  'mask',
  'clippath',
  'filter',
  'lineargradient',
  'radialgradient',
  'pattern',
  'symbol',
  'style',
])

const SHAPE_TAGS = new Set([
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'polygon',
  'polyline',
  'text',
  'image',
  'use',
])

const tagOf = (node: Element) => node.name.toLowerCase()

const isDefinition = (node: AnyNode) =>
  isTag(node) && DEFINITION_TAGS.has(tagOf(node))

const isShape = (node: AnyNode) => isTag(node) && SHAPE_TAGS.has(tagOf(node))

function parseStyle(value: string | undefined): Map<string, string> {
  const declarations = new Map<string, string>()
  if (!value) return declarations
  for (const part of value.split(';')) {
    const index = part.indexOf(':')
    if (index === -1) continue
    declarations.set(part.slice(0, index).trim(), part.slice(index + 1).trim())
  }
  return declarations
}

function formatStyle(declarations: Map<string, string>): string | undefined {
  if (declarations.size === 0) return undefined
  return [...declarations].map(([k, v]) => `${k}:${v}`).join(';')
}

// MARK: - Serialisation

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

const escapeAttribute = (value: string) =>
  value.replace(/[&<>"]/g, (c) => XML_ESCAPES[c])

const escapeText = (value: string) =>
  value.replace(/[&<>]/g, (c) => XML_ESCAPES[c])

/**
 * Serialises a subtree, keeping only drawable nodes the predicate accepts plus
 * whatever is needed to reach them.
 *
 * Definitions are copied wholesale. Their contents are not part of any
 * fragment's draw order — a mask's shapes describe coverage, not paint — so
 * pruning inside one would quietly empty the mask and change what it clips.
 * Every fragment carries every definition, which costs a little duplication on
 * the handful of items that split and removes any chance of a dangling
 * `url(#...)`.
 */
function serialize(
  node: AnyNode,
  keep: (node: Element) => boolean,
  insideDefinition = false,
): string {
  if (isText(node)) return escapeText(node.data)
  if (!isTag(node)) return ''

  const definition = insideDefinition || isDefinition(node)

  if (!definition && isShape(node) && !keep(node)) return ''

  const children = node.children
    .map((child) => serialize(child, keep, definition))
    .join('')

  // A group that contributes nothing to this fragment and defines nothing is
  // dropped, so fragments stay small and diffable.
  if (
    !definition &&
    children === '' &&
    !isShape(node) &&
    tagOf(node) !== 'svg'
  ) {
    return ''
  }

  const attributes = Object.entries(node.attribs)
    .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
    .join('')

  return children === ''
    ? `<${node.name}${attributes}/>`
    : `<${node.name}${attributes}>${children}</${node.name}>`
}

// MARK: - Alpha masks

/**
 * Rewrites `mask-type: alpha` masks into equivalent white-painted luminance
 * masks. Verified against librsvg to be byte-identical for every affected item.
 */
export function normalizeAlphaMasks(root: AnyNode): boolean {
  let changed = false

  const paintWhite = (node: AnyNode) => {
    if (!isTag(node)) return
    for (const attribute of ['fill', 'stroke'] as const) {
      const value = node.attribs[attribute]
      if (value && value !== 'none' && !value.startsWith('url(')) {
        node.attribs[attribute] = '#fff'
      }
    }
    const style = parseStyle(node.attribs.style)
    for (const property of ['fill', 'stroke']) {
      const value = style.get(property)
      if (value && value !== 'none' && !value.startsWith('url(')) {
        style.set(property, '#fff')
      }
    }
    const formatted = formatStyle(style)
    if (formatted) node.attribs.style = formatted
    else delete node.attribs.style
    for (const child of node.children) paintWhite(child)
  }

  const visit = (node: AnyNode) => {
    if (!isTag(node)) return
    if (tagOf(node) === 'mask') {
      const style = parseStyle(node.attribs.style)
      if (style.get('mask-type') === 'alpha') {
        style.delete('mask-type')
        const formatted = formatStyle(style)
        if (formatted) node.attribs.style = formatted
        else delete node.attribs.style
        paintWhite(node)
        changed = true
      }
    }
    for (const child of node.children) visit(child)
  }

  visit(root)
  return changed
}

// MARK: - Effects

function parseBlend(node: Element): EffectIR | undefined {
  const style = parseStyle(node.attribs.style)
  const mode = style.get('mix-blend-mode')
  if (!mode) return undefined
  if (mode !== 'multiply' && mode !== 'screen') {
    throw new Error(
      `Unsupported mix-blend-mode '${mode}'. Add it to EffectIR and to the ` +
        `native renderers before using it in an asset.`,
    )
  }
  return { kind: 'blend', mode }
}

/**
 * Whether an element isolates its descendants from the backdrop.
 *
 * A blend inside an isolated group composites against that group's own empty
 * backdrop rather than the avatar beneath, which makes it a no-op at the canvas
 * level. Two of the seven blends in the corpus are isolated this way — hoisting
 * them to a native blend mode would apply an effect the web renderer does not.
 */
function isolatesDescendants(node: Element): boolean {
  if (node.attribs.mask || node.attribs.filter || node.attribs['clip-path'])
    return true

  const opacity = Number(node.attribs.opacity)
  if (!Number.isNaN(opacity) && opacity < 1) return true

  const style = parseStyle(node.attribs.style)
  if (style.get('isolation') === 'isolate') return true
  if (style.has('mix-blend-mode')) return true

  const styleOpacity = Number(style.get('opacity'))
  return !Number.isNaN(styleOpacity) && styleOpacity < 1
}

/** `url(#id)` -> `id`. */
const referenceId = (value: string | undefined) =>
  value?.match(/^url\(#(.+)\)$/)?.[1]

function colorMatrixAlpha(values: string): RGBA | undefined {
  const numbers = values
    .trim()
    .split(/[\s,]+/)
    .map(Number)
  if (numbers.length !== 20 || numbers.some(Number.isNaN)) return undefined
  // Figma's shadow colour lives in the constant column of the RGB rows, with
  // the alpha row scaling the incoming alpha.
  return [numbers[4], numbers[9], numbers[14], numbers[18]]
}

/**
 * Recognises the two filter graphs Figma emits. Anything else throws: a general
 * filter engine for nine elements would be absurd, but silently dropping one
 * would be worse.
 */
function parseFilter(filter: Element, label: string): EffectIR[] {
  const primitives = filter.children.filter(isTag)
  const names = primitives.map(tagOf)

  const blur = primitives.find((p) => tagOf(p) === 'fegaussianblur')
  const offset = primitives.find((p) => tagOf(p) === 'feoffset')
  const matrices = primitives.filter((p) => tagOf(p) === 'fecolormatrix')

  const hasShadowShape =
    offset !== undefined || matrices.some((m) => m.attribs.in === 'SourceAlpha')

  if (hasShadowShape) {
    const tint = matrices.find((m) => m.attribs.in !== 'SourceAlpha')
    const color = tint ? colorMatrixAlpha(tint.attribs.values ?? '') : undefined
    if (!color) {
      throw new Error(
        `${label}: drop-shadow filter has no readable colour matrix`,
      )
    }
    return [
      {
        kind: 'dropShadow',
        dx: Number(offset?.attribs.dx ?? 0),
        dy: Number(offset?.attribs.dy ?? 0),
        // feGaussianBlur's stdDeviation, absent for hard-edged shadows.
        stdDeviation: Number(blur?.attribs.stddeviation ?? 0),
        color,
      },
    ]
  }

  if (blur) {
    return [
      { kind: 'blur', stdDeviation: Number(blur.attribs.stddeviation ?? 0) },
    ]
  }

  throw new Error(
    `${label}: unrecognised filter graph [${names.join(', ')}]. ` +
      `Only Figma's drop-shadow and foreground-blur idioms are supported.`,
  )
}

export interface RawFragment {
  svg: string
  effects: EffectIR[]
}

/**
 * Splits an item into fragments at every blend or filter boundary.
 *
 * Most items come back as a single fragment with no effects. Definitions are
 * repeated in each fragment rather than tracked per-reference: only a handful of
 * items split at all, and a dangling `url(#...)` would fail silently.
 */
export function splitFragments(svg: string, label: string): RawFragment[] {
  const document = parseDocument(svg, { xmlMode: true })
  const root = document.children.find(
    (node): node is Element => isTag(node) && tagOf(node) === 'svg',
  )
  if (!root) throw new Error(`${label}: no root <svg> element`)

  const filters = new Map<string, Element>()
  const collectFilters = (node: AnyNode) => {
    if (!isTag(node)) return
    if (tagOf(node) === 'filter' && node.attribs.id) {
      filters.set(node.attribs.id, node)
    }
    for (const child of node.children) collectFilters(child)
  }
  collectFilters(root)

  normalizeAlphaMasks(root)

  // Assign every shape to a fragment, starting a new one at each effect.
  const assignment = new Map<Element, number>()
  const effects = new Map<number, EffectIR[]>()
  let current = 0

  const nodeEffects = (node: Element, isolated: boolean): EffectIR[] => {
    const found: EffectIR[] = []
    // A blend under an isolating ancestor never reaches the canvas, so it is
    // dropped rather than hoisted; the attribute is still stripped so the SVG
    // handed to the engine matches what was measured.
    const blend = parseBlend(node)
    if (blend && !isolated) found.push(blend)
    const filterId = referenceId(node.attribs.filter)
    if (filterId) {
      const filter = filters.get(filterId)
      if (!filter)
        throw new Error(`${label}: filter #${filterId} is not defined`)
      found.push(...parseFilter(filter, label))
    }
    return found
  }

  const assignSubtree = (node: AnyNode, index: number) => {
    if (!isTag(node)) return
    if (isShape(node)) assignment.set(node, index)
    for (const child of node.children) assignSubtree(child, index)
  }

  const stripEffectAttributes = (node: Element) => {
    delete node.attribs.filter
    const style = parseStyle(node.attribs.style)
    style.delete('mix-blend-mode')
    const formatted = formatStyle(style)
    if (formatted) node.attribs.style = formatted
    else delete node.attribs.style
  }

  const walk = (node: AnyNode, isolated: boolean) => {
    if (!isTag(node)) return
    if (isDefinition(node)) return

    // Read isolation before stripping, since the attributes that establish it
    // are the same ones being removed.
    const childrenIsolated = isolated || isolatesDescendants(node)

    const own = nodeEffects(node, isolated)
    stripEffectAttributes(node)

    if (own.length > 0) {
      current += 1
      effects.set(current, own)
      assignSubtree(node, current)
      current += 1
      return
    }

    if (isShape(node)) {
      assignment.set(node, current)
      return
    }

    for (const child of node.children) walk(child, childrenIsolated)
  }

  for (const child of root.children) walk(child, isolatesDescendants(root))

  const used = [...new Set(assignment.values())].sort((a, b) => a - b)
  if (used.length === 0) return []

  return used.map((index) => ({
    svg: serialize(root, (node) => assignment.get(node) === index),
    effects: effects.get(index) ?? [],
  }))
}

/** True when the SVG needs no transformation and can be tokenised verbatim. */
export function isPlainSvg(svg: string): boolean {
  return (
    !svg.includes('mask-type:alpha') &&
    !svg.includes('<filter') &&
    !svg.includes('mix-blend-mode')
  )
}

/** `id="x"` and `url(#x)`, the only two ways an asset references a definition. */
const ID_ATTRIBUTE = /\bid="([^"]+)"/g
const ID_REFERENCE = /url\(#([^)]+)\)/g

/**
 * Renames every definition id to a stable positional name.
 *
 * Asset packages build their uid suffixes with `Math.random()`, so the ids in
 * `dist/vanilla.js` change on every asset rebuild even when no artwork did.
 * Left alone that rewrites generated Swift for unrelated work, which fails the
 * pre-commit freshness check and makes CI's `git diff --exit-code` flap.
 *
 * Ids only have to be unique within their own document and each item is drawn
 * as its own document, so document order is a safe and fully deterministic
 * naming scheme. It also normalises the handful of hardcoded Figma ids that
 * never went through uid substitution at all.
 */
export function normalizeIds(svg: string): string {
  const names = new Map<string, string>()
  for (const match of svg.matchAll(ID_ATTRIBUTE)) {
    if (!names.has(match[1])) names.set(match[1], `a${names.size}`)
  }
  if (names.size === 0) return svg

  return svg
    .replace(ID_ATTRIBUTE, (whole, id: string) =>
      names.has(id) ? `id="${names.get(id)}"` : whole,
    )
    .replace(ID_REFERENCE, (whole, id: string) =>
      names.has(id) ? `url(#${names.get(id)})` : whole,
    )
}
