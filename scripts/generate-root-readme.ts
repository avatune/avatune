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
  const packages = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
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
    'facial-hair-predictor': 'Predict facial hair from images',
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
  const previewTheme = 'pacovqzz-theme'
  const previewTheme2 = 'fatin-verse-theme'
  const previewTheme3 = 'micah-theme'

  return `# Avatune

<p align="center">

[![DeepWiki](https://img.shields.io/badge/DeepWiki-avatune%2Favatune-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/avatune/avatune)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release Packages](https://github.com/avatune/avatune/actions/workflows/release-packages.yml/badge.svg)](https://github.com/avatune/avatune/actions/workflows/release-packages.yml)
[![Deploy Worker](https://github.com/avatune/avatune/actions/workflows/deploy-worker.yml/badge.svg)](https://github.com/avatune/avatune/actions/workflows/deploy-worker.yml)

</p>

<p align="center">
<img src="https://github.com/avatune/avatune/blob/main/assets/logo.png?raw=true" alt="Avatune Logo" width="300" />
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

### Install Theme and Renderer

\`\`\`bash
npm install @avatune/${previewTheme} @avatune/react
# or
yarn add @avatune/${previewTheme2} @avatune/react
# or
pnpm add @avatune/${previewTheme3} @avatune/react
\`\`\`

### Use Native SVG Components

<p align="center">
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-1.svg" alt="Preview #1" />
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-2.svg" alt="Preview #2" />
  <img src="https://github.com/avatune/avatune/blob/main/assets/preview-3.svg" alt="Preview #3" />
</p>

\`\`\`tsx
import { Avatar } from '@avatune/react'
import ${previewTheme.replace('-theme', '').replace('-', '')} from '@avatune/${previewTheme}/react'
import ${previewTheme2.replace('-theme', '').replace('-', '')} from '@avatune/${previewTheme2}/react'
import ${previewTheme3.replace('-theme', '').replace('-', '')} from '@avatune/${previewTheme3}/react'

function App() {
  return (
    <div className="flex justify-between items-center">
      <Avatar theme={${previewTheme.replace('-theme', '').replace('-', '')}} seed="seed" size={200} />
      <Avatar theme={${previewTheme2.replace('-theme', '').replace('-', '')}} seed="seed" size={200} />
      <Avatar theme={${previewTheme3.replace('-theme', '').replace('-', '')}} seed="seed" size={200} />
    </div>
  )
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
