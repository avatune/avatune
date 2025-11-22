import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig } from '@rslib/core'

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
        native: true,
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
    pluginReact(),
  ],
})
