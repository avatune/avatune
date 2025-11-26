import { pluginRawSvg } from '@avatune/rsbuild-plugin-raw-svg'
import { pluginSvgToSvelte } from '@avatune/rsbuild-plugin-svg-to-svelte'
import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginVue } from '@rsbuild/plugin-vue'
import { defineConfig } from '@rslib/core'

const colordImport = "import { colord } from 'colord';"
const getReplaceAttrValues = (colorPropName = 'color') => ({
  '#9A9A9A': `{${colorPropName}}`,
  '#334B71': `{${colorPropName}}`,
  '#537C1E': `{${colorPropName}}`,
  '#901A3E': `{${colorPropName}}`,
  '#C8D3E6': `{colord(${colorPropName}).lighten(0.53).desaturate(0.27).toHex()}`,
  '#4D8FAB': `{${colorPropName}}`,
  '#B78276': `{${colorPropName}}`,
  '#CF7621': `{${colorPropName}}`,
  '#9C6458': `{${colorPropName}}`,
  '#4B301C': `{${colorPropName}}`,
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
