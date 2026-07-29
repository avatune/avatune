import { existsSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { toThemeData } from '../apps/studio/src/components/studio/theme-export'
import type { BuilderAsset } from '../apps/studio/src/hooks/use-builder'
import type { ThemeFillBindings } from '../apps/studio/src/types'
import { toCamelCase } from '../apps/studio/src/utils/caseUtils'
import { generateThemeFile } from '../apps/studio/src/utils/generators'
import { parseStudioProject } from '../apps/studio/src/utils/studioProject'
import { generateThemeColors } from '../apps/studio/src/utils/templates'
import {
  readItemSvg,
  readThemedFills,
  readThemePackage,
  resolveThemeDirectory,
} from './theme-package'

/**
 * Files a merge owns. Everything else in the package — package.json, README,
 * CHANGELOG, licenses, build config and the artwork itself — is hand-maintained
 * or generated as a set, so it is never touched here.
 */
const MERGED_FILES = ['shared.ts', 'colors.ts'] as const

interface FileChange {
  path: string
  contents: string
  changed: boolean
}

const compare = (target: string, contents: string): FileChange => ({
  path: target,
  contents,
  changed: !existsSync(target) || readFileSync(target, 'utf8') !== contents,
})

/**
 * Artwork lives outside a config merge, so anything the project changed about it
 * is reported rather than written — the alternative is rewriting every SVG and
 * the asset package's color map together, which a config merge deliberately
 * avoids.
 */
const describeAssetDrift = (
  projectAssets: BuilderAsset[],
  themePackage: Awaited<ReturnType<typeof readThemePackage>>,
) => {
  const notes: string[] = []
  const projectItems = new Map(
    projectAssets.map((asset) => [
      `${asset.category}.${toCamelCase(asset.name)}`,
      asset,
    ]),
  )

  const added = [...projectItems.keys()].filter(
    (item) => !themePackage.svgPathByItem.has(item),
  )
  const removed = [...themePackage.svgPathByItem.keys()].filter(
    (item) => !projectItems.has(item),
  )
  for (const item of added) {
    notes.push(`${item}: added in Studio — artwork not applied`)
  }

  const sameBindings = (left: ThemeFillBindings, right: ThemeFillBindings) =>
    JSON.stringify(
      Object.entries(left).sort(([a], [b]) => Number(a) - Number(b)),
    ) ===
    JSON.stringify(
      Object.entries(right).sort(([a], [b]) => Number(a) - Number(b)),
    )

  for (const [item, asset] of projectItems) {
    const svgPath = themePackage.svgPathByItem.get(item)
    if (!svgPath) continue
    const { bindings } = readThemedFills(
      readItemSvg(themePackage, svgPath),
      themePackage.replacements,
      '#808080',
    )
    if (!sameBindings(bindings, asset.themeFillBindings)) {
      notes.push(`${item}: theme fills re-bound in Studio — not applied`)
    }
  }

  return { notes, added: new Set(added), removed }
}

const main = async () => {
  const args = Bun.argv.slice(2)
  const write = args.includes('--write')
  const inputArgument = args.find((arg) => !arg.startsWith('--'))
  if (!inputArgument) {
    throw new Error(
      'Usage: bun scripts/merge-studio-project.ts <studio-project.json> [--write]',
    )
  }

  const repoRoot = resolve(import.meta.dir, '..')
  const parsed = parseStudioProject(
    JSON.parse(await Bun.file(resolve(inputArgument)).text()),
  )
  if (!parsed.ok) throw new Error(parsed.error)

  const { project } = parsed
  const themeName = project.meta.themeName
  const themeDirectory = resolveThemeDirectory(repoRoot, themeName)
  if (!existsSync(themeDirectory)) {
    throw new Error(
      `No theme package for "${themeName}" — use \`bun run generate:studio\` to create one.`,
    )
  }
  if (!project.assets.some((asset) => asset.category === 'head')) {
    throw new Error('The Studio project must contain at least one Head asset.')
  }

  const themePackage = await readThemePackage(repoRoot, themeName)
  const builderAssets: BuilderAsset[] = project.assets.map((asset) => ({
    ...asset,
    url: '',
  }))
  const { notes, added, removed } = describeAssetDrift(
    builderAssets,
    themePackage,
  )

  // Dropping an item here would leave `vanilla.ts` binding a component to an
  // identifier the theme no longer declares, and `withComponents` throws on
  // that — so the artwork has to go first, deliberately.
  if (removed.length > 0) {
    throw new Error(
      `These items are missing from the project but still bound in ${themePackage.assetsPackage}:\n` +
        removed.map((item) => `  ${item}`).join('\n') +
        '\nRemove their SVGs and framework entries first, or re-export without deleting them.',
    )
  }

  // An added asset has no SVG in the package yet, so declaring it would point
  // the theme at artwork that does not exist.
  const applicable = builderAssets.filter(
    (asset) => !added.has(`${asset.category}.${toCamelCase(asset.name)}`),
  )
  const themeData = toThemeData(applicable, project.meta, themeName)

  const generated: Record<(typeof MERGED_FILES)[number], string> = {
    'shared.ts': generateThemeFile(themeData),
    'colors.ts': generateThemeColors(themeData),
  }
  const changes = MERGED_FILES.map((file) =>
    compare(resolve(themeDirectory, 'src', file), `${generated[file]}\n`),
  )

  for (const change of changes) {
    const path = relative(repoRoot, change.path)
    console.log(`  ${change.changed ? 'update' : 'same  '}  ${path}`)
  }
  for (const note of notes) console.log(`  skip    ${note}`)

  const updates = changes.filter(({ changed }) => changed)
  if (!write) {
    console.log(
      `\nDry run — ${updates.length} file(s) would change. Re-run with --write to apply.`,
    )
    return
  }

  for (const change of updates) await Bun.write(change.path, change.contents)
  console.log(`\nMerged ${updates.length} file(s) into ${themeName}-theme.`)
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
