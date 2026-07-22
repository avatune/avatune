export const PART_CATEGORIES = ['faces', 'hairs', 'bodies', 'necks'] as const

export type PartCategory = (typeof PART_CATEGORIES)[number]
export type PaletteRole = 'skin' | 'hair' | 'features' | 'clothing' | 'outline'

export const SHEET_SIZE = 1024

export interface PartVariant {
  name: string
  description: string
}

interface PartDefinition {
  isolatedSubject: string
  paletteRoles: PaletteRole[]
  variants: readonly PartVariant[]
}

export const PART_DEFINITIONS: Record<PartCategory, PartDefinition> = {
  faces: {
    isolatedSubject:
      'complete front-facing heads containing the head shape, ears, eyes, eyebrows, nose, and mouth, with no hair, neck, shoulders, clothing, or accessories',
    paletteRoles: ['skin', 'hair', 'features', 'outline'],
    variants: [
      { name: 'ovalFriendly', description: 'oval head, balanced eyes, soft brows, and a friendly closed smile' },
      { name: 'roundBright', description: 'round head, bright round eyes, raised brows, and a broad smile' },
      { name: 'squareCalm', description: 'square head, calm almond eyes, straight brows, and a neutral mouth' },
      { name: 'heartCheerful', description: 'heart-shaped head, upturned eyes, arched brows, and a cheerful grin' },
      { name: 'diamondConfident', description: 'diamond head, focused eyes, defined brows, and a confident smirk' },
      { name: 'oblongWarm', description: 'oblong head, soft hooded eyes, curved brows, and a warm smile' },
      { name: 'pearPlayful', description: 'pear-shaped head, wide eyes, expressive brows, and a playful open smile' },
      { name: 'broadJawRelaxed', description: 'broad jaw, relaxed eyes, low brows, and relaxed closed lips' },
      { name: 'taperedHappy', description: 'tapered jaw, happy curved eyes, soft brows, and a laughing mouth' },
    ],
  },
  hairs: {
    isolatedSubject: 'isolated front hair overlays with no head, face, ears, neck, shoulders, or clothing',
    paletteRoles: ['hair', 'outline'],
    variants: [
      { name: 'buzzCut', description: 'short close-cropped textured silhouette' },
      { name: 'croppedCurls', description: 'short compact curls with a clean face opening' },
      { name: 'sideSweep', description: 'short side-swept top with neat sides' },
      { name: 'classicBob', description: 'medium chin-length bob silhouette' },
      { name: 'shoulderWaves', description: 'medium shoulder-length soft waves' },
      { name: 'mediumCoils', description: 'medium rounded coil silhouette' },
      { name: 'longStraight', description: 'long straight hair with a clean center opening' },
      { name: 'longWaves', description: 'long flowing wave silhouette' },
      { name: 'longCoils', description: 'long full coil silhouette' },
    ],
  },
  bodies: {
    isolatedSubject:
      'isolated shoulder-and-torso clothing busts with one simple centered neckline socket and no neck, head, jaw, face, hair, or ears',
    paletteRoles: ['clothing', 'outline'],
    variants: [
      { name: 'relaxedCrew', description: 'relaxed shoulders with a simple crew neckline socket' },
      { name: 'broadCrew', description: 'broad shoulders with a simple crew neckline socket' },
      { name: 'narrowCrew', description: 'narrow shoulders with a simple crew neckline socket' },
      { name: 'softCollar', description: 'soft pointed collar around the shared neckline socket' },
      { name: 'openJacket', description: 'open jacket over a plain inner shirt and shared neckline socket' },
      { name: 'cozyHoodie', description: 'clean hooded sweatshirt around the shared neckline socket' },
      { name: 'wideNeck', description: 'wide rounded clothing neckline around the shared connector socket' },
      { name: 'turtleneck', description: 'low simple turtleneck base ending at the shared connector socket' },
      { name: 'vNeck', description: 'simple V neckline around the shared connector socket' },
    ],
  },
  necks: {
    isolatedSubject:
      'isolated bare neck connector shapes only, with no head, jaw, ears, shoulders, torso, clothing, face, or hair',
    paletteRoles: ['skin', 'outline'],
    variants: [
      { name: 'slimStraight', description: 'slim straight connector with flat hidden top and bottom overlaps' },
      { name: 'standardStraight', description: 'standard straight connector with flat hidden top and bottom overlaps' },
      { name: 'broadStraight', description: 'broad straight connector with flat hidden top and bottom overlaps' },
      { name: 'slimSoft', description: 'slim connector with very gently curved sides and flat overlap ends' },
      { name: 'standardSoft', description: 'standard connector with very gently curved sides and flat overlap ends' },
      { name: 'broadSoft', description: 'broad connector with very gently curved sides and flat overlap ends' },
      { name: 'tapered', description: 'simple connector tapering slightly toward the head with flat overlap ends' },
      { name: 'flared', description: 'simple connector widening slightly toward the body with flat overlap ends' },
      { name: 'compact', description: 'compact straight connector with flat hidden top and bottom overlaps' },
    ],
  },
}

export const getPartVariant = (category: PartCategory, index: number) => {
  const variant = PART_DEFINITIONS[category].variants[index]
  if (!variant) throw new Error(`${category} has no variant at index ${index}`)
  return variant
}

export interface ThemeSpec {
  version: 1
  name: string
  styleFamily: string
  shapeLanguage: string
  lineTreatment: string
  mood: string
  representation: string
  faceStyleSignature: string
  references?: string
  palette: {
    skin: string[]
    hair: string[]
    features: string[]
    clothing: string[]
    outline: string
  }
  categoryNotes?: Partial<Record<PartCategory, string>>
  avoid?: string[]
}

export interface ImageCategoryManifest {
  variants: PartVariant[]
  palette: string[]
  prompt: string
  imageFile: string
}

export interface ImageManifest {
  version: 3
  name: string
  imageModel: string
  sheetSize: number
  spec: ThemeSpec
  feedback?: string
  categories: Record<PartCategory, ImageCategoryManifest>
}

export interface GenerationState {
  version: 1
  name: string
  categories: Partial<Record<PartCategory, { prompt: string; imageFile: string }>>
}

const requireText = (value: unknown, field: string) => {
  if (typeof value !== 'string' || value.trim().length < 2) {
    throw new Error(`${field} must be a non-empty string`)
  }
  return value.trim()
}

const requireColors = (value: unknown, field: string, minimum = 2) => {
  if (
    !Array.isArray(value) ||
    value.length < minimum ||
    new Set(value).size !== value.length ||
    value.some((color) => typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color))
  ) {
    throw new Error(`${field} must contain at least ${minimum} unique six-digit hex colors`)
  }
  return value.map((color) => color.toUpperCase())
}

const CATEGORY_BY_CURRENT_OR_LEGACY_NAME: Record<string, PartCategory> = {
  face: 'faces',
  faces: 'faces',
  head: 'faces',
  eyes: 'faces',
  eyebrows: 'faces',
  nose: 'faces',
  mouth: 'faces',
  ears: 'faces',
  hair: 'hairs',
  hairs: 'hairs',
  body: 'bodies',
  bodies: 'bodies',
  neck: 'necks',
  necks: 'necks',
}

export const validateThemeSpec = (value: unknown, expectedName?: string): ThemeSpec => {
  if (!value || typeof value !== 'object') throw new Error('Theme spec must be an object')
  const candidate = value as Partial<ThemeSpec>
  if (candidate.version !== 1) throw new Error(`Unsupported theme spec version: ${candidate.version ?? 'missing'}`)
  if (!candidate.name || !/^[a-z][a-z0-9-]*$/.test(candidate.name)) {
    throw new Error('Theme spec name must be lowercase kebab-case')
  }
  if (expectedName && candidate.name !== expectedName) {
    throw new Error(`Theme spec is for ${candidate.name}, expected ${expectedName}`)
  }
  if (!candidate.palette || typeof candidate.palette !== 'object') {
    throw new Error('Theme spec must contain a palette')
  }

  const categoryNotes: Partial<Record<PartCategory, string>> = {}
  const faceStyleSignature = requireText(candidate.faceStyleSignature, 'faceStyleSignature')
  if (faceStyleSignature.length < 24) {
    throw new Error('faceStyleSignature must name at least 24 characters of concrete visible face traits')
  }

  if (candidate.categoryNotes) {
    for (const [category, note] of Object.entries(candidate.categoryNotes)) {
      const resolvedCategory = CATEGORY_BY_CURRENT_OR_LEGACY_NAME[category]
      if (!resolvedCategory) throw new Error(`Unknown category note: ${category}`)
      const resolvedNote = requireText(note, `categoryNotes.${category}`)
      const existingNote = categoryNotes[resolvedCategory]
      categoryNotes[resolvedCategory] = existingNote ? `${existingNote}; ${resolvedNote}` : resolvedNote
    }
  }

  const avoid = candidate.avoid?.map((entry, index) => requireText(entry, `avoid.${index}`))

  return {
    version: 1,
    name: candidate.name,
    styleFamily: requireText(candidate.styleFamily, 'styleFamily'),
    shapeLanguage: requireText(candidate.shapeLanguage, 'shapeLanguage'),
    lineTreatment: requireText(candidate.lineTreatment, 'lineTreatment'),
    mood: requireText(candidate.mood, 'mood'),
    representation: requireText(candidate.representation, 'representation'),
    faceStyleSignature,
    ...(candidate.references ? { references: requireText(candidate.references, 'references') } : {}),
    palette: {
      skin: requireColors(candidate.palette.skin, 'palette.skin', 3),
      hair: requireColors(candidate.palette.hair, 'palette.hair', 3),
      features: requireColors(candidate.palette.features, 'palette.features', 3),
      clothing: requireColors(candidate.palette.clothing, 'palette.clothing', 3),
      outline: requireColors([candidate.palette.outline], 'palette.outline', 1)[0],
    },
    ...(Object.keys(categoryNotes).length ? { categoryNotes } : {}),
    ...(avoid?.length ? { avoid } : {}),
  }
}

export const validateGenerationState = (value: unknown, expectedName: string): GenerationState => {
  if (!value || typeof value !== 'object') throw new Error('Generation state must be an object')
  const candidate = value as Partial<GenerationState>
  if (candidate.version !== 1 || candidate.name !== expectedName) {
    throw new Error(`Generation state does not belong to ${expectedName}`)
  }
  if (!candidate.categories || typeof candidate.categories !== 'object') {
    throw new Error('Generation state must contain categories')
  }
  const categories: GenerationState['categories'] = {}
  for (const category of PART_CATEGORIES) {
    const entry = candidate.categories[category]
    if (!entry) continue
    if (typeof entry.prompt !== 'string' || entry.imageFile !== `${category}.png`) {
      throw new Error(`Generation state ${category} is invalid`)
    }
    categories[category] = { prompt: entry.prompt, imageFile: entry.imageFile }
  }
  return { version: 1, name: expectedName, categories }
}

export const validateImageManifest = (value: unknown, expectedName?: string): ImageManifest => {
  if (!value || typeof value !== 'object') throw new Error('Image manifest must be an object')
  const candidate = value as Partial<ImageManifest>
  if (candidate.version !== 3) throw new Error(`Unsupported image manifest version: ${candidate.version ?? 'missing'}`)
  if (!candidate.name || !/^[a-z][a-z0-9-]*$/.test(candidate.name)) {
    throw new Error('Image manifest name must be lowercase kebab-case')
  }
  if (expectedName && candidate.name !== expectedName) {
    throw new Error(`Image manifest is for ${candidate.name}, expected ${expectedName}`)
  }
  if (!candidate.imageModel || candidate.sheetSize !== SHEET_SIZE) {
    throw new Error(`Image manifest must use ${SHEET_SIZE}px sheets`)
  }
  if (!candidate.categories || typeof candidate.categories !== 'object') {
    throw new Error('Image manifest must contain categories')
  }

  const spec = validateThemeSpec(candidate.spec, candidate.name)
  const categories = {} as Record<PartCategory, ImageCategoryManifest>
  for (const category of PART_CATEGORIES) {
    const part = candidate.categories[category]
    const definition = PART_DEFINITIONS[category]
    if (!part || !part.prompt || part.imageFile !== `${category}.png`) {
      throw new Error(`Image manifest ${category} is missing generation fields`)
    }
    if (
      !Array.isArray(part.variants) ||
      part.variants.length !== definition.variants.length ||
      part.variants.some((variant, index) => variant.name !== getPartVariant(category, index).name)
    ) {
      throw new Error(`Image manifest ${category} variants do not match the generator definition`)
    }
    if (!Array.isArray(part.palette) || part.palette.some((color) => !/^#[0-9A-F]{6}$/.test(color))) {
      throw new Error(`Image manifest ${category} palette is invalid`)
    }
    categories[category] = {
      variants: definition.variants.map((variant) => ({ ...variant })),
      palette: [...part.palette],
      prompt: part.prompt,
      imageFile: part.imageFile,
    }
  }

  return {
    version: 3,
    name: candidate.name,
    imageModel: candidate.imageModel,
    sheetSize: SHEET_SIZE,
    spec,
    ...(candidate.feedback ? { feedback: candidate.feedback } : {}),
    categories,
  }
}
