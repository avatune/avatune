#!/usr/bin/env bun
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

/**
 * Script to generate asset entrypoints for a given package.
 *
 * Usage: bun scripts/generate-assets.ts <package-name>
 * Example: bun scripts/generate-assets.ts kyute-assets
 */

type Framework =
  | 'react'
  | 'vue'
  | 'svelte'
  | 'solid'
  | 'angular'
  | 'svg'
  | 'react-native'

interface AssetFile {
  category: string
  name: string
  path: string
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function findSvgFiles(svgDir: string): AssetFile[] {
  const assets: AssetFile[] = []

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

    for (const file of files) {
      const name = basename(file, '.svg')
      const path = `./svg/${category}/${file}`
      assets.push({ category, name, path })
    }
  }

  // Sort by category, then by name
  assets.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  return assets
}

function generateReactFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?react'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateNativeFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?native'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateVueFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?vue'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateSvelteFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?svelte'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateSolidFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?solid'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateAngularFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const componentName = `${capitalizeFirst(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${componentName} from '${asset.path}?angular'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateSvgFile(assets: AssetFile[]): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  for (const asset of assets) {
    if (asset.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(asset.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = asset.category
    }

    const varName = `${toCamelCase(asset.category)}${toPascalCase(asset.name)}`
    imports.push(`import ${varName} from '${asset.path}?raw'`)
    exports.push(`  ${varName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function main() {
  const packageName = process.argv[2]

  if (!packageName) {
    console.error('Usage: bun scripts/generate-assets.ts <package-name>')
    console.error('Example: bun scripts/generate-assets.ts kyute-assets')
    process.exit(1)
  }

  const packageDir = join(process.cwd(), 'packages', 'assets', packageName)

  if (!existsSync(packageDir)) {
    console.error(`Package not found: ${packageDir}`)
    process.exit(1)
  }

  const svgDir = join(packageDir, 'src', 'svg')
  const srcDir = join(packageDir, 'src')

  console.log(`Generating asset entrypoints for ${packageName}...`)
  console.log(`SVG directory: ${svgDir}`)

  const assets = findSvgFiles(svgDir)

  if (assets.length === 0) {
    console.error('No SVG files found!')
    process.exit(1)
  }

  console.log(
    `Found ${assets.length} SVG files across ${new Set(assets.map((a) => a.category)).size} categories`,
  )

  // Generate files for each framework
  const frameworks: Framework[] = [
    'react',
    'vue',
    'svelte',
    'solid',
    'angular',
    'svg',
    'react-native',
  ]

  for (const framework of frameworks) {
    let content: string

    switch (framework) {
      case 'react':
        content = generateReactFile(assets)
        break
      case 'vue':
        content = generateVueFile(assets)
        break
      case 'svelte':
        content = generateSvelteFile(assets)
        break
      case 'solid':
        content = generateSolidFile(assets)
        break
      case 'angular':
        content = generateAngularFile(assets)
        break
      case 'svg':
        content = generateSvgFile(assets)
        break
      case 'react-native':
        content = generateNativeFile(assets)
        break
    }

    const outputPath = join(srcDir, `${framework}.ts`)
    writeFileSync(outputPath, content, 'utf-8')
    console.log(`✓ Generated ${framework}.ts`)
  }

  console.log('\n✨ All asset entrypoints generated successfully!')
}

main()
