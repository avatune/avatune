#!/usr/bin/env bun
/**
 * Generates MDX documentation files for theme packages in the website
 *
 * This script creates comprehensive MDX documentation for each theme package,
 * including asset previews, usage examples, and license information.
 *
 * Usage: bun scripts/generate-themes-mdx.ts [--theme <theme-name>]
 * Example: bun scripts/generate-themes-mdx.ts --theme micah
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  discoverThemes,
  findSvgFiles,
  generateAssetImports,
  generateAssetsMDXTable,
  generateCustomizationSection,
  generateDevelopmentSection,
  generateFrameworkExample,
  generateInstallationSectionMDX,
  generateRelatedPackagesSection,
  readFileIfExists,
  type ThemeInfo,
} from './shared'

/**
 * Generates the MDX frontmatter for a theme documentation page
 */
function generateFrontmatter(theme: ThemeInfo): string {
  return `---
title: "@avatune/${theme.packageName}"
description: "Avatar theme for Avatune using ${theme.displayName} assets."
source: "packages/themes/${theme.packageName}/README.md"
---`
}

/**
 * Generates the complete MDX content for a theme
 */
function generateThemeMDX(theme: ThemeInfo): string {
  const {
    packageName,
    assetsPackageName,
    displayName,
    hasCredits,
    creditsContent,
    exampleItems,
  } = theme

  // Use actual items from theme or fallback to generic examples
  const hairExample = exampleItems?.hair || 'braids'
  const bodyExample = exampleItems?.body || 'sweaterVest'

  const sections: string[] = []

  // Frontmatter
  sections.push(generateFrontmatter(theme))
  sections.push('')

  // Import statements
  sections.push(
    "import AssetPreview from '../../../../components/docs/asset-preview.astro';",
  )
  sections.push(
    "import InstallTabs from '../../../../components/docs/install-tabs.astro';",
  )

  // Get assets for import generation
  const packagesDir = join(process.cwd(), 'packages')
  const svgDir = join(packagesDir, 'assets', assetsPackageName, 'src', 'svg')

  if (existsSync(svgDir)) {
    const assets = findSvgFiles(svgDir)
    sections.push(generateAssetImports(assets, assetsPackageName))
  }
  sections.push('')

  // Source reference
  sections.push(`> Source: \`packages/assets/${packageName}/README.md\``)
  sections.push('')

  // Introduction
  sections.push(
    `Avatar theme for Avatune using ${displayName.toLowerCase()} design assets.`,
  )
  sections.push('')

  // Installation
  sections.push(generateInstallationSectionMDX(packageName))
  sections.push('')

  // Usage
  sections.push('## Usage')
  sections.push('')
  sections.push(
    'This theme is available for multiple frameworks: React, Vue, Svelte, and Vanilla JavaScript.',
  )
  sections.push('')

  sections.push('### React')
  sections.push('')
  sections.push(generateFrameworkExample('react', packageName))
  sections.push('')

  sections.push('### Vue')
  sections.push('')
  sections.push(generateFrameworkExample('vue', packageName))
  sections.push('')

  sections.push('### Svelte')
  sections.push('')
  sections.push(generateFrameworkExample('svelte', packageName))
  sections.push('')

  sections.push('### Vanilla JavaScript')
  sections.push('')
  sections.push(generateFrameworkExample('vanilla', packageName))
  sections.push('')

  // Customization
  sections.push(generateCustomizationSection(hairExample, bodyExample))
  sections.push('')

  // Design Assets
  sections.push('## Design Assets')
  sections.push('')
  sections.push(
    `This theme uses ${displayName} style SVG assets for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.`,
  )
  sections.push('')
  sections.push(
    `The assets are available in the [\`@avatune/${assetsPackageName}\`](https://www.npmjs.com/package/@avatune/${assetsPackageName}) package.`,
  )
  sections.push('')

  // Using Assets Directly
  sections.push('### Using Assets Directly')
  sections.push('')

  sections.push('#### SVG Paths')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { hair, eyes, mouth } from '@avatune/${assetsPackageName}';`,
  )
  sections.push('```')
  sections.push('')

  sections.push('#### React Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/react';`,
  )
  sections.push('```')
  sections.push('')

  sections.push('#### Svelte Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/svelte';`,
  )
  sections.push('```')
  sections.push('')

  sections.push('#### Vue Components')
  sections.push('')
  sections.push('```typescript')
  sections.push(
    `import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/vue';`,
  )
  sections.push('```')
  sections.push('')

  // Available Assets
  if (existsSync(svgDir)) {
    const assets = findSvgFiles(svgDir)
    sections.push('### Available Assets')
    sections.push('')
    sections.push(generateAssetsMDXTable(assets))
  }

  // License & Credits
  sections.push('## License & Credits')
  sections.push('')

  sections.push('### Theme License')
  sections.push('')
  sections.push(
    'This theme package is licensed under MIT (see [LICENSE.md](license)).',
  )
  sections.push('')

  if (hasCredits && creditsContent) {
    sections.push('### Design Assets License')
    sections.push('')
    sections.push(creditsContent)
    sections.push('')
    sections.push(`For full details, see [CREDITS.md](credits).`)
    sections.push('')
  } else {
    sections.push('### Design Assets License')
    sections.push('')
    sections.push(
      'The design assets used in this theme are separately licensed. See the asset package for details.',
    )
    sections.push('')
  }

  // Related Packages
  sections.push(generateRelatedPackagesSection(assetsPackageName))
  sections.push('')

  // Development
  sections.push(generateDevelopmentSection())

  return sections.join('\n')
}

/**
 * Generates CREDITS.mdx file if CREDITS.md exists in the assets package
 */
function generateCreditsMDX(theme: ThemeInfo): string | null {
  const packagesDir = join(process.cwd(), 'packages')
  const creditsPath = join(
    packagesDir,
    'assets',
    theme.assetsPackageName,
    'CREDITS.md',
  )

  if (!existsSync(creditsPath)) {
    return null
  }

  const creditsContent = readFileIfExists(creditsPath)
  if (!creditsContent) {
    return null
  }

  const sections: string[] = []

  // Frontmatter
  sections.push('---')
  sections.push('title: "CREDITS.md"')

  // Extract first line as description if available
  const firstLine = creditsContent.split('\n')[0]
  if (firstLine) {
    sections.push(
      `description: "${firstLine.replace(/^#+\s*/, '').replace(/"/g, '\\"')}"`,
    )
  }

  sections.push(
    `source: "packages/themes/${theme.assetsPackageName}/CREDITS.md"`,
  )
  sections.push('---')
  sections.push('')

  // Source reference
  sections.push(
    `> Source: \`packages/assets/${theme.assetsPackageName}/CREDITS.md\``,
  )
  sections.push('')

  // Content
  sections.push(creditsContent)
  sections.push('')

  return sections.join('\n')
}

/**
 * Generates LICENSE.mdx file if LICENSE.md exists in the theme or assets package
 */
function generateLicenseMDX(theme: ThemeInfo): string | null {
  const packagesDir = join(process.cwd(), 'packages')

  // Try theme package first, then assets package
  const themeLicensePath = join(
    packagesDir,
    'themes',
    theme.packageName,
    'LICENSE.md',
  )
  const assetsLicensePath = join(
    packagesDir,
    'assets',
    theme.assetsPackageName,
    'LICENSE.md',
  )

  let licenseContent: string | undefined
  let sourcePath: string

  if (existsSync(themeLicensePath)) {
    licenseContent = readFileIfExists(themeLicensePath)
    sourcePath = `packages/themes/${theme.packageName}/LICENSE.md`
  } else if (existsSync(assetsLicensePath)) {
    licenseContent = readFileIfExists(assetsLicensePath)
    sourcePath = `packages/assets/${theme.assetsPackageName}/LICENSE.md`
  } else {
    return null
  }

  if (!licenseContent) {
    return null
  }

  const sections: string[] = []

  // Frontmatter
  sections.push('---')
  sections.push('title: "LICENSE.md"')

  // Extract license type from content
  if (licenseContent.includes('MIT License')) {
    sections.push('description: "MIT License"')
  } else if (licenseContent.includes('CC BY 4.0')) {
    sections.push('description: "CC BY 4.0 License"')
  } else {
    sections.push('description: "License Information"')
  }

  sections.push(`source: "${sourcePath}"`)
  sections.push('---')
  sections.push('')

  // Source reference
  sections.push(`> Source: \`${sourcePath}\``)
  sections.push('')

  // Content
  sections.push(licenseContent)
  sections.push('')

  return sections.join('\n')
}

/**
 * Main execution
 */
function main() {
  const { values } = parseArgs({
    options: {
      theme: {
        type: 'string',
        short: 't',
      },
    },
  })

  const allThemes = discoverThemes()
  const themes = values.theme
    ? allThemes.filter((t) => t.name === values.theme)
    : allThemes

  if (themes.length === 0) {
    console.error(
      `No themes found${values.theme ? ` matching "${values.theme}"` : ''}`,
    )
    process.exit(1)
  }

  const websiteDocsDir = join(
    process.cwd(),
    'apps',
    'website',
    'src',
    'content',
    'docs',
    'packages',
  )

  console.log(`Generating MDX documentation for ${themes.length} theme(s)...`)

  for (const theme of themes) {
    const themeDocsDir = join(websiteDocsDir, theme.packageName)

    // Create directory if it doesn't exist
    if (!existsSync(themeDocsDir)) {
      mkdirSync(themeDocsDir, { recursive: true })
    }

    // Generate main index.mdx
    const indexContent = generateThemeMDX(theme)
    const indexPath = join(themeDocsDir, 'index.mdx')
    writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`✓ Generated ${theme.displayName} index.mdx`)

    // Generate CREDITS.mdx if available
    const creditsContent = generateCreditsMDX(theme)
    if (creditsContent) {
      const creditsPath = join(themeDocsDir, 'CREDITS.mdx')
      writeFileSync(creditsPath, creditsContent, 'utf-8')
      console.log(`  ✓ Generated ${theme.displayName} CREDITS.mdx`)
    }

    // Generate LICENSE.mdx if available
    const licenseContent = generateLicenseMDX(theme)
    if (licenseContent) {
      const licensePath = join(themeDocsDir, 'LICENSE.mdx')
      writeFileSync(licensePath, licenseContent, 'utf-8')
      console.log(`  ✓ Generated ${theme.displayName} LICENSE.mdx`)
    }
  }

  console.log('\n✨ MDX documentation generated successfully!')
}

main()
