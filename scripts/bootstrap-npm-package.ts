#!/usr/bin/env bun
/**
 * Reserves unpublished workspace packages on npm so they can publish via OIDC.
 *
 * npm trusted publishing can only be configured on a package that already
 * exists on the registry, so a package's very first release can never come
 * from CI — it fails with ENEEDAUTH. This publishes a throwaway 0.0.0 under
 * the `bootstrap` dist-tag from your logged-in machine, after which the
 * trusted publisher can be configured and the real version ships from CI.
 *
 * Usage: bun run release:bootstrap [--dry-run]
 */

import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'

const REPOSITORY = 'avatune/avatune'
const WORKFLOW_FILE = 'release-packages.yml'
const ENVIRONMENT = 'production'
const PLACEHOLDER_VERSION = '0.0.0'
const PLACEHOLDER_TAG = 'bootstrap'
const REGISTRY = 'https://registry.npmjs.org'

interface Manifest {
  name: string
  version: string
  private?: boolean
  description?: string
  homepage?: string
  license?: string
  author?: string
  repository?: unknown
}

const root = resolve(import.meta.dir, '..')

const readJson = async <T>(path: string) => (await Bun.file(path).json()) as T

const discoverPublishablePackages = async (): Promise<Manifest[]> => {
  const { workspaces } = await readJson<{ workspaces: string[] }>(
    join(root, 'package.json'),
  )
  const { ignore } = await readJson<{ ignore: string[] }>(
    join(root, '.changeset', 'config.json'),
  )
  const ignored = new Set(ignore)

  const manifests: Manifest[] = []
  for (const pattern of workspaces) {
    const glob = new Bun.Glob(`${pattern}/package.json`)
    for (const match of glob.scanSync({ cwd: root })) {
      const manifest = await readJson<Manifest>(join(root, match))
      if (manifest.private || ignored.has(manifest.name)) continue
      manifests.push(manifest)
    }
  }

  return manifests.sort((a, b) => a.name.localeCompare(b.name))
}

const isUnpublished = async (name: string): Promise<boolean> => {
  const response = await fetch(`${REGISTRY}/${name.replace('/', '%2f')}`, {
    method: 'HEAD',
  })
  if (response.status === 404) return true
  if (response.ok) return false
  throw new Error(`Registry lookup for ${name} failed: ${response.status}`)
}

const requireNpmUser = (): string => {
  const { exitCode, stdout } = Bun.spawnSync(['npm', 'whoami'])
  if (exitCode !== 0) {
    throw new Error('Not logged in to npm — run `npm login` first')
  }
  return stdout.toString().trim()
}

const parseSelection = (input: string, total: number): number[] => {
  const answer = input.trim().toLowerCase()
  if (!answer) return []
  if (answer === 'a' || answer === 'all') {
    return Array.from({ length: total }, (_, index) => index)
  }

  const selected = new Set<number>()
  for (const token of answer.split(/[\s,]+/)) {
    const position = Number(token)
    if (!Number.isInteger(position) || position < 1 || position > total) {
      throw new Error(`Invalid selection: ${token}`)
    }
    selected.add(position - 1)
  }
  return [...selected].sort((a, b) => a - b)
}

const promptSelection = async (manifests: Manifest[]): Promise<Manifest[]> => {
  console.log('\nUnpublished packages:\n')
  manifests.forEach((manifest, index) => {
    console.log(`  ${index + 1}) ${manifest.name}  (local ${manifest.version})`)
  })

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    const answer = await readline.question(
      '\nSelect packages to bootstrap ("1 3", "a" for all, empty to abort): ',
    )
    return parseSelection(answer, manifests.length).map(
      (index) => manifests[index],
    )
  } finally {
    readline.close()
  }
}

const publishPlaceholder = (manifest: Manifest, dryRun: boolean): boolean => {
  const directory = mkdtempSync(join(tmpdir(), 'avatune-bootstrap-'))
  const placeholder = {
    name: manifest.name,
    version: PLACEHOLDER_VERSION,
    description: `Placeholder reserving ${manifest.name} — see the ${PLACEHOLDER_TAG} tag. The first real release follows shortly.`,
    homepage: manifest.homepage,
    repository: manifest.repository,
    license: manifest.license,
    author: manifest.author,
    publishConfig: { access: 'public' },
  }

  writeFileSync(
    join(directory, 'package.json'),
    `${JSON.stringify(placeholder, null, 2)}\n`,
  )
  writeFileSync(
    join(directory, 'README.md'),
    `# ${manifest.name}\n\nPlaceholder release. This name is reserved; the first real version is on its way.\n`,
  )

  const args = ['publish', '--access', 'public', '--tag', PLACEHOLDER_TAG]
  if (dryRun) args.push('--dry-run')

  const { exitCode } = Bun.spawnSync(['npm', ...args], {
    cwd: directory,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  })
  return exitCode === 0
}

const printTrustedPublisherSteps = (manifests: Manifest[]) => {
  console.log(
    '\nNow configure the trusted publisher for each package on npmjs.com:\n',
  )
  for (const manifest of manifests) {
    console.log(`  ${manifest.name}`)
    console.log(
      `    https://www.npmjs.com/package/${manifest.name}/access → Trusted Publisher → GitHub Actions`,
    )
  }
  console.log(`\n  Organization / repository: ${REPOSITORY}`)
  console.log(`  Workflow filename:         ${WORKFLOW_FILE}`)
  console.log(`  Environment:               ${ENVIRONMENT}`)
  console.log(
    '\nnpm does not validate this on save — a typo only surfaces as ENEEDAUTH at publish time.',
  )
  console.log('Then re-run the Release Packages workflow.\n')
}

const main = async () => {
  const dryRun = Bun.argv.includes('--dry-run')
  const user = requireNpmUser()

  const manifests = await discoverPublishablePackages()
  const flags = await Promise.all(
    manifests.map((manifest) => isUnpublished(manifest.name)),
  )
  const unpublished = manifests.filter((_, index) => flags[index])

  if (unpublished.length === 0) {
    console.log('Every publishable workspace package already exists on npm.')
    return
  }

  const taken = unpublished.filter(
    (manifest) => manifest.version === PLACEHOLDER_VERSION,
  )
  for (const manifest of taken) {
    console.warn(
      `Skipping ${manifest.name} — its local version is ${PLACEHOLDER_VERSION}, which the placeholder would consume.`,
    )
  }

  const selected = await promptSelection(
    unpublished.filter((manifest) => !taken.includes(manifest)),
  )
  if (selected.length === 0) {
    console.log('Nothing selected.')
    return
  }

  console.log(
    `\nPublishing ${selected.length} placeholder(s) as ${user}${dryRun ? ' (dry run)' : ''}…\n`,
  )

  const published: Manifest[] = []
  for (const manifest of selected) {
    if (publishPlaceholder(manifest, dryRun)) {
      published.push(manifest)
      continue
    }
    console.error(`Failed to publish placeholder for ${manifest.name}`)
  }

  if (published.length > 0 && !dryRun) printTrustedPublisherSteps(published)
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
