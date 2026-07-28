import { colord } from 'colord'
import type {
  ThemeFillBinding,
  ThemeFillBindings,
  ThemeFillChain,
  ThemeFillTransform,
} from '../types'

export interface SvgFillPart {
  index: number
  label: string
  value: string
}
export const normalizeThemeFillTransform = (
  transform: ThemeFillTransform,
): ThemeFillTransform => {
  if (!('amount' in transform)) return transform
  const amount =
    transform.type === 'rotate'
      ? Math.min(360, Math.max(-360, Math.round(transform.amount)))
      : Math.min(1, Math.max(0, Math.round(transform.amount * 100) / 100))
  return { ...transform, amount }
}

export const normalizeThemeFillChain = (
  chain: ThemeFillChain,
): ThemeFillChain => {
  const source = chain.sourceColor ? colord(chain.sourceColor) : null
  return {
    type: 'custom',
    ...(source?.isValid() ? { sourceColor: source.toHex() } : {}),
    transforms: chain.transforms.map(normalizeThemeFillTransform),
  }
}

const TRANSFORM_TAKES_AMOUNT: Record<ThemeFillTransform['type'], boolean> = {
  rotate: true,
  saturate: true,
  desaturate: true,
  lighten: true,
  darken: true,
  grayscale: false,
  invert: false,
}

export interface ParsedColordChain {
  sourceColor?: string
  transforms: ThemeFillTransform[]
}

export const formatColordChain = (
  transforms: ThemeFillTransform[],
  sourceColor?: string,
): string => {
  const expression = transforms
    .map(normalizeThemeFillTransform)
    .map((transform) =>
      'amount' in transform
        ? `.${transform.type}(${transform.amount})`
        : `.${transform.type}()`,
    )
    .join('')
  const source = sourceColor ? JSON.stringify(sourceColor) : 'themeColor'
  return `colord(${source})${expression}.toHex()`
}

export const parseColordChain = (code: string): ParsedColordChain | null => {
  const source = code
    .replace(/\/\/[^\r\n]*|\/\*[\s\S]*?\*\//g, '')
    .trim()
    .replace(/;$/, '')
    .trim()
    .replace(/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*/, '')
  if (!source.startsWith('colord(')) return null

  let depth = 0
  let quote = ''
  let sourceEnd = -1
  for (let index = 6; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (character === quote && source[index - 1] !== '\\') quote = ''
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '(') depth += 1
    if (character !== ')') continue
    depth -= 1
    if (depth === 0) {
      sourceEnd = index
      break
    }
  }

  if (sourceEnd < 0) return null
  const sourceArgument = source.slice(7, sourceEnd).trim()
  let sourceColor: string | undefined
  if (sourceArgument !== 'themeColor') {
    const quote = sourceArgument[0]
    if ((quote !== '"' && quote !== "'") || sourceArgument.at(-1) !== quote) {
      return null
    }
    const parsedSource = colord(sourceArgument.slice(1, -1))
    if (!parsedSource.isValid()) return null
    sourceColor = parsedSource.toHex()
  }
  const suffix = source.slice(sourceEnd + 1).replace(/\s+/g, '')
  if (!suffix.endsWith('.toHex()')) return null
  const operations = suffix.slice(0, -'.toHex()'.length)
  const transforms: ThemeFillTransform[] = []
  let offset = 0

  while (offset < operations.length) {
    const match = operations.slice(offset).match(/^\.([a-z]+)\(([^()]*)\)/)
    if (!match) return null

    const type = match[1] as ThemeFillTransform['type']
    const takesAmount = TRANSFORM_TAKES_AMOUNT[type]
    if (takesAmount === undefined) return null
    const amountText = match[2]
    if (!takesAmount) {
      if (amountText) return null
      transforms.push({ type: type as 'grayscale' | 'invert' })
    } else {
      const amount = Number(amountText)
      if (
        !amountText ||
        !Number.isFinite(amount) ||
        (type === 'rotate'
          ? amount < -360 || amount > 360
          : amount < 0 || amount > 1)
      ) {
        return null
      }
      transforms.push({
        type: type as Exclude<
          ThemeFillTransform['type'],
          'grayscale' | 'invert'
        >,
        amount,
      })
    }
    offset += match[0].length
  }

  return {
    ...(sourceColor ? { sourceColor } : {}),
    transforms: transforms.map(normalizeThemeFillTransform),
  }
}

export const getThemeFillMarker = (chain: ThemeFillChain): string => {
  const serialized = JSON.stringify(normalizeThemeFillChain(chain))
  let hash = 2_166_136_261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16_777_619)
  }
  return `#${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export const applyThemeFillBinding = (
  color: string,
  binding: ThemeFillBinding,
): string => {
  if (binding.type === 'primary') return color
  const chain = normalizeThemeFillChain(binding)
  const sourceColor = chain.sourceColor ?? color
  if (chain.transforms.length === 0) return sourceColor
  if (!chain.sourceColor && color.toLowerCase() === 'currentcolor') {
    return getThemeFillMarker(chain)
  }

  let result = colord(sourceColor)
  for (const transform of chain.transforms) {
    switch (transform.type) {
      case 'darken':
        result = result.darken(transform.amount)
        break
      case 'lighten':
        result = result.lighten(transform.amount)
        break
      case 'saturate':
        result = result.saturate(transform.amount)
        break
      case 'desaturate':
        result = result.desaturate(transform.amount)
        break
      case 'rotate':
        result = result.rotate(transform.amount)
        break
      case 'grayscale':
        result = result.grayscale()
        break
      case 'invert':
        result = result.invert()
        break
    }
  }
  return result.toHex()
}

export const setThemeFillBindings = (
  bindings: ThemeFillBindings,
  indices: readonly number[],
  binding: ThemeFillBinding | null,
): ThemeFillBindings => {
  const next = { ...bindings }
  for (const index of indices) {
    if (binding) next[index] = binding
    else delete next[index]
  }
  return next
}

const SVG_TAG_PATTERN = /<([a-z][\w:-]*)\b[^>]*>/gi
const FILL_ATTRIBUTE_PATTERN = /(\sfill\s*=\s*)(["'])(.*?)\2/i

const isThemeableFill = (value: string): boolean => {
  const normalized = value.trim().toLowerCase()
  return (
    ![
      '',
      'none',
      'transparent',
      'inherit',
      'currentcolor',
      'context-fill',
      'context-stroke',
    ].includes(normalized) && !normalized.startsWith('url(')
  )
}

export const getSvgFillParts = (svg: string): SvgFillPart[] => {
  const parts: SvgFillPart[] = []
  const tagCounts = new Map<string, number>()

  for (const match of svg.matchAll(SVG_TAG_PATTERN)) {
    const tag = match[1].toLowerCase()
    const fill = match[0].match(FILL_ATTRIBUTE_PATTERN)?.[3]
    if (!fill || !isThemeableFill(fill)) continue

    const count = (tagCounts.get(tag) ?? 0) + 1
    tagCounts.set(tag, count)
    const id = match[0].match(/\sid\s*=\s*["']([^"']+)["']/i)?.[1]
    parts.push({
      index: parts.length,
      label: id ? `${tag}#${id}` : `${tag} ${count}`,
      value: fill.trim(),
    })
  }

  return parts
}

const UNSAFE_INTERACTIVE_SVG_ELEMENTS =
  'script, foreignObject, iframe, object, embed, audio, video, style, link, animate, animateMotion, animateTransform, set'
const EXTERNAL_SVG_URL_PATTERN = /url\(\s*['"]?(?!#)/i
const OVERLAY_STYLE_PROPERTIES = new Set([
  'fill',
  'fill-opacity',
  'opacity',
  'pointer-events',
  'stroke',
  'stroke-opacity',
  'stroke-width',
  'visibility',
])

/**
 * Sanitized copy of the SVG whose themeable fills carry a
 * `data-avatune-fill-index` attribute, so a fill can be highlighted on the
 * preview by index.
 */
export const createSvgFillOverlayElement = (
  svg: string,
): SVGSVGElement | null => {
  if (typeof DOMParser === 'undefined') return null

  const document = new DOMParser().parseFromString(svg, 'image/svg+xml')
  const root = document.documentElement
  if (
    root.localName.toLowerCase() !== 'svg' ||
    document.querySelector('parsererror')
  ) {
    return null
  }

  for (const element of Array.from(
    document.querySelectorAll(UNSAFE_INTERACTIVE_SVG_ELEMENTS),
  )) {
    element.remove()
  }

  const elements = [root, ...Array.from(root.querySelectorAll('*'))]
  for (const element of elements) {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim()
      if (name === 'style') {
        const style = value
          .split(';')
          .filter((declaration) => {
            const property = declaration.split(':', 1)[0].trim().toLowerCase()
            return !OVERLAY_STYLE_PROPERTIES.has(property)
          })
          .join(';')
        if (style && !EXTERNAL_SVG_URL_PATTERN.test(style)) {
          element.setAttribute(attribute.name, style)
        } else {
          element.removeAttribute(attribute.name)
        }
        continue
      }
      if (
        name.startsWith('on') ||
        ((name === 'href' || name === 'xlink:href') &&
          !value.startsWith('#')) ||
        EXTERNAL_SVG_URL_PATTERN.test(value)
      ) {
        element.removeAttribute(attribute.name)
      }
    }
  }

  let fillIndex = 0
  for (const element of elements) {
    const fill = element.getAttribute('fill')
    if (!fill || !isThemeableFill(fill)) continue
    element.setAttribute('data-avatune-fill-index', String(fillIndex))
    fillIndex += 1
  }

  root.setAttribute('aria-hidden', 'true')
  root.setAttribute('focusable', 'false')
  return root as unknown as SVGSVGElement
}

export const replaceSvgFillSource = (
  svg: string,
  targetIndex: number,
  color: string,
): string => {
  const parsedColor = colord(color)
  if (!parsedColor.isValid()) return svg

  let fillIndex = 0
  return svg.replace(SVG_TAG_PATTERN, (tag) => {
    const fill = tag.match(FILL_ATTRIBUTE_PATTERN)?.[3]
    if (!fill || !isThemeableFill(fill)) return tag

    const currentIndex = fillIndex
    fillIndex += 1
    if (currentIndex !== targetIndex) return tag

    return tag.replace(
      FILL_ATTRIBUTE_PATTERN,
      (_attribute, prefix: string) => `${prefix}"${parsedColor.toHex()}"`,
    )
  })
}

export const replaceSvgFillParts = (
  svg: string,
  bindings: ThemeFillBindings,
  color: string,
): string => {
  if (Object.keys(bindings).length === 0) return svg
  let fillIndex = 0

  return svg.replace(SVG_TAG_PATTERN, (tag) => {
    const fill = tag.match(FILL_ATTRIBUTE_PATTERN)?.[3]
    if (!fill || !isThemeableFill(fill)) return tag

    const currentIndex = fillIndex
    fillIndex += 1
    const binding = bindings[currentIndex]
    if (!binding) return tag

    const replacement = applyThemeFillBinding(color, binding)
    return tag.replace(
      FILL_ATTRIBUTE_PATTERN,
      (_attribute, prefix: string) => `${prefix}"${replacement}"`,
    )
  })
}

export const svgToDataUrl = (svg: string): string =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`
