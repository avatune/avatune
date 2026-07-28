import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import type JSZip from 'jszip'
import { toThemeData } from '../apps/studio/src/components/studio/theme-export'
import type { BuilderAsset } from '../apps/studio/src/hooks/use-builder'
import { parseStudioProject } from '../apps/studio/src/utils/studioProject'
import {
  createThemeArchive,
  generateThemeFile,
} from '../apps/studio/src/utils/themeGenerator'

const writeArchive = async (
  outputRoot: string,
  themeName: string,
  archive: JSZip,
) => {
  const packageDirectories: Record<string, string> = {
    [`${themeName}-assets`]: resolve(
      outputRoot,
      'packages',
      'assets',
      `${themeName}-assets`,
    ),
    [`${themeName}-theme`]: resolve(
      outputRoot,
      'packages',
      'themes',
      `${themeName}-theme`,
    ),
  }

  for (const directory of Object.values(packageDirectories)) {
    if (existsSync(directory)) {
      throw new Error(`Refusing to overwrite existing package: ${directory}`)
    }
  }

  for (const entry of Object.values(archive.files)) {
    if (entry.dir) continue
    const [packageName, ...segments] = entry.name.split('/')
    const packageDirectory = packageDirectories[packageName]
    if (!packageDirectory || segments.length === 0) {
      throw new Error(`Unexpected generated path: ${entry.name}`)
    }
    const destination = resolve(packageDirectory, ...segments)
    if (!destination.startsWith(`${packageDirectory}${sep}`)) {
      throw new Error(`Unsafe generated path: ${entry.name}`)
    }
    await mkdir(dirname(destination), { recursive: true })
    await Bun.write(destination, await entry.async('uint8array'))
  }

  return packageDirectories
}

/**
 * Realigns the generated package.json versions with the rest of the workspace
 * so `syncpack lint` stays green after generating.
 */
const alignDependencyVersions = (outputRoot: string) => {
  const { exitCode } = Bun.spawnSync(['bun', 'run', 'fix:versions'], {
    cwd: outputRoot,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  if (exitCode === 0) {
    console.log('Aligned dependency versions with syncpack')
    return
  }
  console.warn(
    'syncpack fix failed — run `bun run fix:versions` before committing',
  )
}

const main = async () => {
  const [inputArgument, outputArgument] = Bun.argv.slice(2)
  if (!inputArgument) {
    throw new Error(
      'Usage: bun generate:studio <studio-project.json> [monorepo-root]',
    )
  }

  const inputPath = resolve(inputArgument)
  const outputRoot = outputArgument
    ? resolve(outputArgument)
    : resolve(import.meta.dir, '..')
  const parsed = parseStudioProject(
    JSON.parse(await Bun.file(inputPath).text()),
  )
  if (!parsed.ok) throw new Error(parsed.error)

  const { project } = parsed
  if (!project.assets.some((asset) => asset.category === 'head')) {
    throw new Error('The Studio project must contain at least one Head asset.')
  }
  const builderAssets: BuilderAsset[] = project.assets.map((asset) => ({
    ...asset,
    url: '',
  }))
  const themeData = toThemeData(
    builderAssets,
    project.meta,
    project.meta.themeName,
  )
  const themeCode = generateThemeFile(themeData)
  const archive = createThemeArchive(
    project.meta.themeName,
    themeCode,
    themeData,
  )
  const directories = await writeArchive(
    outputRoot,
    project.meta.themeName,
    archive,
  )

  for (const directory of Object.values(directories)) {
    console.log(`Generated ${relative(outputRoot, directory)}`)
  }

  alignDependencyVersions(outputRoot)
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
