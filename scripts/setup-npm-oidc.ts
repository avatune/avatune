#!/usr/bin/env bun
/**
 * Reserves unpublished workspace packages on npm and registers their trusted
 * publisher, so a package's first real release can ship from CI.
 *
 * npm trusted publishing can only be configured on a package that already
 * exists on the registry, so a package's very first release can never come
 * from CI — it fails with ENEEDAUTH. This publishes a throwaway
 * `0.0.0-oidc-seed` under the `oidc-seed` dist-tag from your logged-in
 * machine, then registers the trusted publisher for it. The placeholder is
 * deliberate: a prerelease matches no `^x.y.z` range and a non-`latest` tag is
 * not what a bare `npm install` resolves, so it cannot be reached by accident
 * and it burns no real version number.
 *
 * Idempotent: packages carrying a real release are skipped entirely, and a
 * package seeded by an earlier run that failed to trust is picked up again.
 *
 * If `npm profile get` reports 2FA as "auth-and-writes", every publish and
 * every trust registration waits on a browser prompt this script cannot
 * surface. Relax it for the duration:
 *
 *   npm profile enable-2fa auth-only
 *   bun run setup:npm-oidc
 *   npm profile enable-2fa auth-and-writes
 *
 * Usage: bun run setup:npm-oidc [--dry-run]
 */

import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'

// Must match release-packages.yml: npm verifies the workflow filename and the
// job's `environment:` as part of the OIDC claim.
const REPOSITORY = 'avatune/avatune'
const WORKFLOW = 'release-packages.yml'
const ENVIRONMENT = 'production'

const SEED_VERSION = '0.0.0-oidc-seed'
const SEED_TAG = 'oidc-seed'
const REGISTRY = 'https://registry.npmjs.org'
// `npm trust` landed in 11.5.1.
const MINIMUM_NPM = [11, 5, 1]

interface Manifest {
  name: string
  version: string
  private?: boolean
  homepage?: string
  license?: string
  author?: string
  repository?: unknown
}

interface Candidate {
  manifest: Manifest
  seeded: boolean
}

type StepResult = { ok: true; existed: boolean } | { ok: false; error: string }

const root = resolve(import.meta.dir, '..')

const readJson = async <T>(path: string) => (await Bun.file(path).json()) as T

interface NpmOptions {
  cwd?: string
  interactive?: boolean
}

const runNpm = (args: string[], { cwd, interactive }: NpmOptions = {}) => {
  const { exitCode, stdout, stderr } = Bun.spawnSync(['npm', ...args], {
    cwd,
    stdin: 'inherit',
    stdout: interactive ? 'inherit' : 'pipe',
    stderr: interactive ? 'inherit' : 'pipe',
  })
  // Nothing to classify when the streams went straight to the terminal.
  return {
    exitCode,
    output: `${stdout?.toString() ?? ''}${stderr?.toString() ?? ''}`,
  }
}

const needsOtp = (output: string) => /EOTP|one-time password/i.test(output)

/**
 * npm's browser-based 2FA flow only starts on a TTY, so a captured run fails
 * with EOTP rather than showing the URL it wants you to open. Retry those with
 * the terminal attached — the output is no longer classifiable, but the exit
 * code still is, and you can actually authenticate.
 */
const runNpmWithAuth = (args: string[], cwd?: string) => {
  const captured = runNpm(args, { cwd })
  if (captured.exitCode === 0 || !needsOtp(captured.output)) return captured

  console.log('  npm wants a one-time password — reopening the prompt…')
  return runNpm(args, { cwd, interactive: true })
}

/** The `npm error ...` lines, which is the part worth showing on a failure. */
const npmErrorSummary = (output: string) => {
  const errors = output
    .split('\n')
    .filter((line) => line.includes('npm error'))
    .slice(0, 3)
  return errors.join('; ') || output.trim().split('\n').at(-1) || 'npm failed'
}

const isAtLeast = (version: string, minimum: number[]) => {
  const parts = version.split('.').map(Number)
  for (const [index, floor] of minimum.entries()) {
    const part = parts[index] ?? 0
    if (part !== floor) return part > floor
  }
  return true
}

const requireNpmTrust = () => {
  const { exitCode, output } = runNpm(['--version'])
  if (exitCode !== 0) throw new Error('Could not determine the npm version')

  const version = output.trim()
  if (!isAtLeast(version, MINIMUM_NPM)) {
    throw new Error(
      `npm ${version} has no \`npm trust\` — run \`npm install --global npm@${MINIMUM_NPM.join('.')}\` or newer`,
    )
  }
}

const requireNpmUser = (): string => {
  const { exitCode, output } = runNpm(['whoami'])
  if (exitCode !== 0) {
    throw new Error('Not logged in to npm — run `npm login` first')
  }
  return output.trim()
}

const publishablePackages = async (): Promise<Manifest[]> => {
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

/** Every published version; empty when npm has never seen the name. */
const publishedVersions = async (name: string): Promise<string[]> => {
  const response = await fetch(`${REGISTRY}/${name.replace('/', '%2f')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  })
  if (response.status === 404) return []
  // Anything else — a network blip, a rate limit — means *unknown*, which is
  // not the same as unpublished.
  if (!response.ok) {
    throw new Error(`Registry lookup for ${name} failed: ${response.status}`)
  }

  const { versions } = (await response.json()) as {
    versions?: Record<string, unknown>
  }
  return Object.keys(versions ?? {})
}

/** Null once a package carries a real release — nothing left to set up. */
const toCandidate = (
  manifest: Manifest,
  versions: string[],
): Candidate | null => {
  if (versions.some((version) => version !== SEED_VERSION)) return null
  return { manifest, seeded: versions.includes(SEED_VERSION) }
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

const promptSelection = async (
  candidates: Candidate[],
): Promise<Candidate[]> => {
  console.log('\nPackages without a release:\n')
  candidates.forEach(({ manifest, seeded }, index) => {
    const state = seeded ? 'seeded, needs trust' : 'needs seed + trust'
    console.log(
      `  ${index + 1}) ${manifest.name}  (local ${manifest.version}) — ${state}`,
    )
  })

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    const answer = await readline.question(
      '\nSelect packages to set up ("1 3", "a" for all, empty to abort): ',
    )
    return parseSelection(answer, candidates.length).map(
      (index) => candidates[index],
    )
  } finally {
    readline.close()
  }
}

/**
 * Claims the name with a placeholder published from a temp directory, so the
 * workspace manifest is never touched and nothing has to be built first.
 */
const seed = (manifest: Manifest, dryRun: boolean): StepResult => {
  const directory = mkdtempSync(join(tmpdir(), 'avatune-oidc-seed-'))
  const placeholder = {
    name: manifest.name,
    version: SEED_VERSION,
    description: `Placeholder reserving ${manifest.name} — see the ${SEED_TAG} tag. The first real release follows shortly.`,
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

  const args = ['publish', '--access', 'public', '--tag', SEED_TAG]
  if (dryRun) args.push('--dry-run')

  const { exitCode, output } = runNpmWithAuth(args, directory)
  if (exitCode === 0) return { ok: true, existed: false }
  // The registry is eventually consistent: a name published minutes ago can
  // still read as missing. Refusing the duplicate is npm doing its job.
  if (/cannot publish over|previously published|EPUBLISHCONFLICT/i.test(output))
    return { ok: true, existed: true }
  return { ok: false, error: npmErrorSummary(output) }
}

/**
 * There is deliberately no check-before-write: `npm trust list` is OTP-gated
 * even on a read, so asking is less reliable than trying. npm answers a
 * duplicate with 409 Conflict, which is the authoritative "already trusted".
 */
const trust = (name: string, dryRun: boolean): StepResult => {
  const args = [
    'trust',
    'github',
    name,
    '--file',
    WORKFLOW,
    '--repo',
    REPOSITORY,
    '--env',
    ENVIRONMENT,
    '--allow-publish',
    '--yes',
  ]
  // `npm trust` has no --dry-run of its own.
  if (dryRun) {
    console.log(`  would run: npm ${args.join(' ')}`)
    return { ok: true, existed: false }
  }

  const { exitCode, output } = runNpmWithAuth(args)
  if (exitCode === 0) return { ok: true, existed: false }
  if (/\b409\b|conflict/i.test(output)) return { ok: true, existed: true }
  return { ok: false, error: npmErrorSummary(output) }
}

/**
 * An account on "auth-and-writes" is asked to authenticate for every publish
 * and every trust registration, which no amount of retrying makes pleasant.
 */
const printOtpSteps = () => {
  console.error(
    [
      '\nnpm asked for a one-time password on every write. If `npm profile get`',
      'reports 2FA as "auth-and-writes", relax it for the duration:',
      '',
      '  npm profile enable-2fa auth-only',
      '  bun run setup:npm-oidc',
      '  npm profile enable-2fa auth-and-writes',
    ].join('\n'),
  )
}

const printManualSteps = (names: string[]) => {
  console.error('\nConfigure these by hand on npmjs.com:\n')
  for (const name of names) {
    console.error(
      `  ${name}\n    https://www.npmjs.com/package/${name}/access → Trusted Publisher → GitHub Actions`,
    )
  }
  console.error(`\n  Organization / repository: ${REPOSITORY}`)
  console.error(`  Workflow filename:         ${WORKFLOW}`)
  console.error(`  Environment:               ${ENVIRONMENT}`)
  console.error(
    '\nnpm does not validate this on save — a typo only surfaces as ENEEDAUTH at publish time.\n',
  )
}

const main = async () => {
  const dryRun = Bun.argv.includes('--dry-run')

  requireNpmTrust()
  const user = requireNpmUser()

  const candidates = (
    await Promise.all(
      (
        await publishablePackages()
      ).map(async (manifest) =>
        toCandidate(manifest, await publishedVersions(manifest.name)),
      ),
    )
  ).filter((candidate): candidate is Candidate => candidate !== null)

  if (candidates.length === 0) {
    console.log(
      'Every publishable workspace package is already released on npm.',
    )
    return
  }

  const selected = await promptSelection(candidates)
  if (selected.length === 0) {
    console.log('Nothing selected.')
    return
  }

  console.log(
    `\nSetting up ${selected.length} package(s) as ${user}${dryRun ? ' (dry run)' : ''}…\n`,
  )

  const failed: { name: string; error: string }[] = []
  for (const { manifest, seeded } of selected) {
    const name = manifest.name

    if (seeded) {
      console.log(`▸ ${name} — already seeded ${SEED_VERSION}`)
    } else {
      const result = seed(manifest, dryRun)
      if (!result.ok) {
        console.error(`▸ ${name} — seed failed: ${result.error}`)
        failed.push({ name, error: result.error })
        continue
      }
      console.log(
        `▸ ${name} — ${result.existed ? 'already seeded' : 'seeded'} ${SEED_VERSION}`,
      )
    }

    const trusted = trust(name, dryRun)
    if (!trusted.ok) {
      console.error(`  trust failed: ${trusted.error}`)
      failed.push({ name, error: trusted.error })
      continue
    }
    console.log(
      `  trusted publisher ${trusted.existed ? 'already registered' : 'registered'}`,
    )
  }

  if (failed.length === 0) {
    console.log('\nDone. Add a changeset and let the release workflow publish.')
    return
  }

  const names = failed.map(({ name }) => name)
  console.error(`\nfailed: ${names.join(', ')}\n  Re-run to retry these.`)
  if (failed.some(({ error }) => needsOtp(error))) printOtpSteps()
  printManualSteps(names)
  process.exitCode = 1
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
