#!/usr/bin/env bun
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import {
  type GenerationState,
  type ImageCategoryManifest,
  type ImageManifest,
  PART_CATEGORIES,
  PART_DEFINITIONS,
  type PartCategory,
  resolveVariants,
  SHEET_SIZE,
  type ThemeSpec,
  validateGenerationState,
  validateImageManifest,
  validateThemeSpec,
} from './avatar-theme-manifest'

interface ImageResult {
  data?: Array<{ b64_json?: string }>
}

interface ReferenceImage {
  name: string
  type: string
  bytes: Uint8Array
}

const usage = `Usage:
  bun generate-avatar-sheet.ts <name> --spec-file <path> [options]

Options:
  --feedback <text>           Correction for regenerated sheets
  --only <categories>         Generate selected categories
  --resume                    Reuse generated sheets that match the current prompt
  --output-dir <path>         Default: .preview/<name>-images
  --image-model <model>       Default: gpt-image-2
  --fixture-dir <path>        Copy <category>.png fixtures instead of image calls
  --help                      Print this help

Reference images come from the spec's optional "reference" block. Sheets with a
reference use the image edit endpoint; every other sheet uses text-only generation.`

const [name, ...options] = process.argv.slice(2)
const readOption = (optionName: string) => {
  const index = options.indexOf(optionName)
  if (index === -1) return undefined
  const value = options[index + 1]
  if (!value || value.startsWith('--')) {
    console.error(`Missing value for ${optionName}\n${usage}`)
    process.exit(1)
  }
  return value
}

if (!name || name === '--help' || options.includes('--help')) {
  console.log(usage)
  process.exit(name ? 0 : 1)
}
if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Name must be lowercase kebab-case')
  process.exit(1)
}

const specFile = readOption('--spec-file')
if (!specFile) {
  console.error(`--spec-file is required\n${usage}`)
  process.exit(1)
}
const spec = validateThemeSpec(JSON.parse(await readFile(specFile, 'utf8')), name)
const feedback = readOption('--feedback')
const fixtureDirectory = readOption('--fixture-dir')
const resume = options.includes('--resume')
const onlyValue = readOption('--only')
const selectedCategories = (
  onlyValue
    ? onlyValue
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [...PART_CATEGORIES]
) as PartCategory[]
const unknownCategory = selectedCategories.find((entry) => !PART_CATEGORIES.includes(entry))
if (unknownCategory) {
  console.error(`Unknown --only category: ${unknownCategory}\nValid categories: ${PART_CATEGORIES.join(', ')}`)
  process.exit(1)
}
if (!selectedCategories.length) {
  console.error('--only must contain at least one category')
  process.exit(1)
}

const outputDirectory = resolve(readOption('--output-dir') ?? `.preview/${name}-images`)
const stateDirectory = join(outputDirectory, '.state')
const statePath = join(stateDirectory, 'generation.json')
const manifestPath = join(outputDirectory, 'manifest.json')
const imageModel = readOption('--image-model') ?? 'gpt-image-2'

const specDirectory = dirname(resolve(specFile))
const resolveReferenceFile = (file: string) => {
  const candidates = [resolve(outputDirectory, file), resolve(specDirectory, file), resolve(file)]
  const found = candidates.find((candidate) => existsSync(candidate))
  if (!found) throw new Error(`Reference image not found: ${file}\nLooked in:\n${candidates.join('\n')}`)
  return found
}

const referenceCategories = new Set<PartCategory>(spec.reference?.categories ?? PART_CATEGORIES)
const referenceImages: ReferenceImage[] = []
let referenceFingerprint: string | undefined
if (spec.reference) {
  const hash = createHash('sha256')
  for (const file of spec.reference.files) {
    const source = Bun.file(resolveReferenceFile(file))
    const bytes = new Uint8Array(await source.arrayBuffer())
    const fileName = basename(file)
    referenceImages.push({ name: fileName, type: source.type || 'image/png', bytes })
    hash.update(fileName)
    hash.update(bytes)
  }
  referenceFingerprint = hash.digest('hex').slice(0, 16)
}
const referencesFor = (category: PartCategory) => (referenceCategories.has(category) ? referenceImages : [])
const fingerprintFor = (category: PartCategory) => (referencesFor(category).length ? referenceFingerprint : undefined)

const canonicalSkinColor = (themeSpec: ThemeSpec) => {
  const color = themeSpec.palette.skin[0]
  if (!color) throw new Error('Theme spec must define a canonical skin color')
  return color
}

const colorsForCategory = (themeSpec: ThemeSpec, category: PartCategory) => {
  const colors: string[] = []
  const seenColors = new Set<string>()
  for (const role of PART_DEFINITIONS[category].paletteRoles) {
    const roleColors =
      role === 'outline'
        ? [themeSpec.palette.outline]
        : role === 'skin'
          ? [canonicalSkinColor(themeSpec)]
          : themeSpec.palette[role]
    for (const color of roleColors) {
      if (seenColors.has(color)) continue
      seenColors.add(color)
      colors.push(color)
    }
  }
  return colors
}

const layerContract = (themeSpec: ThemeSpec, category: PartCategory) => {
  if (category === 'faces') {
    return `Each design is one complete face layer: head silhouette, both ears, both eyes, both eyebrows, one nose, and one mouth. Use ${canonicalSkinColor(themeSpec)} as the only skin fill. Keep every head centered at the same scale, with the crown, ear line, and chin baseline in consistent positions. End at a clean closed chin with no neck. Leave a predictable outer head contour for hair overlays.

BINDING SHARED HEAD SHAPE — HIGHEST PRIORITY
All nine heads use one identical head silhouette and one identical ear construction: the same width, height, crown curve, cheek line, and chin. The nine designs differ only in eye shape, eyebrow geometry, nose simplification, mouth geometry, feature spacing, and expression. Never assign a different skull geometry per cell and never render heart-shaped, diamond, triangular, pear-shaped, square, oblong, or other novelty head outlines. A hair overlay drawn for one cell must fit every other cell exactly.

HEAD PROPORTION AND CONTOUR
The head reads clearly taller than wide: excluding the ears, its height is about 1.3 times its width. Never draw it as wide as it is tall, wider than tall, or circular.
Build the outline as one continuous curve: a smooth domed crown, its widest point across the cheekbones just below the eye line, then a clear taper through the jaw into a rounded chin. Ears attach at the temple between the eye line and the nose base and stay small enough to keep the head reading as a head, not a wide block.
Do not default to a rounded rectangle, a squared oval, a superellipse, or a shape with straight vertical sides, boxy corners, or a flat wide chin — unless the visible signature below explicitly calls for that geometry.

BINDING FACE STYLE LOCK
Visible signature: ${themeSpec.faceStyleSignature}. Treat this as a production constraint, not loose inspiration. Make the signature unmistakable in the shared head silhouette and ear construction, and in every eye shape, eyebrow rhythm, nose simplification, mouth geometry, spacing, and expression. If facial variety conflicts with the signature or with the shared head shape, preserve the signature and the shared head shape.

HIGH-END FINISH BAR
Present a resolved senior character designer's final shape-language sheet: intentional proportions, controlled negative space, elegant contour rhythm, consistent feature construction, polished asymmetry where requested, and confident economy of form. Every face must feel authored for the same premium design system. Do not fall back to generic avatar-builder faces, stock profile icons, emoji geometry, or default cartoon clip art. Within the shared head shape, make the nine faces read as materially distinct characters through feature geometry and proportion, not as one default face with swapped mouths.`
  }
  if (category === 'hairs') {
    return `Each design is a hair-only overlay. Keep the face opening, crown anchor, centerline, and category-wide scale consistent so every hair can sit over the generated faces. Row one holds the short styles, row two the medium styles, and row three the long styles, so the sheet still maps to short, medium, and long hair length.

Draw the nine styles the cell map names and no others. They belong to this theme's own world — its culture, era, and species — so build them from that vocabulary rather than defaulting to contemporary salon hairstyles. A hair sheet that would fit any theme unchanged is wrong.`
  }
  if (category === 'bodies') {
    return 'Each design is a body-only clothing layer. Leave one simple centered neckline socket in the same position and width across all nine bodies. The neck socket must remain open and unobstructed. Include no skin neck, head, jaw, ears, or hair.'
  }
  return `Each design is a neck-only connector using ${canonicalSkinColor(themeSpec)} as the only fill plus the shared outline. Keep the same top anchor, bottom anchor, total height, and centerline across all nine cells. Make the shape a simple closed vertical silhouette with flat hidden overlap ends and at most two gentle side curves. No anatomy detail, muscles, collar lines, shading, or decoration.`
}

const REFERENCE_CARRYOVER: Record<PartCategory, string> = {
  faces: 'the single shared head proportion, jaw and cranium contour, eye and eyebrow geometry, nose and mouth simplification, ear construction, feature spacing, and skin and feature color relationships',
  hairs: 'hair mass, parting logic, strand and curl grouping, silhouette edge rhythm, and hair color relationships',
  bodies: 'shoulder proportion, garment silhouette, fold and seam simplification, and clothing color relationships',
  necks: 'neck width, taper, and outline weight only',
}

const referenceContract = (themeSpec: ThemeSpec, category: PartCategory) => {
  const reference = themeSpec.reference
  if (!reference || !referenceCategories.has(category)) return ''

  const subject =
    reference.kind === 'photo' ? 'a photograph of a real person' : 'an existing mascot or character illustration'
  const intent =
    reference.intent === 'likeness'
      ? `The design in row 1, column 1 must read as a deliberate stylized translation of the reference subject: recognizably the same ${category === 'faces' ? 'feature placement, feature geometry, and proportions — the subject also defines the one head silhouette every cell shares' : 'subject at this layer'}, redrawn entirely in this sheet's flat vector language and palette. The other eight designs extend the same design system without repeating that subject.`
      : 'Take style only. Do not reproduce the reference subject, its identifying marks, or its branding in any cell.'

  return `

REFERENCE IMAGES — BINDING
The attached reference material is ${subject}, supplied as an art-direction anchor. It is not a canvas. Do not edit, crop, trace, collage, upscale, or restage the reference artwork, its background, its lighting, its framing, or any text or logo in it.
Carry over: ${REFERENCE_CARRYOVER[category]}.
Traits observed in the reference: ${reference.readout}.${reference.notes ? `\nAdditional reference direction: ${reference.notes}.` : ''}
${intent}
Redraw everything as flat vector shapes in the palette above. Where the reference conflicts with the palette, cell map, composition, or vectorization rules in this brief, this brief wins.`
}

const buildImagePrompt = (themeSpec: ThemeSpec, category: PartCategory, correction?: string) => {
  const definition = PART_DEFINITIONS[category]
  const cells = resolveVariants(themeSpec, category)
    .map((variant, index) => {
      const row = Math.floor(index / 3) + 1
      const column = (index % 3) + 1
      return `- row ${row}, column ${column}: ${variant.name} — ${variant.description}`
    })
    .join('\n')
  const categoryNote = themeSpec.categoryNotes?.[category]
  const avoided = themeSpec.avoid?.length ? ` Also avoid: ${themeSpec.avoid.join('; ')}.` : ''
  const references = themeSpec.references ? ` Visual reference direction: ${themeSpec.references}.` : ''
  const correctionText = correction
    ? `\n\nCORRECTION: ${correction}. Keep the established layer contract, cell order, palette, and art direction.`
    : ''

  return `Create one production-quality avatar layer source sheet containing only ${definition.isolatedSubject}.

ART DIRECTION
Visual family: ${themeSpec.styleFamily}. Shape language: ${themeSpec.shapeLanguage}. Line treatment: ${themeSpec.lineTreatment}. Mood: ${themeSpec.mood}. Representation goal: ${themeSpec.representation}.${references}${avoided}
Use only these palette colors: ${colorsForCategory(themeSpec, category).join(', ')}. Keep silhouette language, color roles, and stroke weight coherent across all nine designs.${categoryNote ? ` Category-specific direction: ${categoryNote}.` : ''}

EXACT CELL MAP
${cells}
The names above are instructions only. Do not render words or symbols.

LAYER CONTRACT
${layerContract(themeSpec, category)}${referenceContract(themeSpec, category)}

COMPOSITION
Render a clean 1024x1024 square contact sheet with exactly three equal visual columns and three equal visual rows. Put exactly one complete design in each invisible cell in the row-major order above. Center every design with generous white space. Keep scale and anchors consistent within the category. Do not draw cell borders, dividers, guides, labels, captions, numbers, or extra objects.

VECTORIZATION
Use large closed shapes, flat solid fills, crisp antialiased edges, and ${themeSpec.lineTreatment}. Use deliberate negative space and clear silhouette separation. No gradients, lighting, highlights, shadows, textures, grain, blur, glow, transparency, photorealism, thin decorative strokes, or micro-details. Pure solid white (#FFFFFF) background.${correctionText}`
}

const requestImage = async (prompt: string, references: ReferenceImage[]) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is required. Run: bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts',
    )
  }

  const buildRequest = (): [string, RequestInit] => {
    const authorization = { Authorization: `Bearer ${apiKey}` }
    const signal = AbortSignal.timeout(240_000)
    if (!references.length) {
      return [
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: { ...authorization, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: imageModel,
            prompt,
            size: `${SHEET_SIZE}x${SHEET_SIZE}`,
            quality: 'high',
            output_format: 'png',
            background: 'opaque',
          }),
          signal,
        },
      ]
    }

    const form = new FormData()
    form.append('model', imageModel)
    form.append('prompt', prompt)
    form.append('size', `${SHEET_SIZE}x${SHEET_SIZE}`)
    form.append('quality', 'high')
    form.append('output_format', 'png')
    for (const image of references) {
      form.append('image[]', new File([image.bytes as BlobPart], image.name, { type: image.type }))
    }
    return ['https://api.openai.com/v1/images/edits', { method: 'POST', headers: authorization, body: form, signal }]
  }

  const maxAttempts = 4
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response
    try {
      const [url, init] = buildRequest()
      response = await fetch(url, init)
    } catch (error) {
      if (attempt === maxAttempts) throw error
      console.warn(
        `Retrying image request (${attempt}/${maxAttempts}) after network error: ${error instanceof Error ? error.message : String(error)}`,
      )
      await Bun.sleep(2_000 * 2 ** (attempt - 1))
      continue
    }

    if (response.ok) return (await response.json()) as ImageResult

    const details = await response.text()
    const message = `OpenAI image generation failed (${response.status}, request ${response.headers.get('x-request-id') ?? 'unknown'}): ${details}`
    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt === maxAttempts) throw new Error(message)
    console.warn(`Retrying image request (${attempt}/${maxAttempts}) after ${message}`)
    await Bun.sleep(2_000 * 2 ** (attempt - 1))
  }
  throw new Error(`OpenAI image generation exhausted ${maxAttempts} attempts`)
}

await mkdir(stateDirectory, { recursive: true })
let state: GenerationState = { version: 1, name, categories: {} }
if (existsSync(statePath)) {
  state = validateGenerationState(JSON.parse(await readFile(statePath, 'utf8')), name)
}
const reusable = (category: PartCategory) => {
  const entry = state.categories[category]
  return Boolean(
    entry &&
      entry.prompt.startsWith(buildImagePrompt(spec, category)) &&
      entry.referenceFingerprint === fingerprintFor(category) &&
      existsSync(join(outputDirectory, entry.imageFile)),
  )
}

const categoriesToGenerate: PartCategory[] = []
for (const category of selectedCategories) {
  if (resume && reusable(category)) {
    console.log(`Reusing ${category}.png`)
  } else {
    categoriesToGenerate.push(category)
  }
}
if (categoriesToGenerate.length) await rm(manifestPath, { force: true })

for (const category of categoriesToGenerate) {
  const prompt = buildImagePrompt(spec, category, feedback)
  const references = referencesFor(category)
  const candidatePath = join(stateDirectory, `${category}.candidate.png`)
  if (fixtureDirectory) {
    await copyFile(join(fixtureDirectory, `${category}.png`), candidatePath)
  } else {
    if (references.length) console.log(`Generating ${category}.png from ${references.length} reference image(s)`)
    const result = await requestImage(prompt, references)
    const imageBase64 = result.data?.[0]?.b64_json
    if (!imageBase64) throw new Error(`${category} generation returned no base64 image`)
    await writeFile(candidatePath, Buffer.from(imageBase64, 'base64'))
  }
  await rename(candidatePath, join(outputDirectory, `${category}.png`))
  const fingerprint = fingerprintFor(category)
  state.categories[category] = {
    prompt,
    imageFile: `${category}.png`,
    ...(fingerprint ? { referenceFingerprint: fingerprint } : {}),
  }
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`)
  console.log(`Wrote ${category}.png`)
}

const missingCategories = PART_CATEGORIES.filter((category) => !reusable(category))
if (missingCategories.length) {
  console.log(`Checkpoint saved. Remaining sheets: ${missingCategories.join(', ')}`)
  process.exit(0)
}

const categories = {} as Record<PartCategory, ImageCategoryManifest>
for (const category of PART_CATEGORIES) {
  const entry = state.categories[category]
  if (!entry) throw new Error(`Missing generation state for ${category}`)
  categories[category] = {
    variants: resolveVariants(spec, category).map((variant) => ({ ...variant })),
    palette: colorsForCategory(spec, category),
    prompt: entry.prompt,
    imageFile: entry.imageFile,
    ...(spec.reference && referencesFor(category).length ? { referenceFiles: [...spec.reference.files] } : {}),
    ...(entry.referenceFingerprint ? { referenceFingerprint: entry.referenceFingerprint } : {}),
  }
}

const manifest: ImageManifest = {
  version: 4,
  name,
  imageModel,
  sheetSize: SHEET_SIZE,
  spec,
  ...(feedback ? { feedback } : {}),
  categories,
}
const validatedManifest = validateImageManifest(manifest, name)
await writeFile(manifestPath, `${JSON.stringify(validatedManifest, null, 2)}\n`)
console.log(`Wrote image manifest to ${manifestPath}`)
