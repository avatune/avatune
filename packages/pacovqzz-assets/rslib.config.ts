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
  '#F5C09B': `{${colorPropName}}`,
  '#E7B431': `{${colorPropName}}`,
  '#DAB797': `{${colorPropName}}`,
  '#3A486B': `{${colorPropName}}`,
  '#273D32': `{${colorPropName}}`,
  '#34483E': `{colord(${colorPropName}).desaturate(0.06).lighten(0.04).toHex()}`,
  '#B77131': `{colord(${colorPropName}).rotate(190).desaturate(0.29).darken(0.14).toHex()}`,
  '#AEA08B': `{${colorPropName}}`,
  '#827165': `{colord(${colorPropName}).rotate(-16).desaturate(0.06).darken(0.16).toHex()}`,
  '#1C2845': `{${colorPropName}}`,
  '#31333A': `{${colorPropName}}`,
  '#715B53': `{colord(${colorPropName}).rotate(-14).desaturate(0.37).darken(0.34).toHex()}`,
  '#483832': `{colord(${colorPropName}).rotate(-14).desaturate(0.34).darken(0.49).toHex()}`,
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
    }),
    pluginSvgToSvelte({
      svgo: true,
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
