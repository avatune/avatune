#!/usr/bin/env bun
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type CategoryAssets,
  capitalizeFirst,
  findLicenseOrCredits,
  findSvgFiles,
  generateAssetDevelopmentSection,
  generateAssetsTable,
} from './shared'

/**
 * Script to generate README.md for asset packages.
 *
 * Usage: bun scripts/generate-assets-readme.ts <package-name>
 * Example: bun scripts/generate-assets-readme.ts kyute-assets
 */

function generateReadme(
  packageName: string,
  assets: CategoryAssets,
  packageDir: string,
): string {
  const { license, credits } = findLicenseOrCredits(packageDir)
  const assetsTable = generateAssetsTable(assets, packageName)

  // Extract style from package name (e.g., "nevmstas" from "nevmstas-assets")
  const styleName = packageName
    .replace('-assets', '')
    .split('-')
    .map(capitalizeFirst)
    .join(' ')

  const sections: string[] = []

  // Header
  sections.push(`# @avatune/${packageName}`)
  sections.push('')
  sections.push(`${styleName} style SVG assets for avatar generation.`)
  sections.push('')

  // Description
  sections.push('## Description')
  sections.push('')
  sections.push(
    `This package provides SVG assets in ${styleName.toLowerCase()} style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.`,
  )
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
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/react';`,
  )
  sections.push('```')
  sections.push('')

  sections.push('### Svelte Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/svelte';`,
  )
  sections.push('```')
  sections.push('')

  sections.push('### Vue Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${packageName}/vue';`,
  )
  sections.push('```')
  sections.push('')

  // Available Assets
  sections.push('## Available Assets')
  sections.push('')
  sections.push(assetsTable)

  // License/Credits section
  if (license || credits) {
    const baseUrl = `https://github.com/avatune /avatune/blob/main/packages/assets/${packageName}`
    sections.push('## License & Credits')
    sections.push('')
    if (license) {
      sections.push(
        `See [${license}](${baseUrl}/${license}) for license information.`,
      )
      sections.push('')
    }
    if (credits) {
      sections.push(
        `See [${credits}](${baseUrl}/${credits}) for attribution and credits.`,
      )
      sections.push('')
    }
  }

  // Development
  sections.push(generateAssetDevelopmentSection())
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

  const packageDir = join(process.cwd(), 'packages', 'assets', packageName)

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
  const totalAssets = Object.values(assets).reduce(
    (sum, files) => sum + files.length,
    0,
  )

  if (totalAssets === 0) {
    console.error('No SVG files found!')
    process.exit(1)
  }

  console.log(
    `Found ${totalAssets} SVG files across ${categoryCount} categories`,
  )

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
