import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginVue } from '@rsbuild/plugin-vue'
import { defineConfig } from '@rslib/core'
import { pluginRawSvg } from '../rsbuild-plugin-raw-svg/dist'
import { pluginSvgToSvelte } from '../rsbuild-plugin-svg-to-svelte/dist'

const colordImport = "import { colord } from 'colord';"
const getReplaceAttrValues = (colorPropName = 'color') => ({
  '#FF859B': `{${colorPropName}}`,
  '#E05A33': `{${colorPropName}}`,
  '#C53926': `{colord(${colorPropName}).rotate(-7).desaturate(0.05).darken(0.08).toHex()}`,
  '#1B0B47': `{${colorPropName}}`,
  '#000000': `{${colorPropName}}`,
  '#FFCB7E': `{${colorPropName}}`,
  '#F0BD70': `{colord(${colorPropName}).desaturate(0.08).darken(0.06).toHex()}`,
  '#E9B05B': `{colord(${colorPropName}).desaturate(0.16).darken(0.12).toHex()}`,
  '#B03E67': `{${colorPropName}}`,
  '#66253C': `{colord(${colorPropName}).rotate(3).darken(0.20).toHex()}`,
})

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],

  source: {
    entry: {
      react: './src/react.ts',
      svg: './src/svg.ts',
      svelte: './src/svelte.ts',
      vue: './src/vue.ts',
    },
  },
  plugins: [
    pluginSvgr({
      svgrOptions: {
        replaceAttrValues: getReplaceAttrValues('props.color'),
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
    pluginSvgToVue({
      svgo: true,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
    pluginSvgToSvelte({
      svgo: true,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
    pluginVue(),
    pluginSvelte(),
    pluginReact(),
    pluginRawSvg({
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
  ],
})
