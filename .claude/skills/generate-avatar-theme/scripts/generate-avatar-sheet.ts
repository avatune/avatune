#!/usr/bin/env bun
/**
 * Enhance an avatar art brief and generate one 3x3 image sheet for each
 * configurable avatar-part category through scripted OpenAI calls.
 */
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import {
  type EnhancedPrompt,
  type ImageCategoryManifest,
  type ImageManifest,
  PART_CATEGORIES,
  PART_DEFINITIONS,
  type PartCategory,
  validateEnhancedPrompt,
  validateImageManifest,
} from './avatar-theme-manifest'

interface ResponsesResult {
  status?: string
  output_text?: string
  output?: Array<{
    content?: Array<{ type?: string; text?: string; refusal?: string }>
  }>
}

interface ImageResult {
  data?: Array<{ b64_json?: string }>
}

const usage = `Usage:
  bun generate-avatar-sheet.ts <name> --brief <text> [options]
  bun generate-avatar-sheet.ts <name> --brief-file <path> [options]

Options:
  --feedback <text>           Correction from rejected image sheets
  --only <categories>         Regenerate categories in an existing output directory
  --output-dir <path>         Default: .preview/<name>-images
  --enhancer-model <model>    Default: gpt-5.6
  --image-model <model>       Default: gpt-image-2
  --fixture-manifest <path>   Skip prompt-enhancement API call
  --fixture-dir <path>        Copy <category>.png fixtures instead of image calls
  --help                      Print this help`

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

const briefValue = readOption('--brief')
const briefFile = readOption('--brief-file')
if (briefValue && briefFile) {
  console.error('Use either --brief or --brief-file, not both')
  process.exit(1)
}
const fixtureManifestPath = readOption('--fixture-manifest')
const fixtureDirectory = readOption('--fixture-dir')
if (Boolean(fixtureManifestPath) !== Boolean(fixtureDirectory)) {
  console.error('--fixture-manifest and --fixture-dir must be used together')
  process.exit(1)
}

const feedback = readOption('--feedback')
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

const outputDirectory = resolve(readOption('--output-dir') ?? `.preview/${name}-images`)
const manifestPath = join(outputDirectory, 'manifest.json')
if (onlyValue && !existsSync(manifestPath)) {
  console.error(`--only requires an existing image manifest at ${manifestPath}`)
  process.exit(1)
}

const enhancerModel = readOption('--enhancer-model') ?? 'gpt-5.6'
const imageModel = readOption('--image-model') ?? 'gpt-image-2'
const brief = briefValue ?? (briefFile ? (await readFile(briefFile, 'utf8')).trim() : '')
if (!brief && !fixtureManifestPath) {
  console.error('A non-empty --brief or --brief-file is required')
  process.exit(1)
}

const categorySchema = Object.fromEntries(
  PART_CATEGORIES.map((category) => [
    category,
    {
      type: 'object',
      additionalProperties: false,
      required: ['names', 'subject'],
      properties: {
        names: {
          type: 'array',
          minItems: 9,
          maxItems: 9,
          items: { type: 'string', pattern: '^[a-z][A-Za-z0-9]*$' },
        },
        subject: { type: 'string', minLength: 80 },
      },
    },
  ]),
)
const promptSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['artDirection', 'categories'],
  properties: {
    artDirection: { type: 'string', minLength: 80 },
    categories: {
      type: 'object',
      additionalProperties: false,
      required: [...PART_CATEGORIES],
      properties: categorySchema,
    },
  },
} as const

const categoryRequirements = PART_CATEGORIES.map(
  (category) => `- ${category}: ${PART_DEFINITIONS[category].isolatedSubject}`,
).join('\n')
const enhancerInstructions = `You are an art director preparing isolated avatar-part image sheets for manual vector conversion.
Preserve the user's visual theme, but simplify aggressively and keep all categories stylistically compatible.

Create prompt specifications for these isolated categories:
${categoryRequirements}

For every category, return exactly nine materially distinct camelCase names in row-major order and a subject describing all nine variations. Each image will be a strict 3x3 contact sheet containing only that isolated category.
For hair specifically, order the first row as short styles, the second row as medium styles, and the third row as long styles.

Optimize the artwork for clean manual vectorization:
- large closed shapes, clean silhouettes, and flat solid fills
- one consistent bold outline or no outline
- no gradients, lighting, blur, texture, noise, glow, transparency, shadows, thin strokes, or micro-details
- no heads or faces leaking into isolated feature sheets
- no text, labels, numbers, borders, dividers, grid lines, or alignment guides
- pure white background

The artDirection must define one coherent silhouette language, stroke weight, and simplification level shared by every category.`

const requestOpenAI = async <T>(path: string, body: unknown): Promise<T> => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is required. Run: bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts',
    )
  }

  const maxAttempts = 4
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const lastAttempt = attempt === maxAttempts
    try {
      const response = await fetch(`https://api.openai.com/v1${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(240_000),
      })
      if (response.ok) return (await response.json()) as T

      const details = await response.text()
      const message = `OpenAI ${path} failed (${response.status}, request ${response.headers.get('x-request-id') ?? 'unknown'}): ${details}`
      if (lastAttempt || (response.status !== 429 && response.status < 500)) throw new Error(message)
      console.warn(`Retrying (${attempt}/${maxAttempts}) after ${message}`)
    } catch (error) {
      if (lastAttempt || (error instanceof Error && error.message.startsWith('OpenAI '))) throw error
      console.warn(
        `Retrying (${attempt}/${maxAttempts}) after network error on ${path}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
    const { promise, resolve } = Promise.withResolvers<void>()
    setTimeout(resolve, 2_000 * 2 ** (attempt - 1))
    await promise
  }
  throw new Error(`OpenAI ${path} exhausted ${maxAttempts} attempts`)
}

const extractResponseText = (response: ResponsesResult) => {
  if (response.output_text) return response.output_text
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'refusal') {
        throw new Error(`Prompt enhancement refused: ${content.refusal ?? 'unknown reason'}`)
      }
      if (content.type === 'output_text' && content.text) return content.text
    }
  }
  throw new Error(`Prompt enhancement returned no output text (status: ${response.status ?? 'unknown'})`)
}

const buildImagePrompt = (prompt: EnhancedPrompt, category: PartCategory) => {
  const part = prompt.categories[category]
  const composition = `Strict 3x3 contact sheet with exactly three equal columns and three equal rows. One isolated ${category} design per cell. Enlarge every design to fill 65-75% of its cell. Center each design independently with an 8% safe margin. No complete avatars, heads, faces, reference anatomy, borders, dividers, labels, numbers, captions, alignment guides, or extra objects.`
  const style = `${prompt.artDirection} Render ${PART_DEFINITIONS[category].isolatedSubject}. Use only colors close to ${PART_DEFINITIONS[category].palette.join(', ')}. Use large closed shapes, flat solid fills, crisp edges, and uniform bold strokes. No gradients, lighting, highlights, shadows, textures, noise, transparency, or photorealism.`
  return `${part.subject}\n\nComposition: ${composition}\n\nStyle: ${style}\n\nPure solid white background.`
}

let enhancedPrompt: EnhancedPrompt
if (fixtureManifestPath && fixtureDirectory) {
  enhancedPrompt = validateEnhancedPrompt(JSON.parse(await readFile(fixtureManifestPath, 'utf8')))
} else {
  const input = feedback ? `${brief}\n\nCorrective feedback from rejected sheets:\n${feedback}` : brief
  const response = await requestOpenAI<ResponsesResult>('/responses', {
    model: enhancerModel,
    instructions: enhancerInstructions,
    input,
    store: false,
    text: {
      format: {
        type: 'json_schema',
        name: 'avatar_part_image_prompt',
        strict: true,
        schema: promptSchema,
      },
    },
  })
  enhancedPrompt = validateEnhancedPrompt(JSON.parse(extractResponseText(response)))
}

await mkdir(outputDirectory, { recursive: true })


const existingManifest = onlyValue
  ? validateImageManifest(JSON.parse(await readFile(manifestPath, 'utf8')), name)
  : undefined
const categories = existingManifest
  ? { ...existingManifest.categories }
  : ({} as Record<PartCategory, ImageCategoryManifest>)

for (const category of selectedCategories) {
  const imageFile = `${category}.png`
  const imagePath = join(outputDirectory, imageFile)

  if (fixtureDirectory) {
    await copyFile(join(fixtureDirectory, imageFile), imagePath)
  } else {
    const image = await requestOpenAI<ImageResult>('/images/generations', {
      model: imageModel,
      prompt: buildImagePrompt(enhancedPrompt, category),
      size: '1024x1024',
      quality: 'high',
      output_format: 'png',
      background: 'opaque',
    })
    const imageBase64 = image.data?.[0]?.b64_json
    if (!imageBase64) throw new Error(`${category} generation returned no base64 image`)
    await writeFile(imagePath, Buffer.from(imageBase64, 'base64'))
  }

  const metadata = await sharp(imagePath).metadata()
  if (!metadata.width || !metadata.height || metadata.width !== metadata.height) {
    throw new Error(`${category} contact sheet must be square, received ${metadata.width ?? '?'}x${metadata.height ?? '?'}`)
  }

  categories[category] = {
    ...enhancedPrompt.categories[category],
    palette: [...PART_DEFINITIONS[category].palette],
    prompt: buildImagePrompt(enhancedPrompt, category),
    imageFile,
  }
  console.log(`Wrote ${category} sheet to ${imagePath}`)
}

const manifest: ImageManifest = {
  version: 1,
  name,
  brief: brief || existingManifest?.brief || 'fixture',
  ...(feedback ? { feedback } : {}),
  enhancerModel,
  imageModel,
  artDirection: enhancedPrompt.artDirection,
  categories,
}
const validatedManifest = validateImageManifest(manifest, name)
await writeFile(manifestPath, `${JSON.stringify(validatedManifest, null, 2)}\n`)
console.log(`Wrote image manifest to ${manifestPath}`)
