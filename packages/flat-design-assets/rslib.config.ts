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
  currentColor: `{${colorPropName}}`,
  '#FCBE93': `{${colorPropName}}`,
  '#FF7A93': `{${colorPropName}}`,
  '#FFA882': `{colord(${colorPropName}).darken(0.05).toHex()}`,
  '#272424': `{colord(${colorPropName}).darken(0.2).toHex()}`,
  '#A4C856': `{${colorPropName}}`,
  '#8DA853': `{colord(${colorPropName}).darken(0.05).toHex()}`,
  '#4F8558': `{colord(${colorPropName}).darken(0.1).toHex()}`,
  '#F06E82': `{${colorPropName}}`,
})

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
  },
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
      svgo: true,
      imports: colordImport,
      replaceAttrValues: getReplaceAttrValues('color'),
    }),
  ],
})
