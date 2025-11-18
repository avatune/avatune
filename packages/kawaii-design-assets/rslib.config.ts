import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginVue } from '@rsbuild/plugin-vue'
import { defineConfig } from '@rslib/core'
import { pluginSvgToSvelte } from '../rsbuild-plugin-svg-to-svelte/dist'

const colordImport = "import { colord } from 'colord';"
const getReplaceAttrValues = (colorPropName = 'color') => ({
  '#323232': `{${colorPropName}}`,
  '#FC9D80': `{${colorPropName}}`,
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
    }),
    pluginSvgToSvelte({
      svgo: true,
    }),
    pluginVue(),
    pluginSvelte(),
    pluginReact(),
  ],
})
