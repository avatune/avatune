import type { ThemePalette } from '../types'

export interface ThemeColorMember {
  name: string
  value: string
}

export interface ThemePaletteDefinition {
  id: string
  enumName: string
  members: ThemeColorMember[]
}

export const DEFAULT_COLOR_ENUM_NAME = 'DefaultColors'
export const DEFAULT_COLOR_MEMBER: ThemeColorMember = {
  name: 'Default',
  value: '#000000',
}

export interface ThemeColorReference {
  enumName: string
  members: ThemeColorMember[]
}

const SPECIAL_ENUM_NAMES: Record<string, string> = {
  skin: 'SkinTones',
  skintones: 'SkinTones',
  hair: 'HairColors',
  accent: 'AccentColors',
  background: 'BackgroundColors',
  clothing: 'ClothingColors',
  accessories: 'AccessoriesColors',
}

const normalizeSemanticName = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '')

const toIdentifier = (value: string, fallback: string): string => {
  const identifier = value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  if (!identifier) return fallback
  return /^[a-zA-Z_$]/.test(identifier) ? identifier : `Color${identifier}`
}

const getUniqueName = (baseName: string, usedNames: Map<string, number>) => {
  const count = usedNames.get(baseName) ?? 0
  usedNames.set(baseName, count + 1)
  return count === 0 ? baseName : `${baseName}${count + 1}`
}

export const getThemePaletteDefinitions = (
  palettes: ThemePalette[],
): ThemePaletteDefinition[] => {
  const usedEnumNames = new Map<string, number>([[DEFAULT_COLOR_ENUM_NAME, 1]])

  return palettes.map((palette, paletteIndex) => {
    const semanticName =
      SPECIAL_ENUM_NAMES[normalizeSemanticName(palette.id)] ??
      SPECIAL_ENUM_NAMES[normalizeSemanticName(palette.name)]
    const baseEnumName =
      semanticName ??
      `${toIdentifier(palette.name || palette.id, `Palette${paletteIndex + 1}`)}Colors`
    const enumName = getUniqueName(baseEnumName, usedEnumNames)
    const usedMemberNames = new Map<string, number>()
    const members = palette.colors.map((color, colorIndex) => ({
      name: getUniqueName(
        toIdentifier(color.name, `Color${colorIndex + 1}`),
        usedMemberNames,
      ),
      value: color.value,
    }))

    return { id: palette.id, enumName, members }
  })
}
