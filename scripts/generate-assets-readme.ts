#!/usr/bin/env bun
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'

/**
 * Script to generate README.md for asset packages.
 *
 * Usage: bun scripts/generate-readme.ts <package-name>
 * Example: bun scripts/generate-readme.ts kyute-assets
 */

interface AssetFile {
  category: string
  name: string
  filename: string
  path: string
}

interface CategoryAssets {
  [category: string]: AssetFile[]
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function findSvgFiles(svgDir: string): CategoryAssets {
  const assets: CategoryAssets = {}

  if (!existsSync(svgDir)) {
    console.error(`SVG directory not found: ${svgDir}`)
    process.exit(1)
  }

  const categories = readdirSync(svgDir).filter(item => {
    const itemPath = join(svgDir, item)
    return statSync(itemPath).isDirectory()
  })

  for (const category of categories) {
    const categoryPath = join(svgDir, category)
    const files = readdirSync(categoryPath).filter(file => file.endsWith('.svg'))

    assets[category] = files
      .map(file => ({
        category,
        name: basename(file, '.svg'),
        filename: file,
        path: join(categoryPath, file),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return assets
}

function generateAssetsTable(assets: CategoryAssets): string {
  const lines: string[] = []
  const sortedCategories = Object.keys(assets).sort()

  for (const category of sortedCategories) {
    const categoryFiles = assets[category]

    lines.push(`### ${capitalizeFirst(category)}`)
    lines.push('')
    lines.push('| Preview | Filename |')
    lines.push('|---------|----------|')

    for (const asset of categoryFiles) {
      const svgPath = `./src/svg/${category}/${asset.filename}`
      lines.push(`| ![${asset.name}](${svgPath}) | \`${asset.name}\` |`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

function findLicenseOrCredits(packageDir: string): { license?: string; credits?: string } {
  const result: { license?: string; credits?: string } = {}

  const licensePath = join(packageDir, 'LICENSE.md')
  const creditsPath = join(packageDir, 'CREDITS.md')

  if (existsSync(licensePath)) {
    result.license = 'LICENSE.md'
  }

  if (existsSync(creditsPath)) {
    result.credits = 'CREDITS.md'
  }

  return result
}

function generateReadme(
  packageName: string,
  assets: CategoryAssets,
  packageDir: string,
): string {
  const { license, credits } = findLicenseOrCredits(packageDir)
  const assetsTable = generateAssetsTable(assets)

  // Extract style from package name (e.g., "nevmstas" from "nevmstas-assets")
  const styleName = packageName.replace('-assets', '').split('-').map(capitalizeFirst).join(' ')

  const sections: string[] = []

  // Header
  sections.push(`# @avatune/${packageName}`)
  sections.push('')
  sections.push(`${styleName} style SVG assets for avatar generation.`)
  sections.push('')

  // Description
  sections.push('## Description')
  sections.push('')
  sections.push(`This package provides SVG assets in ${styleName.toLowerCase()} style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.`)
  sections.push('')

  // Installation
  sections.push('## Installation')
  sections.push('')
  sections.push('```bash')
  sections.push(`npm install @avatune/${packageName}`)
  sections.push('```')
  sections.push('')

  // Usage
  sections.push('## Usage')
  sections.push('')

  sections.push('### SVG Paths')
  sections.push('')
  sections.push('```typescript')
  sections.push(`import { hair, eyes, mouth } from '@avatune/${packageName}';`)
  sections.push('```')
  sections.push('')

  sections.push('### React Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(`import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/react';`)
  sections.push('```')
  sections.push('')

  sections.push('### Svelte Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(`import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/svelte';`)
  sections.push('```')
  sections.push('')

  sections.push('### Vue Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(`import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/vue';`)
  sections.push('```')
  sections.push('')

  // Available Assets
  sections.push('## Available Assets')
  sections.push('')
  sections.push(assetsTable)

  // License/Credits section
  if (license || credits) {
    sections.push('## License & Credits')
    sections.push('')
    if (license) {
      sections.push(`See [${license}](${license}) for license information.`)
      sections.push('')
    }
    if (credits) {
      sections.push(`See [${credits}](${credits}) for attribution and credits.`)
      sections.push('')
    }
  }

  // Development
  sections.push('## Development')
  sections.push('')
  sections.push('Build the library:')
  sections.push('')
  sections.push('```bash')
  sections.push('bun run build')
  sections.push('```')
  sections.push('')
  sections.push('Build in watch mode:')
  sections.push('')
  sections.push('```bash')
  sections.push('bun dev')
  sections.push('```')
  sections.push('')

  return sections.join('\n')
}

function main() {
  const packageName = process.argv[2]

  if (!packageName) {
    console.error('Usage: bun scripts/generate-readme.ts <package-name>')
    console.error('Example: bun scripts/generate-readme.ts kyute-assets')
    process.exit(1)
  }

  const packageDir = join(process.cwd(), 'packages', packageName)

  if (!existsSync(packageDir)) {
    console.error(`Package not found: ${packageDir}`)
    process.exit(1)
  }

  const svgDir = join(packageDir, 'src', 'svg')

  console.log(`Generating README for ${packageName}...`)
  console.log(`Package directory: ${packageDir}`)
  console.log(`SVG directory: ${svgDir}`)

  const assets = findSvgFiles(svgDir)
  const categoryCount = Object.keys(assets).length
  const totalAssets = Object.values(assets).reduce((sum, files) => sum + files.length, 0)

  if (totalAssets === 0) {
    console.error('No SVG files found!')
    process.exit(1)
  }

  console.log(`Found ${totalAssets} SVG files across ${categoryCount} categories`)

  const readme = generateReadme(packageName, assets, packageDir)
  const outputPath = join(packageDir, 'README.md')

  writeFileSync(outputPath, readme, 'utf-8')
  console.log(`✓ Generated README.md`)

  // Check for license/credits
  const { license, credits } = findLicenseOrCredits(packageDir)
  if (license) {
    console.log(`  Found ${license} - linked in README`)
  }
  if (credits) {
    console.log(`  Found ${credits} - linked in README`)
  }

  console.log('\n✨ README generated successfully!')
}

main()
