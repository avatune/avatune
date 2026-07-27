export const PART_CATEGORIES = ['faces', 'hairs', 'bodies', 'necks'] as const

export type PartCategory = (typeof PART_CATEGORIES)[number]
export type PaletteRole = 'skin' | 'hair' | 'features' | 'clothing' | 'outline'

export const SHEET_SIZE = 1024

export const REFERENCE_KINDS = ['mascot', 'photo'] as const
export const REFERENCE_INTENTS = ['style', 'likeness'] as const
export const REFERENCE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const
export const MAX_REFERENCE_FILES = 4

export type ReferenceKind = (typeof REFERENCE_KINDS)[number]
export type ReferenceIntent = (typeof REFERENCE_INTENTS)[number]

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
      'complete front-facing heads that all share one identical head silhouette and ear construction and differ only in eyes, eyebrows, nose, mouth, and expression, with no hair, neck, shoulders, clothing, or accessories',
    paletteRoles: ['skin', 'hair', 'features', 'outline'],
    variants: [
      { name: 'balancedFriendly', description: 'almond eyes, soft brows, compact nose, and a friendly closed smile' },
      { name: 'roundBright', description: 'large round eyes, high rounded brows, small nose, and a broad open smile' },
      { name: 'narrowCalm', description: 'narrow level eyes, straight brows, slim nose, and a neutral closed mouth' },
      { name: 'upturnedCheerful', description: 'upturned eyes, arched brows, short rounded nose, and a cheerful grin' },
      { name: 'hoodedConfident', description: 'half-hooded eyes, angled brows, straight nose, and a confident smirk' },
      { name: 'wideCurious', description: 'wide-set eyes, raised inner brows, small nose, and a slightly parted mouth' },
      { name: 'closedJoyful', description: 'closed curved eyes, lifted brows, tiny nose, and a laughing open mouth' },
      { name: 'heavyBrowSerious', description: 'deep-set eyes, heavy low brows, broad nose, and a flat compressed mouth' },
      { name: 'smallFeatureQuiet', description: 'small eyes, short thin brows, minimal nose, and a small quiet smile' },
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

export const HAIR_VARIANT_COUNT = PART_DEFINITIONS.hairs.variants.length

export const resolveVariants = (spec: ThemeSpec, category: PartCategory): readonly PartVariant[] =>
  category === 'hairs' && spec.hairVariants ? spec.hairVariants : PART_DEFINITIONS[category].variants

export interface ReferenceSpec {
  kind: ReferenceKind
  intent: ReferenceIntent
  files: string[]
  readout: string
  categories?: PartCategory[]
  notes?: string
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
  hairVariants?: PartVariant[]
  references?: string
  reference?: ReferenceSpec
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
  referenceFiles?: string[]
  referenceFingerprint?: string
}

export interface ImageManifest {
  version: 4
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
  categories: Partial<Record<PartCategory, { prompt: string; imageFile: string; referenceFingerprint?: string }>>
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

const validateHairVariants = (value: unknown): PartVariant[] => {
  if (!Array.isArray(value) || value.length !== HAIR_VARIANT_COUNT) {
    throw new Error(`hairVariants must contain exactly ${HAIR_VARIANT_COUNT} variants in row-major order`)
  }
  const variants = value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') throw new Error(`hairVariants.${index} must be an object`)
    const candidate = entry as Partial<PartVariant>
    const name = requireText(candidate.name, `hairVariants.${index}.name`)
    if (!/^[a-z][A-Za-z0-9]*$/.test(name)) throw new Error(`hairVariants.${index}.name must be camelCase`)
    const description = requireText(candidate.description, `hairVariants.${index}.description`)
    if (description.length < 12) {
      throw new Error(`hairVariants.${index}.description must name the concrete hair shape`)
    }
    return { name, description }
  })
  if (new Set(variants.map((variant) => variant.name)).size !== variants.length) {
    throw new Error('hairVariants names must be unique')
  }
  return variants
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

const resolveCategoryName = (value: unknown, field: string): PartCategory => {
  const resolved = CATEGORY_BY_CURRENT_OR_LEGACY_NAME[requireText(value, field)]
  if (!resolved) throw new Error(`Unknown category in ${field}: ${String(value)}`)
  return resolved
}

const validateReferenceSpec = (value: unknown): ReferenceSpec => {
  if (!value || typeof value !== 'object') throw new Error('reference must be an object')
  const candidate = value as Partial<ReferenceSpec>

  if (!candidate.kind || !REFERENCE_KINDS.includes(candidate.kind)) {
    throw new Error(`reference.kind must be one of: ${REFERENCE_KINDS.join(', ')}`)
  }
  if (!candidate.intent || !REFERENCE_INTENTS.includes(candidate.intent)) {
    throw new Error(`reference.intent must be one of: ${REFERENCE_INTENTS.join(', ')}`)
  }
  if (!Array.isArray(candidate.files) || !candidate.files.length || candidate.files.length > MAX_REFERENCE_FILES) {
    throw new Error(`reference.files must contain 1 to ${MAX_REFERENCE_FILES} image paths`)
  }

  const files = candidate.files.map((file, index) => {
    const path = requireText(file, `reference.files.${index}`)
    if (!REFERENCE_EXTENSIONS.some((extension) => path.toLowerCase().endsWith(extension))) {
      throw new Error(`reference.files.${index} must be one of: ${REFERENCE_EXTENSIONS.join(', ')}`)
    }
    return path
  })

  const readout = requireText(candidate.readout, 'reference.readout')
  if (readout.length < 40) {
    throw new Error('reference.readout must name at least 40 characters of traits observed in the reference images')
  }

  const categories = candidate.categories?.map((entry, index) =>
    resolveCategoryName(entry, `reference.categories.${index}`),
  )

  return {
    kind: candidate.kind,
    intent: candidate.intent,
    files,
    readout,
    ...(categories?.length ? { categories: [...new Set(categories)] } : {}),
    ...(candidate.notes ? { notes: requireText(candidate.notes, 'reference.notes') } : {}),
  }
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
      const resolvedCategory = resolveCategoryName(category, 'categoryNotes')
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
    ...(candidate.hairVariants ? { hairVariants: validateHairVariants(candidate.hairVariants) } : {}),
    ...(candidate.references ? { references: requireText(candidate.references, 'references') } : {}),
    ...(candidate.reference ? { reference: validateReferenceSpec(candidate.reference) } : {}),
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
    if (entry.referenceFingerprint !== undefined && typeof entry.referenceFingerprint !== 'string') {
      throw new Error(`Generation state ${category} has an invalid reference fingerprint`)
    }
    categories[category] = {
      prompt: entry.prompt,
      imageFile: entry.imageFile,
      ...(entry.referenceFingerprint ? { referenceFingerprint: entry.referenceFingerprint } : {}),
    }
  }
  return { version: 1, name: expectedName, categories }
}

export const validateImageManifest = (value: unknown, expectedName?: string): ImageManifest => {
  if (!value || typeof value !== 'object') throw new Error('Image manifest must be an object')
  const candidate = value as Partial<ImageManifest>
  if (candidate.version !== 4) throw new Error(`Unsupported image manifest version: ${candidate.version ?? 'missing'}`)
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
    const expectedVariants = resolveVariants(spec, category)
    if (!part || !part.prompt || part.imageFile !== `${category}.png`) {
      throw new Error(`Image manifest ${category} is missing generation fields`)
    }
    if (
      !Array.isArray(part.variants) ||
      part.variants.length !== expectedVariants.length ||
      part.variants.some((variant, index) => variant.name !== expectedVariants[index]?.name)
    ) {
      throw new Error(`Image manifest ${category} variants do not match the resolved theme variants`)
    }
    if (!Array.isArray(part.palette) || part.palette.some((color) => !/^#[0-9A-F]{6}$/.test(color))) {
      throw new Error(`Image manifest ${category} palette is invalid`)
    }
    if (part.referenceFiles && !part.referenceFiles.every((file) => typeof file === 'string' && file.length > 0)) {
      throw new Error(`Image manifest ${category} reference files are invalid`)
    }
    categories[category] = {
      variants: expectedVariants.map((variant) => ({ ...variant })),
      palette: [...part.palette],
      prompt: part.prompt,
      imageFile: part.imageFile,
      ...(part.referenceFiles?.length ? { referenceFiles: [...part.referenceFiles] } : {}),
      ...(part.referenceFingerprint ? { referenceFingerprint: part.referenceFingerprint } : {}),
    }
  }

  return {
    version: 4,
    name: candidate.name,
    imageModel: candidate.imageModel,
    sheetSize: SHEET_SIZE,
    spec,
    ...(candidate.feedback ? { feedback: candidate.feedback } : {}),
    categories,
  }
}
