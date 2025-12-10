import JSZip from 'jszip'
import type { Asset, ThemeData } from '../types'

// Helper functions
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
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

interface AssetFile {
  category: string
  name: string
  fileName: string
  asset: Asset
}

export function generateThemeFile(themeData: ThemeData): string {
  // Head position is typically at center (0, 0) or slightly offset
  // We'll use the head asset's position as the base reference
  const headXPercent = themeData.headAsset?.xPercent || 0
  const headYPercent = themeData.headAsset?.yPercent || 0

  // Calculate head position relative to canvas center
  // In the theme, head position is usually defined as an offset from top-left
  // We'll use a standard position and adjust other assets relative to it
  const headX = Math.abs(headXPercent) || 27
  const headY = Math.abs(headYPercent) || 20

  const lines: string[] = []
  lines.push("import { createTheme, fromHead } from '@avatune/theme-builder'")
  lines.push("import type { BaseAvatarItem } from '@avatune/types'")
  lines.push("import { percentage } from '@avatune/utils'")
  lines.push('import {')
  lines.push('  AccentColors,')
  lines.push('  BackgroundColors,')
  lines.push('  SkinTones,')
  lines.push("} from './colors'")
  lines.push('')
  lines.push('const getHeadPosition = (size: number) => ({')
  lines.push(`  x: size * percentage('${headX}%'),`)
  lines.push(`  y: size * percentage('${headY}%'),`)
  lines.push('})')
  lines.push('')
  lines.push('const fromHeadOffset = fromHead(getHeadPosition)')
  lines.push('')
  lines.push(`export default createTheme<BaseAvatarItem>()`)
  lines.push(`  .withStyle({`)
  lines.push(`    size: ${themeData.size},`)
  lines.push(`    borderRadius: '${themeData.borderRadius}',`)
  lines.push(`  })`)

  // Group assets by category
  const assetsByCategory = new Map<string, Asset[]>()
  if (themeData.headAsset) {
    assetsByCategory.set('head', [themeData.headAsset])
  }
  themeData.assets.forEach((asset) => {
    if (!assetsByCategory.has(asset.category)) {
      assetsByCategory.set(asset.category, [])
    }
    const categoryAssets = assetsByCategory.get(asset.category)
    if (categoryAssets) {
      categoryAssets.push(asset)
    }
  })

  // Generate addItem calls
  const categoryOrder = [
    'accessories',
    'body',
    'ears',
    'eyebrows',
    'eyes',
    'faceHair',
    'glasses',
    'hair',
    'head',
    'mouth',
    'nose',
  ]

  for (const category of categoryOrder) {
    const assets = assetsByCategory.get(category)
    if (!assets || assets.length === 0) continue

    lines.push(`  // ${category.charAt(0).toUpperCase() + category.slice(1)}`)
    for (const asset of assets) {
      // Calculate offset from head position
      // In preview, assets are positioned relative to canvas center (0, 0)
      // We need to convert this to offset from head position
      const xOffset = asset.xPercent - headXPercent
      const yOffset = asset.yPercent - headYPercent
      const xSign = xOffset >= 0 ? '' : '-'
      const ySign = yOffset >= 0 ? '' : '-'
      const xPercent = Math.abs(xOffset) || 0
      const yPercent = Math.abs(yOffset) || 0

      const assetName = toKebabCase(asset.name)
      lines.push(`  .addItem('${asset.category}', '${assetName}', {`)
      if (xPercent === 0 && yPercent === 0) {
        lines.push(
          `    position: fromHeadOffset(percentage('0%'), percentage('0%')),`,
        )
      } else {
        lines.push(
          `    position: fromHeadOffset(${xSign}percentage('${xPercent.toFixed(2)}%'), ${ySign}percentage('${yPercent.toFixed(2)}%')),`,
        )
      }
      lines.push(`    layer: ${asset.layer},`)
      lines.push(`  })`)
    }
  }

  return lines.join('\n')
}

function generateAssetFrameworkFile(
  assets: AssetFile[],
  framework: 'react' | 'vue' | 'svelte' | 'svg' | 'react-native',
): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  const queryParam = {
    react: '?react',
    vue: '?vue',
    svelte: '?svelte',
    svg: '?raw',
    'react-native': '?native',
  }[framework]

  const isSvg = framework === 'svg'

  for (const assetFile of assets) {
    if (assetFile.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(assetFile.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = assetFile.category
    }

    const componentName = isSvg
      ? `${toCamelCase(assetFile.category)}${toPascalCase(assetFile.name)}`
      : `${capitalizeFirst(assetFile.category)}${toPascalCase(assetFile.name)}`

    const importPath = `./svg/${assetFile.category}/${assetFile.fileName}${queryParam}`
    imports.push(`import ${componentName} from '${importPath}'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}

function generateThemeFrameworkFile(
  assets: AssetFile[],
  framework: 'react' | 'vue' | 'svelte' | 'vanilla' | 'react-native',
  assetsPackageName: string,
): string {
  const imports: string[] = []
  const componentMaps: string[] = []

  const isVanilla = framework === 'vanilla'
  const importPath = isVanilla
    ? `@avatune/${assetsPackageName}`
    : `@avatune/${assetsPackageName}/${framework}`

  // Group assets by category
  const assetsByCategory = new Map<string, AssetFile[]>()
  for (const asset of assets) {
    if (!assetsByCategory.has(asset.category)) {
      assetsByCategory.set(asset.category, [])
    }
    const categoryAssets = assetsByCategory.get(asset.category)
    if (categoryAssets) {
      categoryAssets.push(asset)
    }
  }

  // Generate imports
  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    for (const asset of categoryAssets) {
      const componentName = isVanilla
        ? `${toCamelCase(category)}${toPascalCase(asset.name)}`
        : `${capitalizeFirst(category)}${toPascalCase(asset.name)}`

      imports.push(`  ${componentName},`)
    }
  }

  const importStatement = `import {\n${imports.join('\n')}\n} from '${importPath}'`

  // Generate component maps
  const typeMap = {
    react: 'ReactAvatarItem, ReactTheme',
    vue: 'VueAvatarItem, VueTheme',
    svelte: 'SvelteAvatarItem, SvelteTheme',
    vanilla: 'VanillaAvatarItem, VanillaTheme',
    'react-native': 'ReactNativeAvatarItem, ReactNativeTheme',
  }[framework]

  const methodName = isVanilla ? 'code' : 'Component'

  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    const items: string[] = []
    for (const asset of categoryAssets) {
      const componentName = isVanilla
        ? `${toCamelCase(category)}${toPascalCase(asset.name)}`
        : `${capitalizeFirst(category)}${toPascalCase(asset.name)}`
      const assetName = toKebabCase(asset.name)
      items.push(`    ${assetName}: { ${methodName}: ${componentName} },`)
    }
    componentMaps.push(
      `  .withComponents('${category}', {\n${items.join('\n')}\n  })`,
    )
  }

  return `${importStatement}
import type { ${typeMap} } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<${typeMap.split(',')[0]}>()
${componentMaps.join('\n')}
  .build() satisfies ${typeMap.split(',')[1]}
`
}

export async function generateThemeFolder(
  themeName: string,
  themeCode: string,
  themeData: ThemeData,
): Promise<void> {
  const zip = new JSZip()
  const assetsPackageName = `${themeName}-assets`
  const themePackageName = `${themeName}-theme`

  // Prepare asset files
  const allAssets = themeData.headAsset
    ? [themeData.headAsset, ...themeData.assets]
    : themeData.assets

  const assetFiles: AssetFile[] = []
  for (const asset of allAssets) {
    const fileName = `${toKebabCase(asset.name)}.svg`
    assetFiles.push({
      category: asset.category,
      name: asset.name,
      fileName,
      asset,
    })
  }

  // Sort assets by category, then by name
  assetFiles.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  // ============================================================================
  // ASSETS PACKAGE
  // ============================================================================
  const assetsFolder = zip.folder(assetsPackageName)
  const assetsSrcFolder = assetsFolder?.folder('src')
  const assetsSvgFolder = assetsSrcFolder?.folder('svg')

  // Add SVG files organized by category
  const assetsByCategory = new Map<string, AssetFile[]>()
  for (const assetFile of assetFiles) {
    if (!assetsByCategory.has(assetFile.category)) {
      assetsByCategory.set(assetFile.category, [])
    }
    const categoryAssets = assetsByCategory.get(assetFile.category)
    if (categoryAssets) {
      categoryAssets.push(assetFile)
    }
  }

  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    const categoryFolder = assetsSvgFolder?.folder(category)
    for (const assetFile of categoryAssets) {
      const response = await fetch(assetFile.asset.dataUrl)
      const blob = await response.blob()
      categoryFolder?.file(assetFile.fileName, blob)
    }
  }

  // Generate framework entrypoints
  const frameworks: Array<'react' | 'vue' | 'svelte' | 'svg' | 'react-native'> =
    ['react', 'vue', 'svelte', 'svg', 'react-native']

  for (const framework of frameworks) {
    const content = generateAssetFrameworkFile(assetFiles, framework)
    assetsSrcFolder?.file(`${framework}.ts`, content)
  }

  // Add assets package.json
  const assetsPackageJson = {
    name: `@avatune/${assetsPackageName}`,
    version: '1.0.0',
    private: false,
    publishConfig: {
      access: 'public',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/avatune/avatune.git',
    },
    homepage: 'https://avatune.dev',
    bugs: {
      url: 'https://github.com/avatune/avatune/issues',
    },
    author: 'Avatune Team (https://avatune.dev)',
    keywords: [
      'avatune',
      'avatar',
      'svg',
      'components',
      'react',
      'vue',
      'svelte',
    ],
    type: 'module',
    sideEffects: false,
    exports: {
      '.': {
        types: './dist/svg.d.ts',
        import: './dist/svg.js',
        require: './dist/svg.cjs',
      },
      './react': {
        types: './dist/react.d.ts',
        import: './dist/react.js',
        require: './dist/react.cjs',
      },
      './react-native': {
        types: './dist/react-native.d.ts',
        import: './dist/react-native.js',
        require: './dist/react-native.cjs',
      },
      './svelte': {
        svelte: './dist/svelte/index.js',
        types: './dist/svelte.d.ts',
        import: './dist/svelte/index.js',
      },
      './vue': {
        types: './dist/vue.d.ts',
        import: './dist/vue.js',
        require: './dist/vue.cjs',
      },
      './svg': {
        types: './dist/svg.d.ts',
        import: './dist/svg.js',
        require: './dist/svg.cjs',
      },
    },
    types: './dist/svg.d.ts',
    files: ['dist'],
    scripts: {
      'build:web': 'rslib build',
      'build:native': 'rslib build --config rslib.native.config.ts',
      build: 'bun build:web && bun build:native',
      'dev:web': 'rslib build --watch',
      'dev:native': 'rslib build --config rslib.native.config.ts --watch',
      'check-types': 'tsc --noEmit',
    },
    devDependencies: {
      '@avatune/rsbuild-plugin-raw-svg': 'workspace:*',
      '@avatune/rsbuild-plugin-svg-to-svelte': 'workspace:*',
      '@avatune/rsbuild-plugin-svg-to-vue': 'workspace:*',
      '@rsbuild/core': '^1.5.17',
      '@rsbuild/plugin-react': '^1.4.1',
      '@rsbuild/plugin-svelte': '^1.0.10',
      '@rsbuild/plugin-svgr': '^1.2.2',
      '@rsbuild/plugin-vue': '^1.2.0',
      '@rslib/core': '^0.16.1',
      '@types/node': '^24.9.1',
      react: '19.1.0',
      svelte: '^5.0.0',
      vue: '^3.5.22',
      svgo: '^4.0.0',
      typescript: '^5.9.3',
    },
    peerDependencies: {
      react: '>=18.0.0',
      'react-native': '>=0.74.0',
      'react-native-svg': '>=15.0.0',
      svelte: '>=5.0.0',
      vue: '^3.5.22',
    },
    peerDependenciesMeta: {
      react: {
        optional: true,
      },
      'react-native': {
        optional: true,
      },
      'react-native-svg': {
        optional: true,
      },
      svelte: {
        optional: true,
      },
      vue: {
        optional: true,
      },
    },
    dependencies: {
      colord: '^2.9.3',
    },
    license: 'MIT',
  }
  assetsFolder?.file('package.json', JSON.stringify(assetsPackageJson, null, 2))

  // Add assets tsconfig.json
  const assetsTsconfig = {
    compilerOptions: {
      lib: ['ES2022'],
      module: 'ESNext',
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      isolatedModules: true,
      resolveJsonModule: true,
      moduleResolution: 'bundler',
      useDefineForClassFields: true,
      allowImportingTsExtensions: true,
    },
    include: ['src'],
  }
  assetsFolder?.file('tsconfig.json', JSON.stringify(assetsTsconfig, null, 2))

  // Add assets rslib.config.ts
  const assetsRslibConfig = `import { pluginRawSvg } from '@avatune/rsbuild-plugin-raw-svg'
import { pluginSvgToSvelte } from '@avatune/rsbuild-plugin-svg-to-svelte'
import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginVue } from '@rsbuild/plugin-vue'
import { defineConfig } from '@rslib/core'
import { colordImport, getReplaceAttrValues, svgoConfig } from './rslib.shared'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
      dts: false,
    },
  ],
  output: {
    minify: {
      js: true,
      jsOptions: {
        minimizerOptions: {
          mangle: false,
        },
      },
    },
  },
  source: {
    entry: {
      react: './src/react.ts',
      svg: './src/svg.ts',
      vue: './src/vue.ts',
    },
  },
  plugins: [
    pluginSvgr({
      svgrOptions: {
        svgoConfig,
        replaceAttrValues: getReplaceAttrValues('props.color', 'props.uid'),
        template: (variables, { tpl }) => {
          return tpl\`
\${variables.imports};
\${colordImport}

\${variables.interfaces};

function \${variables.componentName}(\${variables.props}) {
  return \${variables.jsx};
}

\${variables.exports};
\`
        },
      },
    }),
    pluginSvgToVue({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
    pluginSvgToSvelte({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
      emitSvelteFiles: {
        svgDir: './src/svg',
        outDir: './dist/svelte',
      },
    }),
    pluginVue(),
    pluginSvelte(),
    pluginReact(),
    pluginRawSvg({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
  ],
})
`
  assetsFolder?.file('rslib.config.ts', assetsRslibConfig)

  // Add assets rslib.shared.ts
  const assetsRslibShared = `import type { Config as SvgoConfig } from 'svgo'

const uid = () => Math.random().toString(36).slice(2, 9)

export const colordImport = "import { colord } from 'colord';"

export const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: { prefix: false, prefixIds: false, prefixClassNames: false },
    },
  ],
}

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => ({
  currentColor: \`{\${colorPropName}}\`,
  '#FCBE93': \`{\${colorPropName}}\`,
  '#FF7A93': \`{\${colorPropName}}\`,
  '#FFA882': \`{colord(\${colorPropName}).darken(0.05).toHex()}\`,
  '#272424': \`{colord(\${colorPropName}).darken(0.2).toHex()}\`,
  '#A4C856': \`{\${colorPropName}}\`,
  '#8DA853': \`{colord(\${colorPropName}).darken(0.05).toHex()}\`,
  '#4F8558': \`{colord(\${colorPropName}).darken(0.1).toHex()}\`,
  '#F06E82': \`{\${colorPropName}}\`,
  filter0_d_144_233: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  filter0_d_144_264: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask0_134_151: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask0_89_489: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask0_91_509: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask0_91_558: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask1_134_151: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
  mask1_91_558: \`{\${uidPropName} + '-' + '\${uid()}'}\`,
})
`
  assetsFolder?.file('rslib.shared.ts', assetsRslibShared)

  // Add assets rslib.native.config.ts
  const assetsRslibNativeConfig = `import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig } from '@rslib/core'
import { colordImport, getReplaceAttrValues, svgoConfig } from './rslib.shared'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
  output: {
    minify: true,
    cleanDistPath: false,
  },
  source: {
    entry: {
      'react-native': './src/react-native.ts',
    },
  },
  plugins: [
    pluginSvgr({
      query: /native/,
      svgrOptions: {
        svgoConfig,
        native: true,
        replaceAttrValues: getReplaceAttrValues('props.color', 'props.uid'),
        template: (variables, { tpl }) => {
          return tpl\`
\${variables.imports};
\${colordImport}

\${variables.interfaces};

function \${variables.componentName}(\${variables.props}) {
  return \${variables.jsx};
}

\${variables.exports};
\`
        },
      },
    }),
    pluginReact(),
  ],
})
`
  assetsFolder?.file('rslib.native.config.ts', assetsRslibNativeConfig)

  // Add assets src/global.d.ts
  const assetsGlobalDts = `declare module '*.svg?raw' {
  import type { AvatarSvgProps } from '@avatune/types'
  const raw: (props: AvatarSvgProps) => string
  export default raw
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'
  const Component: FC<SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.svg?native' {
  import type { FC, SVGProps } from 'react-native-svg'
  const Component: FC<SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.svg' {
  const url: string
  export default url
}

declare module '*.svg?svelte' {
  import type { Component } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'

  interface SvgComponentProps extends SVGAttributes<SVGSVGElement> {
    className?: string
    style?: string
  }

  const component: Component<SvgComponentProps>
  export default component
  export const raw: string
}

declare module '*.svg?vue' {
  import type { DefineComponent, SVGAttributes } from 'vue'

  interface SvgComponentProps extends SVGAttributes {
    className?: string
    style?: string
  }

  const component: DefineComponent<SvgComponentProps>
  export default component
}
`
  assetsSrcFolder?.file('global.d.ts', assetsGlobalDts)

  // Add assets README.md
  const assetsReadme = `# @avatune/${assetsPackageName}

[![npm version](https://img.shields.io/npm/v/@avatune/${assetsPackageName})](https://www.npmjs.com/package/@avatune/${assetsPackageName})
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/${assetsPackageName})](https://www.npmjs.com/package/@avatune/${assetsPackageName})

${capitalizeFirst(themeName)} style SVG assets for avatar generation.

## Description

This package provides SVG assets in ${themeName} style for creating customizable avatars.

## Installation

\`\`\`bash
npm install @avatune/${assetsPackageName}
\`\`\`

## Usage

### SVG Paths

\`\`\`typescript
import { hair, eyes, mouth } from '@avatune/${assetsPackageName}';
\`\`\`

### React Components

\`\`\`typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/react';
\`\`\`

### Svelte Components

\`\`\`typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/svelte';
\`\`\`

### Vue Components

\`\`\`typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/${assetsPackageName}/vue';
\`\`\`

## License

MIT
`
  assetsFolder?.file('README.md', assetsReadme)

  // Add assets CHANGELOG.md
  const assetsChangelog = `# @avatune/${assetsPackageName}

## 1.0.0

Initial release.
`
  assetsFolder?.file('CHANGELOG.md', assetsChangelog)

  // ============================================================================
  // THEME PACKAGE
  // ============================================================================
  const themeFolder = zip.folder(themePackageName)
  const themeSrcFolder = themeFolder?.folder('src')

  // Add shared.ts
  themeSrcFolder?.file('shared.ts', themeCode)

  // Add colors.ts
  const colorsCode = `export enum SkinTones {
  Medium = '#C78A5C',
  Dark = '#80502E',
  Light = '#FCBE93',
  VeryLight = '#FDCDAC',
  VeryLight2 = '#F5D0C5',
}

export enum AccentColors {
  Black = '#000000',
  White = '#FFFFFF',
  Lavender = '#9287FF',
  Sky = '#6BD9E9',
  Salmon = '#FC909F',
  Canary = '#F4D150',
}

export enum BackgroundColors {
  Seashell = '#FFEDEF',
}
`
  themeSrcFolder?.file('colors.ts', colorsCode)

  // Generate framework-specific theme files
  const themeFrameworks: Array<
    'react' | 'vue' | 'svelte' | 'vanilla' | 'react-native'
  > = ['react', 'vue', 'svelte', 'vanilla', 'react-native']

  for (const framework of themeFrameworks) {
    const content = generateThemeFrameworkFile(
      assetFiles,
      framework,
      assetsPackageName,
    )
    themeSrcFolder?.file(`${framework}.ts`, content)
  }

  // Add theme package.json
  const themePackageJson = {
    name: `@avatune/${themePackageName}`,
    version: '1.0.0',
    private: false,
    publishConfig: {
      access: 'public',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/avatune/avatune.git',
    },
    homepage: 'https://avatune.dev',
    bugs: {
      url: 'https://github.com/avatune/avatune/issues',
    },
    author: 'Avatune Team (https://avatune.dev)',
    keywords: [
      'avatune',
      'avatar',
      'theme',
      'customization',
      'react',
      'vue',
      'svelte',
    ],
    type: 'module',
    exports: {
      '.': {
        types: './dist/vanilla.d.ts',
        import: './dist/vanilla.js',
        require: './dist/vanilla.cjs',
      },
      './vanilla': {
        types: './dist/vanilla.d.ts',
        import: './dist/vanilla.js',
        require: './dist/vanilla.cjs',
      },
      './react': {
        types: './dist/react.d.ts',
        import: './dist/react.js',
        require: './dist/react.cjs',
      },
      './vue': {
        types: './dist/vue.d.ts',
        import: './dist/vue.js',
        require: './dist/vue.cjs',
      },
      './svelte': {
        svelte: './dist/svelte.js',
        types: './dist/svelte.d.ts',
        import: './dist/svelte.js',
      },
      './react-native': {
        types: './dist/react-native.d.ts',
        import: './dist/react-native.js',
        require: './dist/react-native.cjs',
      },
    },
    types: './dist/vanilla.d.ts',
    files: ['dist'],
    scripts: {
      build: 'rslib build',
      dev: 'rslib build --watch',
      'check-types': 'tsc --noEmit',
    },
    dependencies: {
      [`@avatune/${assetsPackageName}`]: 'workspace:*',
      '@avatune/theme-builder': 'workspace:*',
      '@avatune/types': 'workspace:*',
      '@avatune/utils': 'workspace:*',
    },
    devDependencies: {
      '@avatune/typescript-config': 'workspace:*',
      '@rslib/core': '^0.16.1',
      '@types/node': '^22.18.12',
      typescript: '^5.9.3',
    },
    peerDependencies: {
      react: '>=18.0.0',
      'react-native': '>=0.74.0',
      'react-native-svg': '>=15.0.0',
      svelte: '>=5.0.0',
      vue: '^3.5.22',
    },
    peerDependenciesMeta: {
      react: {
        optional: true,
      },
      svelte: {
        optional: true,
      },
      vue: {
        optional: true,
      },
      'react-native': {
        optional: true,
      },
      'react-native-svg': {
        optional: true,
      },
    },
    license: 'MIT',
  }
  themeFolder?.file('package.json', JSON.stringify(themePackageJson, null, 2))

  // Add theme tsconfig.json
  const themeTsconfig = {
    extends: '@avatune/typescript-config/base',
    compilerOptions: {
      module: 'ESNext',
      moduleResolution: 'bundler',
      outDir: 'dist',
      rootDir: 'src',
      jsx: 'react-jsx',
      paths: {
        '@avatune/types': ['../types/dist/index.d.ts'],
        [`@avatune/${assetsPackageName}/svg`]: [
          `../${assetsPackageName}/dist/svg/index.d.ts`,
        ],
        [`@avatune/${assetsPackageName}/react`]: [
          `../${assetsPackageName}/dist/react/index.d.ts`,
        ],
        [`@avatune/${assetsPackageName}/svelte`]: [
          `../${assetsPackageName}/dist/svelte/index.d.ts`,
        ],
        [`@avatune/${assetsPackageName}/vue`]: [
          `../${assetsPackageName}/dist/vue/index.d.ts`,
        ],
        [`@avatune/${assetsPackageName}/react-native`]: [
          `../${assetsPackageName}/dist/react-native/index.d.ts`,
        ],
        '@avatune/theme-builder': ['../theme-builder/dist/index.d.ts'],
      },
    },
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  }
  themeFolder?.file('tsconfig.json', JSON.stringify(themeTsconfig, null, 2))

  // Add theme rslib.config.ts
  const themeRslibConfig = `import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      source: {
        entry: {
          vanilla: './src/vanilla.ts',
          react: './src/react.ts',
          vue: './src/vue.ts',
          'react-native': './src/react-native.ts',
        },
      },
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
      dts: false,
      source: {
        entry: {
          vanilla: './src/vanilla.ts',
          react: './src/react.ts',
          vue: './src/vue.ts',
          'react-native': './src/react-native.ts',
        },
      },
    },
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      source: {
        entry: {
          svelte: './src/svelte.ts',
        },
      },
      output: {
        externals: [/@avatune\\/.*/],
      },
    },
  ],
  output: {
    minify: true,
  },
})
`
  themeFolder?.file('rslib.config.ts', themeRslibConfig)

  // Add theme README.md
  const themeReadme = `# @avatune/${themePackageName}

[![npm version](https://img.shields.io/npm/v/@avatune/${themePackageName})](https://www.npmjs.com/package/@avatune/${themePackageName})
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/${themePackageName})](https://www.npmjs.com/package/@avatune/${themePackageName})

Avatar theme for Avatune using ${themeName} design assets.

## Installation

\`\`\`bash
npm install @avatune/${themePackageName}
\`\`\`

## Usage

This theme is available for multiple frameworks: React, Vue, Svelte, and Vanilla JavaScript.

### React

\`\`\`tsx
import { Avatar } from '@avatune/react'
import theme from '@avatune/${themePackageName}/react'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="optional-seed-for-random-generation"
    />
  )
}
\`\`\`

### Vue

\`\`\`vue
<script setup lang="ts">
import { Avatar } from '@avatune/vue'
import theme from '@avatune/${themePackageName}/vue'
</script>

<template>
  <Avatar
    :theme="theme"
    :size="300"
    seed="optional-seed-for-random-generation"
  />
</template>
\`\`\`

### Svelte

\`\`\`svelte
<script lang="ts">
  import { Avatar } from '@avatune/svelte'
  import theme from '@avatune/${themePackageName}/svelte'
</script>

<Avatar
  theme={theme}
  size={300}
  seed="optional-seed-for-random-generation"
/>
\`\`\`

### Vanilla JavaScript

\`\`\`typescript
import { avatar } from '@avatune/vanilla'
import theme from '@avatune/${themePackageName}/vanilla'

const container = document.getElementById('avatar-container')
const svg = avatar({
  theme,
  size: 300,
  seed: 'optional-seed-for-random-generation',
})

container?.appendChild(svg)
\`\`\`

## Design Assets

This theme uses assets from the [\`@avatune/${assetsPackageName}\`](https://github.com/avatune/avatune/tree/main/packages/assets/${assetsPackageName}) package.

## License

This theme package is licensed under MIT.

The design assets used in this theme are separately licensed. See the asset package for details.

## Related Packages

- [\`@avatune/${assetsPackageName}\`](https://github.com/avatune/avatune/tree/main/packages/assets/${assetsPackageName}) - SVG assets used by this theme
- [\`@avatune/react\`](https://github.com/avatune/avatune/tree/main/packages/renderers/react) - React avatar renderer
- [\`@avatune/vue\`](https://github.com/avatune/avatune/tree/main/packages/renderers/vue) - Vue avatar renderer
- [\`@avatune/svelte\`](https://github.com/avatune/avatune/tree/main/packages/renderers/svelte) - Svelte avatar renderer
- [\`@avatune/vanilla\`](https://github.com/avatune/avatune/tree/main/packages/renderers/vanilla) - Vanilla JavaScript avatar renderer

## Development

\`\`\`bash
# Build the theme
bun run build

# Build in watch mode
bun run dev

# Type checking
bun run check-types
\`\`\`
`
  themeFolder?.file('README.md', themeReadme)

  // Add theme CHANGELOG.md
  const themeChangelog = `# @avatune/${themePackageName}

## 1.0.0

Initial release.
`
  themeFolder?.file('CHANGELOG.md', themeChangelog)

  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${themeName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
