import type { BuilderAsset, ContainerMeta } from '../../hooks/use-builder'
import type { Asset, ThemeData, ThemeFillChain } from '../../types'
import { createStudioProject } from '../../utils/studioProject'
import {
  normalizeThemeFillChain,
  replaceSvgFillParts,
} from '../../utils/svgColors'

const readSvgDimensions = (svg: string) => {
  const viewBox = svg
    .match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)
  if (
    viewBox?.length === 4 &&
    Number.isFinite(viewBox[2]) &&
    Number.isFinite(viewBox[3]) &&
    viewBox[2] > 0 &&
    viewBox[3] > 0
  ) {
    return { width: viewBox[2], height: viewBox[3] }
  }

  const width = Number.parseFloat(
    svg.match(/\bwidth\s*=\s*["']([^"']+)["']/i)?.[1] ?? '',
  )
  const height = Number.parseFloat(
    svg.match(/\bheight\s*=\s*["']([^"']+)["']/i)?.[1] ?? '',
  )
  return {
    width: Number.isFinite(width) && width > 0 ? width : 1,
    height: Number.isFinite(height) && height > 0 ? height : 1,
  }
}

const setSvgDimensions = (svg: string, width: number, height: number) => {
  const root = svg.match(/<svg\b[^>]*>/i)?.[0]
  if (!root) return svg

  const setAttribute = (tag: string, name: string, value: number) => {
    const formatted = Number(value.toFixed(4))
    const attribute = new RegExp(`\\b${name}\\s*=\\s*(['"])[^'"]*\\1`, 'i')
    return attribute.test(tag)
      ? tag.replace(attribute, `${name}="${formatted}"`)
      : tag.replace(/^<svg\b/i, `<svg ${name}="${formatted}"`)
  }

  const resizedRoot = setAttribute(
    setAttribute(root, 'width', width),
    'height',
    height,
  )
  return svg.replace(root, resizedRoot)
}

const toAsset = (asset: BuilderAsset, size: number): Asset => {
  const themedSvg = replaceSvgFillParts(
    asset.svg,
    asset.themeFillBindings,
    'currentColor',
  )
  const source = readSvgDimensions(themedSvg)
  const width = size * (asset.scale / 100)
  const height = width * (source.height / source.width)
  const widthPercent = (width / size) * 100
  const heightPercent = (height / size) * 100
  const svg = setSvgDimensions(themedSvg, width, height)

  return {
    id: asset.id,
    name: asset.name,
    file: svg,
    dataUrl: asset.url,
    category: asset.category,
    xPercent: asset.x - widthPercent / 2,
    yPercent: asset.y - heightPercent / 2,
    layer: asset.layer,
    scale: asset.scale / 100,
    width,
    height,
  }
}

export const toThemeData = (
  assets: BuilderAsset[],
  meta: ContainerMeta,
  themeName: string,
): ThemeData => {
  const heads = assets
    .filter((asset) => asset.category === 'head')
    .sort((a, b) => a.created - b.created)
  const head = heads[0] ?? null
  const secondaryColorChains = new Map<string, ThemeFillChain>()
  for (const asset of assets) {
    for (const binding of Object.values(asset.themeFillBindings)) {
      if (binding.type === 'primary' || binding.transforms.length === 0)
        continue
      const chain = normalizeThemeFillChain(binding)
      secondaryColorChains.set(JSON.stringify(chain), chain)
    }
  }

  return {
    headAsset: head ? toAsset(head, meta.size) : null,
    assets: assets
      .filter((asset) => asset.id !== head?.id)
      .map((asset) => toAsset(asset, meta.size)),
    themeName,
    size: meta.size,
    borderRadius: `${meta.radius}%`,
    palettes: meta.palettes,
    paletteByCategory: meta.paletteByCategory,
    paletteConnections: meta.paletteConnections,
    predictorMappings: meta.predictorMappings,
    optionalCategories: meta.optionalCategories,
    secondaryColorChains: [...secondaryColorChains.values()],
  }
}

export const exportStudioProject = (
  assets: BuilderAsset[],
  meta: ContainerMeta,
  themeName: string,
): void => {
  const project = createStudioProject(assets, { ...meta, themeName })
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${themeName}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
