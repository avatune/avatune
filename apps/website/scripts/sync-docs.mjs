import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..', '..')
const docsRoot = path.resolve(__dirname, '..', 'src', 'content', 'docs')

const SOURCE_DIRS = ['apps', 'packages'].map((dir) =>
  path.resolve(repoRoot, dir),
)
const GENERATED_DIRS = ['apps', 'packages'].map((dir) =>
  path.resolve(docsRoot, dir),
)
const IGNORE_DIR_NAMES = new Set([
  '.git',
  '.github',
  '.husky',
  '.idea',
  '.vscode',
  '.turbo',
  'dist',
  'build',
  'coverage',
  'out',
  '.next',
  '.astro',
  '.vercel',
  'node_modules',
])

const SKIP_PREFIXES = [
  path.resolve(repoRoot, 'apps/website/src/content/docs'),
  path.resolve(repoRoot, 'apps/website/.astro'),
  path.resolve(repoRoot, 'apps/website/node_modules'),
]

const frontmatterValue = (value) => {
  if (!value) return '""'
  return JSON.stringify(value)
}

const toHumanTitle = (relativePath, fallback) => {
  const segments = relativePath.split(path.sep).filter(Boolean)
  if (segments.length >= 2) {
    const [, second] = segments.slice(-2)
    if (second && second !== 'README.md') {
      return second.replace(/[-_]/g, ' ')
    }
  }
  return fallback || relativePath.split(path.sep).pop() || 'Documentation'
}

const normalizeLines = (content) => content.split(/\r?\n/)

const toPosixPath = (value) => value.split(path.sep).join('/')

const rewriteRelativeImages = (markdown, relativePath) => {
  const matcher = /!\[([^\]]*)\]\(((?!https?:\/\/)(?!\/)(?!data:)(?!#)[^)]+)\)/g
  const baseDir = path.dirname(relativePath)
  return markdown.replace(matcher, (_, altText, target) => {
    const joinedPath = path.join(baseDir, target)
    const normalizedPath = toPosixPath(path.normalize(joinedPath))
    const label =
      altText && altText.trim().length > 0 ? altText.trim() : normalizedPath
    return `**${label}** (\`${normalizedPath}\`)`
  })
}

const extractMetadata = (content, relativePath) => {
  const lines = normalizeLines(content)
  let index = 0
  while (index < lines.length && lines[index].trim() === '') {
    index += 1
  }

  let title
  if (index < lines.length && /^#\s+/.test(lines[index].trim())) {
    title = lines[index].replace(/^#\s+/, '').trim()
    lines.splice(index, 1)
  } else {
    title = toHumanTitle(relativePath, path.basename(relativePath, '.md'))
  }

  let description = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    description = trimmed
    break
  }

  if (!description) {
    description = `${title} documentation for Avatune.`
  }

  const body = lines.join('\n').trim()
  const safeBody = rewriteRelativeImages(body, relativePath)

  return { title, description, body: safeBody }
}

const shouldSkipPath = (targetPath) => {
  const normalized = path.resolve(targetPath)
  return SKIP_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

const walkDir = async (dir, handleFile) => {
  if (shouldSkipPath(dir)) {
    return
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORE_DIR_NAMES.has(entry.name) || shouldSkipPath(fullPath)) {
        continue
      }

      await walkDir(fullPath, handleFile)
      continue
    }

    if (!entry.isFile()) continue
    if (!entry.name.toLowerCase().endsWith('.md')) continue
    if (shouldSkipPath(fullPath)) continue

    await handleFile(fullPath)
  }
}

const ensureDir = async (targetDir) => fs.mkdir(targetDir, { recursive: true })

const cleanGeneratedDirs = async () => {
  await Promise.all(
    GENERATED_DIRS.map(async (dir) => {
      await fs.rm(dir, { recursive: true, force: true })
    }),
  )
}

const syncDocs = async () => {
  await cleanGeneratedDirs()

  const results = []

  const processFile = async (filePath) => {
    const relativePath = path.relative(repoRoot, filePath)
    const segments = relativePath.split(path.sep)
    const originalFileName = segments.pop() || 'index.md'
    const destinationFileName = /^readme\.md$/i.test(originalFileName)
      ? 'index.mdx'
      : originalFileName.replace(/\.md$/i, '.mdx')
    const normalizedRelativePath = path.join(...segments, destinationFileName)
    const destinationPath = path.resolve(docsRoot, normalizedRelativePath)
    await ensureDir(path.dirname(destinationPath))
    const rawContent = await fs.readFile(filePath, 'utf8')
    const { title, description, body } = extractMetadata(
      rawContent,
      relativePath,
    )

    const note = `> Source: \`${relativePath}\``
    const syncedBody = body.length > 0 ? `${note}\n\n${body}\n` : `${note}\n`

    const finalContent = [
      '---',
      `title: ${frontmatterValue(title)}`,
      `description: ${frontmatterValue(description)}`,
      `source: ${frontmatterValue(relativePath)}`,
      '---',
      '',
      syncedBody,
    ].join('\n')

    await fs.writeFile(destinationPath, finalContent, 'utf8')
    results.push(relativePath)
  }

  for (const sourceDir of SOURCE_DIRS) {
    try {
      await fs.access(sourceDir)
    } catch {
      continue
    }
    await walkDir(sourceDir, processFile)
  }

  console.log(`Synced ${results.length} markdown files into docs.`)
}

syncDocs().catch((error) => {
  console.error('Failed to sync docs:', error)
  process.exitCode = 1
})
