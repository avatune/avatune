/**
 * Shared utilities for documentation generation scripts
 *
 * This module provides common functionality used across all documentation
 * generation scripts including filesystem helpers, string transformations,
 * asset discovery, and markdown/MDX generation.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

// ============================================================================
// Types
// ============================================================================

export type Framework = 'react' | 'vue' | 'svelte' | 'vanilla'

export interface AssetFile {
  category: string
  name: string
  filename: string
  path: string
}

export interface CategoryAssets {
  [category: string]: AssetFile[]
}

export interface ThemeInfo {
  name: string
  packageName: string
  assetsPackageName: string
  displayName: string
  hasCredits: boolean
  hasLicense: boolean
  creditsContent?: string
  licenseContent?: string
  exampleItems?: {
    hair?: string
    body?: string
  }
}

export interface AssetPackageInfo {
  name: string
  packageName: string
  displayName: string
  hasCredits: boolean
  hasLicense: boolean
  svgDir: string
  assets: CategoryAssets
}

// ============================================================================
// String Transformation Helpers
// ============================================================================

/**
 * Converts a kebab-case or snake_case string to PascalCase
 * @example toPascalCase('my-component-name') => 'MyComponentName'
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Capitalizes the first letter of a string
 * @example capitalizeFirst('hello') => 'Hello'
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts a kebab-case string to camelCase
 * @example kebabToCamelCase('my-component-name') => 'myComponentName'
 */
export function kebabToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts a camelCase/PascalCase string to kebab-case
 * @example camelToKebab('myComponentName') => 'my-component-name'
 */
export function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

// ============================================================================
// Filesystem Helpers
// ============================================================================

/**
 * Finds all SVG files organized by category in a given directory
 * @param svgDir Path to the SVG directory containing category subdirectories
 * @returns Object mapping category names to arrays of asset files
 */
export function findSvgFiles(svgDir: string): CategoryAssets {
  const assets: CategoryAssets = {}

  if (!existsSync(svgDir)) {
    console.error(`SVG directory not found: ${svgDir}`)
    process.exit(1)
  }

  const categories = readdirSync(svgDir).filter((item) => {
    const itemPath = join(svgDir, item)
    return statSync(itemPath).isDirectory()
  })

  for (const category of categories) {
    const categoryPath = join(svgDir, category)
    const files = readdirSync(categoryPath).filter((file) =>
      file.endsWith('.svg'),
    )

    assets[category] = files
      .map((file) => ({
        category,
        name: basename(file, '.svg'),
        filename: file,
        path: join(categoryPath, file),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return assets
}

/**
 * Finds LICENSE.md and CREDITS.md files in a package directory
 * @param packageDir Path to the package directory
 * @returns Object with license and credits filenames if they exist
 */
export function findLicenseOrCredits(packageDir: string): {
  license?: string
  credits?: string
} {
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

/**
 * Reads the content of a file if it exists
 * @param filePath Path to the file
 * @returns File content as string, or undefined if file doesn't exist
 */
export function readFileIfExists(filePath: string): string | undefined {
  return existsSync(filePath)
    ? readFileSync(filePath, 'utf-8').trim()
    : undefined
}

// ============================================================================
// Package Discovery
// ============================================================================

/**
 * Discovers all theme packages in the packages directory
 * @param packagesDir Path to the packages directory
 * @returns Array of theme information objects
 */
export function discoverThemes(
  packagesDir: string = join(process.cwd(), 'packages'),
): ThemeInfo[] {
  const themePackages = readdirSync(join(packagesDir, 'themes')).filter((pkg) =>
    pkg.endsWith('-theme'),
  )

  return themePackages.map((pkg) => {
    const name = pkg.replace('-theme', '')
    const assetsName = `${name}-assets`
    const themeDir = join(packagesDir, 'themes', pkg)
    const assetsDir = join(packagesDir, 'assets', assetsName)

    const creditsPath = join(assetsDir, 'CREDITS.md')
    const licensePath = join(assetsDir, 'LICENSE.md')
    const themeLicensePath = join(themeDir, 'LICENSE.md')

    const hasCredits = existsSync(creditsPath)
    const hasLicense = existsSync(licensePath) || existsSync(themeLicensePath)
    const creditsContent = hasCredits
      ? readFileSync(creditsPath, 'utf-8').trim()
      : undefined

    // Try to extract example items from vanilla.ts source file
    let exampleItems: { hair?: string; body?: string } | undefined
    try {
      const vanillaSourcePath = join(themeDir, 'src', 'vanilla.ts')
      if (existsSync(vanillaSourcePath)) {
        exampleItems = parseThemeSource(vanillaSourcePath)
      }
    } catch (error) {
      console.warn(`Could not parse theme ${pkg} for examples:`, error)
    }

    return {
      name,
      packageName: pkg,
      assetsPackageName: assetsName,
      displayName: toPascalCase(name)
        .replace(/([A-Z])/g, ' $1')
        .trim(),
      hasCredits,
      hasLicense,
      creditsContent,
      exampleItems,
    }
  })
}

/**
 * Discovers all asset packages in the packages directory
 * @param packagesDir Path to the packages directory
 * @returns Array of asset package information objects
 */
export function discoverAssetPackages(
  packagesDir: string = join(process.cwd(), 'packages'),
): AssetPackageInfo[] {
  const packages = readdirSync(join(packagesDir, 'assets'))
  const assetPackages = packages.filter((pkg) => pkg.endsWith('-assets'))

  return assetPackages.map((pkg) => {
    const packageDir = join(packagesDir, pkg)
    const svgDir = join(packageDir, 'src', 'svg')
    const { license, credits } = findLicenseOrCredits(packageDir)
    const name = pkg.replace('-assets', '')

    return {
      name,
      packageName: pkg,
      displayName: name.split('-').map(capitalizeFirst).join(' '),
      hasCredits: !!credits,
      hasLicense: !!license,
      svgDir,
      assets: findSvgFiles(svgDir),
    }
  })
}

// ============================================================================
// Parse Helpers
// ============================================================================

/**
 * Parses a theme's vanilla.ts source file to extract example items
 * @param sourcePath Path to the vanilla.ts file
 * @returns Object with extracted hair and body example items
 */
export function parseThemeSource(sourcePath: string): {
  hair?: string
  body?: string
} {
  const sourceCode = readFileSync(sourcePath, 'utf-8')
  const exampleItems: { hair?: string; body?: string } = {}

  // Extract hair items from withComponents('hair', { ... }) blocks
  const hairMatch = sourceCode.match(/\.withComponents\('hair',\s*\{([^}]+)\}/s)
  if (hairMatch) {
    const hairBlock = hairMatch[1]
    const hairKeys = hairBlock.match(/(\w+):\s*\{/g)
    if (hairKeys && hairKeys.length > 0) {
      exampleItems.hair = hairKeys[0].replace(/:\s*\{/, '').trim()
    }
  }

  // Extract body items from withComponents('body', { ... }) blocks
  const bodyMatch = sourceCode.match(/\.withComponents\('body',\s*\{([^}]+)\}/s)
  if (bodyMatch) {
    const bodyBlock = bodyMatch[1]
    const bodyKeys = bodyBlock.match(/(\w+):\s*\{/g)
    if (bodyKeys && bodyKeys.length > 0) {
      exampleItems.body = bodyKeys[0].replace(/:\s*\{/, '').trim()
    }
  }

  return exampleItems
}

/**
 * Generates import statements for SVG assets (for MDX)
 * @param assets Category assets to generate imports for
 * @param assetsPackageName Name of the assets package
 * @returns String containing import statements
 */
export function generateAssetImports(
  assets: CategoryAssets,
  assetsPackageName: string,
): string {
  const imports: string[] = []

  for (const [category, files] of Object.entries(assets)) {
    for (const file of files) {
      const importName = `${category}${toPascalCase(file.name)}`
      imports.push(importName)
    }
  }

  return `import {
  ${imports.join(',\n  ')},
} from '@avatune/${assetsPackageName}/svg';`
}

// ============================================================================
// Markdown/MDX Generation Helpers
// ============================================================================

/**
 * Generates a fenced code block with language syntax highlighting
 * @param code Code content
 * @param language Programming language for syntax highlighting
 * @returns Formatted code block string
 */
export function generateCodeBlock(code: string, language: string = ''): string {
  return `\`\`\`${language}\n${code}\n\`\`\``
}

/**
 * Generates framework-specific usage example
 * @param framework The framework to generate example for
 * @param packageName The theme package name
 * @returns Formatted code example as string
 */
export function generateFrameworkExample(
  framework: Framework,
  packageName: string,
): string {
  switch (framework) {
    case 'react':
      return generateCodeBlock(
        `import { Avatar } from '@avatune/react'
import theme from '@avatune/${packageName}/react'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="optional-seed-for-random-generation"
    />
  )
}`,
        'tsx',
      )

    case 'vue':
      return generateCodeBlock(
        `<script setup lang="ts">
import { Avatar } from '@avatune/vue'
import theme from '@avatune/${packageName}/vue'
</script>

<template>
  <Avatar
    :theme="theme"
    :size="300"
    seed="optional-seed-for-random-generation"
  />
</template>`,
        'vue',
      )

    case 'svelte':
      return generateCodeBlock(
        `<script lang="ts">
  import { Avatar } from '@avatune/svelte'
  import theme from '@avatune/${packageName}/svelte'
</script>

<Avatar
  theme={theme}
  size={300}
  seed="optional-seed-for-random-generation"
/>`,
        'svelte',
      )

    case 'vanilla':
      return generateCodeBlock(
        `import { avatar } from '@avatune/vanilla'
import theme from '@avatune/${packageName}/vanilla'

const container = document.getElementById('avatar-container')
const svg = avatar({
  theme,
  size: 300,
  seed: 'optional-seed-for-random-generation',
})

container?.appendChild(svg)`,
        'typescript',
      )
  }
}

/**
 * Generates a markdown table of assets with image previews
 * @param assets Category assets to generate table for
 * @param packageName Name of the assets package (e.g., 'kyute-assets')
 * @returns Formatted markdown table string
 */
export function generateAssetsTable(
  assets: CategoryAssets,
  packageName: string,
): string {
  const lines: string[] = []
  const sortedCategories = Object.keys(assets).sort()
  const baseUrl = `https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/${packageName}/src/svg`

  for (const category of sortedCategories) {
    const categoryFiles = assets[category]

    lines.push(`### ${capitalizeFirst(category)}`)
    lines.push('')
    lines.push('| Preview | Filename |')
    lines.push('|---------|----------|')

    for (const asset of categoryFiles) {
      const svgUrl = `${baseUrl}/${category}/${asset.filename}`
      lines.push(`| ![${asset.name}](${svgUrl}) | \`${asset.name}\` |`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generates an MDX table of assets using AssetPreview component
 * @param assets Category assets to generate table for
 * @param assetsPackageName Name of the assets package
 * @returns Formatted MDX table string with AssetPreview components
 */
export function generateAssetsMDXTable(assets: CategoryAssets): string {
  const lines: string[] = []
  const sortedCategories = Object.keys(assets).sort()

  for (const category of sortedCategories) {
    const categoryFiles = assets[category]

    lines.push(`#### ${capitalizeFirst(category)}`)
    lines.push('')
    lines.push('| Preview | Filename |')
    lines.push('|---------|----------|')

    for (const asset of categoryFiles) {
      const importName = `${category}${toPascalCase(asset.name)}`
      lines.push(
        `| <AssetPreview svg={${importName}} title="${asset.name}" hideCaption /> | \`${asset.name}\` |`,
      )
    }

    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generates installation section for README
 * @param packageName Name of the package
 * @returns Formatted installation section
 */
export function generateInstallationSection(packageName: string): string {
  return `## Installation

\`\`\`bash
npm install @avatune/${packageName}
\`\`\``
}

/**
 * Generates installation section for MDX using InstallTabs component
 * @param packageName Name of the package
 * @returns Formatted installation section for MDX
 */
export function generateInstallationSectionMDX(packageName: string): string {
  return `## Installation

<InstallTabs packages="@avatune/${packageName}" />`
}

/**
 * Generates customization example section
 * @param hairExample Example hair style name
 * @param bodyExample Example body/clothing name
 * @returns Formatted customization section
 */
export function generateCustomizationSection(
  hairExample: string = 'braids',
  bodyExample: string = 'sweaterVest',
): string {
  return `## Customization

You can override specific avatar parts:

\`\`\`tsx
<Avatar
  theme={theme}
  size={300}
  hair="${hairExample}"          // Choose specific hair style
  hairColor="#FF5733"    // Custom hair color
  body="${bodyExample}"     // Choose specific clothing
  bodyColor="#3498DB"    // Custom clothing color
/>
\`\`\``
}

/**
 * Generates development section for README
 * @returns Formatted development section
 */
export function generateDevelopmentSection(): string {
  return `## Development

\`\`\`bash
# Build the theme
bun run build

# Build in watch mode
bun run dev

# Type checking
bun run check-types
\`\`\``
}

/**
 * Generates development section for asset packages
 * @returns Formatted development section for asset packages
 */
export function generateAssetDevelopmentSection(): string {
  return `## Development

Build the library:

\`\`\`bash
bun run build
\`\`\`

Build in watch mode:

\`\`\`bash
bun dev
\`\`\``
}

/**
 * Generates related packages section
 * @param assetsPackageName Name of the assets package
 * @param isForReadme Whether this is for a README (vs MDX)
 * @returns Formatted related packages section
 */
export function generateRelatedPackagesSection(
  assetsPackageName: string,
): string {
  const baseUrl = 'https://github.com/avatune/avatune/tree/main/packages'
  const assetsUrl = `${baseUrl}/assets/${assetsPackageName}`
  const renderersUrl = `${baseUrl}/renderers`

  return `## Related Packages

- [\`@avatune/${assetsPackageName}\`](${assetsUrl}) - SVG assets used by this theme
- [\`@avatune/react\`](${renderersUrl}/react) - React avatar renderer
- [\`@avatune/vue\`](${renderersUrl}/vue) - Vue avatar renderer
- [\`@avatune/svelte\`](${renderersUrl}/svelte) - Svelte avatar renderer
- [\`@avatune/vanilla\`](${renderersUrl}/vanilla) - Vanilla JavaScript avatar renderer`
}
