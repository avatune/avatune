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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
  MIT_LICENSE,
  RESTRICTED_LICENSE,
  readFileIfExists,
  type ThemeInfo,
} from './shared'

type LicenseChoice = 'mit' | 'restricted'

const LICENSE_TEXT: Record<LicenseChoice, string> = {
  mit: MIT_LICENSE,
  restricted: RESTRICTED_LICENSE,
}

const LICENSE_LABEL: Record<LicenseChoice, string> = {
  mit: 'MIT',
  restricted: 'MIT No-Redistribution',
}

/**
 * Asks which license to apply to a theme that ships none. Falls back to MIT
 * when stdin is not a TTY (CI / piped input) so automation never blocks.
 */
function promptLicenseChoice(theme: ThemeInfo): LicenseChoice {
  if (!process.stdin.isTTY) {
    console.log(
      `  ℹ No license for ${theme.displayName}; defaulting to MIT (non-interactive).`,
    )
    return 'mit'
  }

  console.log(`\nNo license found for @avatune/${theme.packageName}.`)
  console.log('  [1] MIT — permissive, usable anywhere')
  console.log(
    '  [2] MIT No-Redistribution — like MIT, but forbids bundling the avatar assets into other avatar libraries (e.g. DiceBear)',
  )
  const answer = (prompt('  Choose a license [1/2]:', '1') ?? '1').trim()
  return answer === '2' ? 'restricted' : 'mit'
}

/**
 * Keeps package metadata aligned with the license shipped in the package.
 */
function setPackageLicense(
  group: 'themes' | 'assets',
  packageName: string,
  license: string,
): void {
  const packageJsonPath = join(
    process.cwd(),
    'packages',
    group,
    packageName,
    'package.json',
  )
  if (!existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  if (packageJson.license === license) return

  packageJson.license = license
  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf-8',
  )
}

/**
 * Ensures a theme has a LICENSE.md source so a license.mdx can be generated.
 * Restricted artwork licenses are also applied to the separately published
 * assets package.
 */
function ensureThemeLicense(theme: ThemeInfo): void {
  const themeLicensePath = join(
    process.cwd(),
    'packages',
    'themes',
    theme.packageName,
    'LICENSE.md',
  )
  const assetsLicensePath = join(
    process.cwd(),
    'packages',
    'assets',
    theme.assetsPackageName,
    'LICENSE.md',
  )
  const existingLicensePath = existsSync(themeLicensePath)
    ? themeLicensePath
    : existsSync(assetsLicensePath)
      ? assetsLicensePath
      : undefined

  if (existingLicensePath) {
    const licenseContent = readFileSync(existingLicensePath, 'utf-8')
    if (licenseContent.includes('No-Redistribution')) {
      if (!existsSync(themeLicensePath)) {
        writeFileSync(themeLicensePath, licenseContent, 'utf-8')
      }
      if (!existsSync(assetsLicensePath)) {
        writeFileSync(assetsLicensePath, licenseContent, 'utf-8')
      }
      setPackageLicense(
        'themes',
        theme.packageName,
        'SEE LICENSE IN LICENSE.md',
      )
      setPackageLicense(
        'assets',
        theme.assetsPackageName,
        'SEE LICENSE IN LICENSE.md',
      )
    }
    return
  }

  const choice = promptLicenseChoice(theme)
  const licenseContent = LICENSE_TEXT[choice]
  writeFileSync(themeLicensePath, licenseContent, 'utf-8')
  setPackageLicense(
    'themes',
    theme.packageName,
    choice === 'restricted' ? 'SEE LICENSE IN LICENSE.md' : 'MIT',
  )

  if (choice === 'restricted') {
    writeFileSync(assetsLicensePath, licenseContent, 'utf-8')
    setPackageLicense(
      'assets',
      theme.assetsPackageName,
      'SEE LICENSE IN LICENSE.md',
    )
  }
  console.log(
    `  ✓ Created ${theme.displayName} LICENSE.md (${LICENSE_LABEL[choice]})`,
  )
}

/**
 * Reads a theme's effective LICENSE.md content (theme package first, then its
 * assets package) for wording decisions in the generated docs.
 */
function readThemeLicenseContent(theme: ThemeInfo): string | undefined {
  const themeLicensePath = join(
    process.cwd(),
    'packages',
    'themes',
    theme.packageName,
    'LICENSE.md',
  )
  const assetsLicensePath = join(
    process.cwd(),
    'packages',
    'assets',
    theme.assetsPackageName,
    'LICENSE.md',
  )

  if (existsSync(themeLicensePath)) return readFileIfExists(themeLicensePath)
  if (existsSync(assetsLicensePath)) return readFileIfExists(assetsLicensePath)
  return undefined
}

/**
 * Maps theme package name to theme ID used in AvatarUsagePreview component
 */
function getThemeId(packageName: string): string {
  // Remove '-theme' suffix and convert to theme ID format
  const baseName = packageName.replace(/-theme$/, '')

  return baseName
}

/**
 * Generates the Examples section with avatar previews
 */
function generateExamplesSection(themeId: string): string {
  return `
<div className="my-8 flex flex-wrap justify-center gap-4">
  <AvatarUsagePreview themeId="${themeId}" seed="example-12345" size={200} />
  <AvatarUsagePreview themeId="${themeId}" seed="example-678910" size={200} />
  <AvatarUsagePreview themeId="${themeId}" seed="example-101112131415" size={200} />
</div>`
}

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

  // Get assets for import generation
  const packagesDir = join(process.cwd(), 'packages')
  const svgDir = join(packagesDir, 'assets', assetsPackageName, 'src', 'svg')

  if (existsSync(svgDir)) {
    const assets = findSvgFiles(svgDir)
    sections.push(generateAssetImports(assets, assetsPackageName))
  }
  sections.push('')

  // Source reference
  sections.push(`> Source: \`packages/assets/${assetsPackageName}/README.md\``)
  sections.push('')

  // Introduction
  sections.push(
    `Avatar theme for Avatune using ${displayName.toLowerCase()} design assets.`,
  )
  sections.push('')

  // Examples
  const themeId = getThemeId(packageName)
  sections.push(generateExamplesSection(themeId))
  sections.push('')

  // Installation
  sections.push(generateInstallationSectionMDX(packageName))
  sections.push('')

  // Usage
  sections.push('## Usage')
  sections.push('')
  sections.push(
    'This theme is available for multiple frameworks: React, Vue, Svelte, Angular, and Vanilla JavaScript.',
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

  sections.push('### Angular')
  sections.push('')
  sections.push(generateFrameworkExample('angular', packageName))
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
  const themeLicenseContent = readThemeLicenseContent(theme)
  sections.push(
    themeLicenseContent?.includes('No-Redistribution')
      ? 'This theme package is licensed under a modified MIT license that permits any use except repackaging its avatar assets into other avatar libraries such as DiceBear (see [LICENSE.md](license)).'
      : 'This theme package is licensed under MIT (see [LICENSE.md](license)).',
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
 * Generates credits.mdx if CREDITS.md exists in the assets package
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
 * Generates license.mdx if LICENSE.md exists in the theme or assets package
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
  if (licenseContent.includes('No-Redistribution')) {
    sections.push('description: "MIT License (No-Redistribution Variant)"')
  } else if (licenseContent.includes('MIT License')) {
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

    // Ensure a LICENSE.md source exists before generating its docs page
    ensureThemeLicense(theme)

    // Generate main index.mdx
    const indexContent = generateThemeMDX(theme)
    const indexPath = join(themeDocsDir, 'index.mdx')
    writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`✓ Generated ${theme.displayName} index.mdx`)

    // Generate credits.mdx if available
    const creditsContent = generateCreditsMDX(theme)
    if (creditsContent) {
      const creditsPath = join(themeDocsDir, 'credits.mdx')
      writeFileSync(creditsPath, creditsContent, 'utf-8')
      console.log(`  ✓ Generated ${theme.displayName} credits.mdx`)
    }

    // Generate license.mdx if available
    const licenseContent = generateLicenseMDX(theme)
    if (licenseContent) {
      const licensePath = join(themeDocsDir, 'license.mdx')
      writeFileSync(licensePath, licenseContent, 'utf-8')
      console.log(`  ✓ Generated ${theme.displayName} license.mdx`)
    }
  }

  console.log('\n✨ MDX documentation generated successfully!')
}

main()
