#!/usr/bin/env bun

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { $ } from 'bun'

const PACKAGES_ROOT = 'packages'

async function findPackageDirs(baseDir: string): Promise<string[]> {
  const packageDirs: string[] = []

  async function scanDir(dir: string, depth: number) {
    if (depth > 2) return

    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'node_modules') continue

      const fullPath = join(dir, entry.name)
      const packageJsonPath = join(fullPath, 'package.json')

      try {
        await stat(packageJsonPath)
        packageDirs.push(fullPath)
      } catch {
        await scanDir(fullPath, depth + 1)
      }
    }
  }

  await scanDir(baseDir, 0)
  return packageDirs.sort()
}

async function publishPackage(dir: string): Promise<boolean> {
  const packageJson = await Bun.file(join(dir, 'package.json')).json()
  const name = packageJson.name || dir

  if (packageJson.private) {
    console.log(`⏭️  Skipping ${name} (private)`)
    return true
  }

  console.log(`📦 Publishing ${name}...`)

  try {
    await $`cd ${dir} && bun publish --dry-run --access public`.quiet()
    console.log(`✅ Published ${name}`)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('already exists')) {
      console.log(`⏭️  ${name} already published`)
      return true
    }
    console.error(`❌ Failed to publish ${name}: ${message}`)
    return false
  }
}

async function main() {
  console.log('🔍 Finding packages...\n')

  const packageDirs = await findPackageDirs(PACKAGES_ROOT)
  console.log(`Found ${packageDirs.length} packages\n`)

  let failed = 0

  for (const dir of packageDirs) {
    const success = await publishPackage(dir)
    if (!success) failed++
  }

  console.log('\n🏷️  Creating git tags...')
  try {
    await $`bunx changeset tag`.quiet()
    console.log('✅ Tags created')
  } catch (error) {
    console.error('❌ Failed to create tags:', error)
  }

  if (failed > 0) {
    console.log(`\n⚠️  ${failed} package(s) failed to publish`)
    process.exit(1)
  }

  console.log('\n🎉 All packages published successfully!')
}

main()
