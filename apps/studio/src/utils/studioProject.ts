import type { BuilderAsset, ContainerMeta } from '../hooks/use-builder'
import {
  CATEGORIES,
  type CategoryId,
  PREDICTORS,
  type PredictorMappings,
  type ThemeFillBinding,
  type ThemeFillTransform,
} from '../types'

export const STUDIO_PROJECT_FORMAT = 'avatune-studio' as const
export const STUDIO_PROJECT_VERSION = 1 as const

export type StudioProjectAsset = Omit<BuilderAsset, 'url'>

export interface StudioProject {
  format: typeof STUDIO_PROJECT_FORMAT
  version: typeof STUDIO_PROJECT_VERSION
  meta: ContainerMeta
  assets: StudioProjectAsset[]
}

export type StudioProjectParseResult =
  | { ok: true; project: StudioProject }
  | { ok: false; error: string }

const CATEGORY_IDS = new Set(CATEGORIES.map(({ id }) => id))
const THEME_COLOR_CATEGORY_IDS = new Set([...CATEGORY_IDS, 'background'])
const PREDICTOR_IDS = new Set<string>(PREDICTORS)
const AMOUNT_TRANSFORMS = new Set([
  'darken',
  'lighten',
  'saturate',
  'desaturate',
  'rotate',
])
const AMOUNTLESS_TRANSFORMS = new Set(['grayscale', 'invert'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isStringRecord = (
  value: unknown,
  validKeys?: ReadonlySet<string>,
): value is Record<string, string> =>
  isRecord(value) &&
  Object.entries(value).every(
    ([key, entry]) =>
      (!validKeys || validKeys.has(key)) && typeof entry === 'string',
  )

const isThemeFillTransform = (value: unknown): value is ThemeFillTransform => {
  if (!isRecord(value) || typeof value.type !== 'string') return false
  if (AMOUNTLESS_TRANSFORMS.has(value.type)) return true
  return AMOUNT_TRANSFORMS.has(value.type) && isFiniteNumber(value.amount)
}

const isThemeFillBinding = (value: unknown): value is ThemeFillBinding => {
  if (!isRecord(value)) return false
  if (value.type === 'primary') return true
  return (
    value.type === 'custom' &&
    (value.sourceColor === undefined ||
      typeof value.sourceColor === 'string') &&
    Array.isArray(value.transforms) &&
    value.transforms.every(isThemeFillTransform)
  )
}

const isPredictorMappings = (value: unknown): value is PredictorMappings =>
  isRecord(value) &&
  Object.entries(value).every(
    ([predictor, mapping]) =>
      PREDICTOR_IDS.has(predictor) &&
      isRecord(mapping) &&
      Object.values(mapping).every(
        (values) =>
          Array.isArray(values) &&
          values.every((entry) => typeof entry === 'string'),
      ),
  )

const validateMeta = (value: unknown): value is ContainerMeta => {
  if (!isRecord(value)) return false
  if (
    !isFiniteNumber(value.size) ||
    value.size <= 0 ||
    !isFiniteNumber(value.radius) ||
    typeof value.clip !== 'boolean' ||
    typeof value.themeName !== 'string' ||
    value.themeName.length === 0 ||
    !Array.isArray(value.palettes) ||
    value.palettes.length === 0 ||
    !isStringRecord(value.paletteByCategory, THEME_COLOR_CATEGORY_IDS) ||
    // Added after v1 shipped — absent in older projects, defaulted on import.
    (value.paletteConnections !== undefined &&
      !isStringRecord(value.paletteConnections, CATEGORY_IDS)) ||
    (value.predictorMappings !== undefined &&
      !isPredictorMappings(value.predictorMappings)) ||
    (value.optionalCategories !== undefined &&
      (!Array.isArray(value.optionalCategories) ||
        !value.optionalCategories.every((category) =>
          CATEGORY_IDS.has(category as CategoryId),
        ))) ||
    !isStringRecord(value.previewColorByPalette)
  ) {
    return false
  }

  return value.palettes.every(
    (palette) =>
      isRecord(palette) &&
      typeof palette.id === 'string' &&
      palette.id.length > 0 &&
      typeof palette.name === 'string' &&
      Array.isArray(palette.colors) &&
      palette.colors.length > 0 &&
      palette.colors.every(
        (color) =>
          isRecord(color) &&
          typeof color.id === 'string' &&
          color.id.length > 0 &&
          typeof color.name === 'string' &&
          typeof color.value === 'string',
      ),
  )
}

const validateAsset = (value: unknown): value is StudioProjectAsset => {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.category === 'string' &&
    CATEGORY_IDS.has(value.category as StudioProjectAsset['category']) &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    typeof value.svg === 'string' &&
    /<svg\b/i.test(value.svg) &&
    isFiniteNumber(value.created) &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.scale) &&
    value.scale > 0 &&
    isFiniteNumber(value.rotation) &&
    isFiniteNumber(value.layer) &&
    isRecord(value.themeFillBindings) &&
    Object.entries(value.themeFillBindings).every(
      ([index, binding]) => /^\d+$/.test(index) && isThemeFillBinding(binding),
    )
  )
}

export const createStudioProject = (
  assets: BuilderAsset[],
  meta: ContainerMeta,
): StudioProject => ({
  format: STUDIO_PROJECT_FORMAT,
  version: STUDIO_PROJECT_VERSION,
  meta,
  assets: assets
    .map(({ url: _url, ...asset }) => asset)
    .sort((left, right) => left.created - right.created),
})

export const parseStudioProject = (
  value: unknown,
): StudioProjectParseResult => {
  if (!isRecord(value) || value.format !== STUDIO_PROJECT_FORMAT) {
    return { ok: false, error: 'This is not an Avatune Studio project.' }
  }
  if (value.version !== STUDIO_PROJECT_VERSION) {
    return {
      ok: false,
      error: `Unsupported Studio project version: ${String(value.version)}.`,
    }
  }
  if (!validateMeta(value.meta)) {
    return { ok: false, error: 'The Studio project metadata is invalid.' }
  }
  if (!Array.isArray(value.assets) || !value.assets.every(validateAsset)) {
    return { ok: false, error: 'The Studio project assets are invalid.' }
  }
  const ids = new Set(value.assets.map(({ id }) => id))
  if (ids.size !== value.assets.length) {
    return {
      ok: false,
      error: 'The Studio project contains duplicate asset IDs.',
    }
  }

  // Meta fields added after v1 shipped are absent in older files — defaulted
  // here, so every consumer of a parsed project gets a complete meta.
  const project = value as unknown as StudioProject & {
    meta: Partial<
      Pick<
        ContainerMeta,
        'paletteConnections' | 'predictorMappings' | 'optionalCategories'
      >
    >
  }
  return {
    ok: true,
    project: {
      ...project,
      meta: {
        ...project.meta,
        paletteConnections: project.meta.paletteConnections ?? {},
        predictorMappings: project.meta.predictorMappings ?? {},
        optionalCategories:
          project.meta.optionalCategories ??
          CATEGORIES.filter(({ optional }) => optional).map(({ id }) => id),
      },
    },
  }
}
