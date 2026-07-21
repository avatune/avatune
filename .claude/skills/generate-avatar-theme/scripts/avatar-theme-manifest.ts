export const PART_CATEGORIES = [
  'body',
  'ears',
  'head',
  'hair',
  'eyes',
  'eyebrows',
  'nose',
  'mouth',
] as const

export type PartCategory = (typeof PART_CATEGORIES)[number]

interface PartDefinition {
  isolatedSubject: string
  palette: string[]
}

export const PART_DEFINITIONS: Record<PartCategory, PartDefinition> = {
  body: {
    isolatedSubject: 'complete shoulder-and-torso bust shapes with no neck or head',
    palette: ['#4D78A8', '#305276', '#E2A84B', '#241A1B'],
  },
  ears: {
    isolatedSubject: 'matching left-and-right ear pairs with no head, hair, earrings, or face',
    palette: ['#D58F6F', '#A85D47', '#241A1B'],
  },
  head: {
    isolatedSubject:
      'front-facing, bilaterally symmetric bare head, jaw, and neck shapes seen straight on from the front like a passport photo, with no hair, ears, eyes, eyebrows, nose, mouth, or clothing',
    palette: ['#D58F6F', '#A85D47', '#241A1B'],
  },
  hair: {
    isolatedSubject: 'front hair silhouettes with no head, face, ears, neck, or shoulders',
    palette: ['#5B3724', '#352017', '#241A1B'],
  },
  eyes: {
    isolatedSubject:
      'matching left-and-right eye pairs, including large sclera, iris, and pupil shapes, with no face or eyebrows',
    palette: ['#5078A8', '#1B1820', '#F3EEE4'],
  },
  eyebrows: {
    isolatedSubject: 'matching left-and-right eyebrow pairs with no eyes, hair, or face',
    palette: ['#5B3724', '#352017', '#241A1B'],
  },
  nose: {
    isolatedSubject: 'single simplified nose shapes with no eyes, mouth, face outline, or head',
    palette: ['#D58F6F', '#A85D47', '#241A1B'],
  },
  mouth: {
    isolatedSubject:
      'single expressive mouth shapes with broad lips and optional large teeth or tongue shapes, with no face or nose',
    palette: ['#B84D68', '#7F3048', '#F3EEE4', '#241A1B'],
  },
}

export interface EnhancedCategoryPrompt {
  names: string[]
  subject: string
}

export interface EnhancedPrompt {
  artDirection: string
  categories: Record<PartCategory, EnhancedCategoryPrompt>
}

export interface ImageCategoryManifest extends EnhancedCategoryPrompt {
  palette: string[]
  prompt: string
  imageFile: string
}

export interface ImageManifest {
  version: 1
  name: string
  brief: string
  feedback?: string
  enhancerModel: string
  imageModel: string
  artDirection: string
  categories: Record<PartCategory, ImageCategoryManifest>
}

const validateNames = (value: unknown, category: PartCategory) => {
  if (!Array.isArray(value) || value.length !== 9) {
    throw new Error(`${category} must contain exactly nine names`)
  }
  if (
    new Set(value).size !== 9 ||
    value.some((name) => typeof name !== 'string' || !/^[a-z][A-Za-z0-9]*$/.test(name))
  ) {
    throw new Error(`${category} names must be unique camelCase identifiers`)
  }
  return value as string[]
}

export const validateEnhancedPrompt = (value: unknown): EnhancedPrompt => {
  if (!value || typeof value !== 'object') throw new Error('Enhanced prompt must be an object')
  const candidate = value as Partial<EnhancedPrompt>
  if (!candidate.artDirection || candidate.artDirection.length < 80) {
    throw new Error('Enhanced artDirection must contain at least 80 characters')
  }
  if (!candidate.categories || typeof candidate.categories !== 'object') {
    throw new Error('Enhanced prompt must contain category prompts')
  }

  const categories = {} as Record<PartCategory, EnhancedCategoryPrompt>
  for (const category of PART_CATEGORIES) {
    const part = candidate.categories[category]
    if (!part || typeof part.subject !== 'string' || part.subject.length < 80) {
      throw new Error(`${category} subject must contain at least 80 characters`)
    }
    categories[category] = {
      names: validateNames(part.names, category),
      subject: part.subject,
    }
  }

  return { artDirection: candidate.artDirection, categories }
}


export const validateImageManifest = (value: unknown, expectedName?: string): ImageManifest => {
  if (!value || typeof value !== 'object') throw new Error('Image manifest must be an object')
  const candidate = value as Partial<ImageManifest>
  if (candidate.version !== 1) throw new Error(`Unsupported image manifest version: ${candidate.version ?? 'missing'}`)
  if (!candidate.name || !/^[a-z][a-z0-9-]*$/.test(candidate.name)) {
    throw new Error('Image manifest name must be lowercase kebab-case')
  }
  if (expectedName && candidate.name !== expectedName) {
    throw new Error(`Image manifest is for ${candidate.name}, expected ${expectedName}`)
  }
  for (const field of ['brief', 'enhancerModel', 'imageModel', 'artDirection'] as const) {
    if (!candidate[field] || typeof candidate[field] !== 'string') {
      throw new Error(`Image manifest ${field} must be a non-empty string`)
    }
  }
  if (!candidate.categories || typeof candidate.categories !== 'object') {
    throw new Error('Image manifest must contain categories')
  }

  const categories = {} as Record<PartCategory, ImageCategoryManifest>
  for (const category of PART_CATEGORIES) {
    const part = candidate.categories[category]
    const definition = PART_DEFINITIONS[category]
    if (!part || typeof part.subject !== 'string' || part.subject.length < 80) {
      throw new Error(`Image manifest ${category} subject must contain at least 80 characters`)
    }
    if (!part.prompt || part.imageFile !== `${category}.png`) {
      throw new Error(`Image manifest ${category} is missing generation fields`)
    }
    if (
      !Array.isArray(part.palette) ||
      part.palette.length !== definition.palette.length ||
      part.palette.some((color, index) => color !== definition.palette[index])
    ) {
      throw new Error(`Image manifest ${category} palette does not match the generator definition`)
    }
    categories[category] = {
      names: validateNames(part.names, category),
      subject: part.subject,
      palette: [...definition.palette],
      prompt: part.prompt,
      imageFile: part.imageFile,
    }
  }

  return {
    version: 1,
    name: candidate.name,
    brief: candidate.brief,
    ...(candidate.feedback ? { feedback: candidate.feedback } : {}),
    enhancerModel: candidate.enhancerModel,
    imageModel: candidate.imageModel,
    artDirection: candidate.artDirection,
    categories,
  }
}
