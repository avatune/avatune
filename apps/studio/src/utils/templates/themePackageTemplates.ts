/**
 * Generates the theme package.json
 */
export function generateThemePackageJson(
  themePackageName: string,
  assetsPackageName: string,
): string {
  const packageJson = {
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
  return JSON.stringify(packageJson, null, 2)
}

/**
 * Generates the theme tsconfig.json
 */
export function generateThemeTsconfig(assetsPackageName: string): string {
  const tsconfig = {
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
  return JSON.stringify(tsconfig, null, 2)
}

/**
 * Generates the theme rslib.config.ts
 */
export function generateThemeRslibConfig(): string {
  return `import { defineConfig } from '@rslib/core'

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
}

/**
 * Generates the theme colors.ts
 */
export function generateThemeColors(): string {
  return `export enum SkinTones {
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
}

/**
 * Generates the theme README.md
 */
export function generateThemeReadme(
  themeName: string,
  themePackageName: string,
  assetsPackageName: string,
): string {
  return `# @avatune/${themePackageName}

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
}
