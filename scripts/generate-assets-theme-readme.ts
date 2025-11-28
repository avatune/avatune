#!/usr/bin/env bun
/**
 * Generates README files for theme packages with credits, license, and usage examples
 */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  discoverThemes,
  generateCustomizationSection,
  generateDevelopmentSection,
  generateFrameworkExample,
  generateRelatedPackagesSection,
  type ThemeInfo,
} from './shared'

function generateREADME(theme: ThemeInfo): string {
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

  // Header
  sections.push(`# @avatune/${packageName}`)
  sections.push('')
  sections.push(
    `Avatar theme for Avatune using ${displayName.toLowerCase()} design assets.`,
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
  const assetsPackageUrl = `https://github.com/avatune/avatune/tree/main/packages/assets/${assetsPackageName}`
  sections.push('## Design Assets')
  sections.push('')
  sections.push(
    `This theme uses assets from the [\`@avatune/${assetsPackageName}\`](${assetsPackageUrl}) package.`,
  )
  sections.push('')

  // License
  const licenseUrl = 'https://github.com/avatune/avatune/blob/main/LICENSE.md'
  const creditsUrl = `https://github.com/avatune/avatune/blob/main/packages/assets/${assetsPackageName}/CREDITS.md`
  sections.push('## License')
  sections.push('')
  sections.push(
    `This theme package is licensed under MIT (see [LICENSE.md](${licenseUrl})).`,
  )
  sections.push('')
  if (hasCredits && creditsContent) {
    sections.push(
      'The design assets used in this theme have their own license and attribution:',
    )
    sections.push('')
    sections.push(creditsContent)
    sections.push('')
    sections.push('For full details, see:')
    sections.push(`- [CREDITS.md](${creditsUrl}) - Asset attribution`)
    sections.push(
      `- Asset package license in [\`@avatune/${assetsPackageName}\`](${assetsPackageUrl})`,
    )
    sections.push('')
  } else {
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

// Main execution
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

  console.log(`Generating README for ${themes.length} theme(s)...`)

  for (const theme of themes) {
    const content = generateREADME(theme)
    const outputPath = join(
      process.cwd(),
      'packages',
      'themes',
      theme.packageName,
      'README.md',
    )

    writeFileSync(outputPath, content, 'utf-8')
    console.log(`✓ Generated README for ${theme.displayName} at ${outputPath}`)
  }
}

main()
