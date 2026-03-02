import { pluginRawSvg } from '@avatune/rsbuild-plugin-raw-svg'
import { pluginSvgToAngular } from '@avatune/rsbuild-plugin-svg-to-angular'
import { pluginSvgToSolid } from '@avatune/rsbuild-plugin-svg-to-solid'
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
          return tpl`
${variables.imports};
${colordImport}

${variables.interfaces};

function ${variables.componentName}(${variables.props}) {
  return ${variables.jsx};
}

${variables.exports};
`
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
  ],
})
