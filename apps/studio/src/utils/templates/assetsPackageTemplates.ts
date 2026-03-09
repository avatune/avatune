import { capitalizeFirst } from '../caseUtils'

/**
 * Generates the assets package.json
 */
export function generateAssetsPackageJson(assetsPackageName: string): string {
  const packageJson = {
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
      './solid': {
        solid: './dist/solid.jsx',
        types: './dist/solid.d.ts',
        import: './dist/solid.js',
        require: './dist/solid.cjs',
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
      './angular': {
        types: './dist/angular.d.ts',
        import: './dist/angular.js',
        require: './dist/angular.cjs',
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
      '@avatune/rsbuild-plugin-svg-to-angular': 'workspace:*',
      '@avatune/rsbuild-plugin-svg-to-solid': 'workspace:*',
      '@avatune/rsbuild-plugin-svg-to-svelte': 'workspace:*',
      '@avatune/rsbuild-plugin-svg-to-vue': 'workspace:*',
      '@rsbuild/core': '^1.5.17',
      '@rsbuild/plugin-react': '^1.4.1',
      '@rsbuild/plugin-solid': '^1.0.5',
      '@rsbuild/plugin-svelte': '^1.0.10',
      '@rsbuild/plugin-svgr': '^1.2.2',
      '@rsbuild/plugin-vue': '^1.2.0',
      '@rslib/core': '^0.16.1',
      '@types/node': '^24.9.1',
      react: '19.1.0',
      'solid-js': '^1.9.0',
      svelte: '^5.0.0',
      vue: '^3.5.22',
      svgo: '^4.0.0',
      typescript: '^5.9.3',
    },
    peerDependencies: {
      react: '>=18.0.0',
      'react-native': '>=0.74.0',
      'react-native-svg': '>=15.0.0',
      'solid-js': '>=1.8.0',
      svelte: '>=5.0.0',
      vue: '^3.5.22',
      '@angular/compiler': '>=19.0.0',
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
      'solid-js': {
        optional: true,
      },
      svelte: {
        optional: true,
      },
      vue: {
        optional: true,
      },
      '@angular/compiler': {
        optional: true,
      },
    },
    dependencies: {
      colord: '^2.9.3',
    },
    license: 'MIT',
  }
  return JSON.stringify(packageJson, null, 2)
}

/**
 * Generates the assets tsconfig.json
 */
export function generateAssetsTsconfig(): string {
  const tsconfig = {
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
  return JSON.stringify(tsconfig, null, 2)
}

/**
 * Generates the assets rslib.config.ts
 */
export function generateAssetsRslibConfig(): string {
  return `import { pluginRawSvg } from '@avatune/rsbuild-plugin-raw-svg'
import { pluginSvgToAngular } from '@avatune/rsbuild-plugin-svg-to-angular'
import {
  pluginSvgToSolid,
  pluginSvgToSolidJsx,
} from '@avatune/rsbuild-plugin-svg-to-solid'
import { pluginSvgToSvelte } from '@avatune/rsbuild-plugin-svg-to-svelte'
import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSolid } from '@rsbuild/plugin-solid'
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
      angular: './src/angular.ts',
      react: './src/react.ts',
      solid: './src/solid.ts',
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
    pluginSvgToAngular({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
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
    pluginSvgToSolid({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
    pluginVue(),
    pluginSvelte(),
    pluginSolid(),
    pluginReact(),
    pluginRawSvg({
      svgo: true,
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
    pluginSvgToSolidJsx({
      svgoConfig,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
  ],
})
`
}

/**
 * Generates the assets rslib.shared.ts
 */
export function generateAssetsRslibShared(): string {
  return `import type { Config as SvgoConfig } from 'svgo'

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
}

/**
 * Generates the assets rslib.native.config.ts
 */
export function generateAssetsRslibNativeConfig(): string {
  return `import { pluginReact } from '@rsbuild/plugin-react'
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
}

/**
 * Generates the assets global.d.ts
 */
export function generateAssetsGlobalDts(): string {
  return `declare module '*.svg?raw' {
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

declare module '*.svg?angular' {
  const asset: {
    template: string | ((color: string, uid: string) => string)
  }
  export default asset
}
`
}

/**
 * Generates the assets README.md
 */
export function generateAssetsReadme(
  themeName: string,
  assetsPackageName: string,
): string {
  return `# @avatune/${assetsPackageName}

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
}
