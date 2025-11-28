#!/usr/bin/env bun
/**
 * Generates the root README.md based on available renderers, themes, and predictors
 */

import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { capitalizeFirst, toPascalCase } from './shared'

const PACKAGES_DIR = join(process.cwd(), 'packages')

interface PackageInfo {
  name: string
  packageName: string
  displayName: string
  path: string
}

function discoverPackages(subdir: string, suffix: string): PackageInfo[] {
  const dir = join(PACKAGES_DIR, subdir)
  const packages = readdirSync(dir)
    .filter((pkg) => (suffix ? pkg.endsWith(suffix) : true))
    .sort()

  return packages.map((pkg) => {
    const name = suffix ? pkg.replace(suffix, '') : pkg
    return {
      name,
      packageName: pkg,
      displayName: toPascalCase(name)
        .replace(/([A-Z])/g, ' $1')
        .trim(),
      path: `./packages/${subdir}/${pkg}`,
    }
  })
}

function generateThemesTable(themes: PackageInfo[]): string {
  const lines = ['| Theme | Package |', '|-------|---------|']

  for (const theme of themes) {
    lines.push(
      `| ${theme.displayName} | [\`@avatune/${theme.packageName}\`](${theme.path}) |`,
    )
  }

  return lines.join('\n')
}

function generateRenderersTable(renderers: PackageInfo[]): string {
  const lines = ['| Framework | Package |', '|-----------|---------|']

  const frameworkLabels: Record<string, string> = {
    react: 'React',
    'react-native': 'React Native',
    vue: 'Vue 3',
    svelte: 'Svelte 5',
    vanilla: 'Vanilla JS',
  }

  // Sort renderers in logical order
  const order = ['react', 'react-native', 'vue', 'svelte', 'vanilla']
  const sorted = [...renderers].sort(
    (a, b) => order.indexOf(a.name) - order.indexOf(b.name),
  )

  for (const renderer of sorted) {
    const label =
      frameworkLabels[renderer.name] || capitalizeFirst(renderer.name)
    lines.push(
      `| ${label} | [\`@avatune/${renderer.name}\`](${renderer.path}) |`,
    )
  }

  return lines.join('\n')
}

function generatePredictorsTable(predictors: PackageInfo[]): string {
  const lines = [
    '| Predictor | Package | Description |',
    '|-----------|---------|-------------|',
  ]

  const descriptions: Record<string, string> = {
    'face-detector': 'Detect faces in images',
    'hair-color-predictor': 'Predict hair color from images',
    'hair-length-predictor': 'Predict hair length from images',
    'skin-tone-predictor': 'Predict skin tone from images',
  }

  for (const predictor of predictors) {
    const desc = descriptions[predictor.packageName] || 'ML predictor'
    lines.push(
      `| ${predictor.displayName} | [\`@avatune/${predictor.packageName}\`](${predictor.path}) | ${desc} |`,
    )
  }

  return lines.join('\n')
}

function generateReadme(
  themes: PackageInfo[],
  renderers: PackageInfo[],
  predictors: PackageInfo[],
): string {
  const firstTheme = themes[0]?.packageName || 'yanliu-theme'

  return `# Avatune

<p align="center">
  <img src="https://github.com/avatune/avatune/blob/main/apps/website/public/favicon.png?raw=true" alt="Avatune Logo" width="300" />
</p>

**Production-ready avatar system with AI-powered generation and framework-native components.**

Generate beautiful, customizable avatars with machine learning prediction or manual configuration. Works seamlessly with React, Vue, Svelte, and Vanilla JavaScript.

## Features

- **AI-Powered Generation** - Train and use TensorFlow.js models for intelligent avatar attribute prediction (hair color, skin tone, hair length)
- **Framework Native** - First-class support for React, Vue, Svelte, and Vanilla JS with framework-specific components
- **Theme System** - Multiple professionally designed themes with full customization support
- **Type Safe** - Built with TypeScript for complete type safety across all packages
- **Production Ready** - Optimized builds with Rspack, tree-shakeable, and performant

## Quick Start

\`\`\`bash
# Install a theme and renderer for your framework
npm install @avatune/${firstTheme} @avatune/react
\`\`\`

\`\`\`tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/${firstTheme}/react'

function App() {
  return <Avatar theme={theme} seed="unique-identifier" size={300} />
}
\`\`\`

## Available Themes

All themes support React, Vue, Svelte, and Vanilla JavaScript.

${generateThemesTable(themes)}

## Framework Renderers

${generateRenderersTable(renderers)}

## Predictors

Train custom TensorFlow.js models or use pre-trained predictors:

${generatePredictorsTable(predictors)}

Models are trained in Python and exported to TensorFlow.js for browser inference.

## Live Demo

Explore all themes and frameworks in the unified Storybook:

\`\`\`bash
bun run build && bun storybook
\`\`\`

This launches a single Storybook instance showcasing all themes across React, Vue, Svelte, and Vanilla implementations.

## Development

Built with a modern monorepo setup:

- **Turborepo** - Intelligent build system with caching
- **Bun** - Fast package manager and runtime
- **Rspack** - Lightning-fast bundler for production builds
- **Biome** - Fast linting and formatting

\`\`\`bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run all storybooks
bun storybook
\`\`\`

## Creating Custom Themes

Use the theme builder to create your own themes:

\`\`\`typescript
import type { ReactAvatarItem } from '@avatune/types'
import { createTheme, fromHead } from '@avatune/theme-builder'
import { percentage } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * percentage('8%'),
  y: size * percentage('3%'),
})

const fromHeadOffset = fromHead(getHeadPosition)

const myTheme = createTheme()
  .withStyle({ size: 500, borderRadius: '100%' })
  .addColors('hair', ['#000000', '#8B4513'])
  .addColors('body', ['#FF0000', '#00FF00'])
  .toFramework<ReactAvatarItem>()
  .withComponents('hair', {
    short: { Component: ShortHair },
    long: { Component: LongHair },
  })
  .build()
\`\`\`

## License

See [LICENSE.md](https://github.com/avatune/avatune/blob/main/LICENSE.md) for license information.

## Credits

Design assets are sourced from community creators. See individual theme packages for license and attribution.
`
}

function main() {
  console.log('Discovering packages...')

  const themes = discoverPackages('themes', '-theme')
  const renderers = discoverPackages('renderers', '')
  const predictors = discoverPackages('predictors', '')

  console.log(
    `Found ${themes.length} themes, ${renderers.length} renderers, ${predictors.length} predictors`,
  )

  const readme = generateReadme(themes, renderers, predictors)
  const outputPath = join(process.cwd(), 'README.md')

  writeFileSync(outputPath, readme, 'utf-8')
  console.log(`✓ Generated README.md at ${outputPath}`)
}

main()
