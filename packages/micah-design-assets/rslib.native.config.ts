import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig } from '@rslib/core'

const colordImport = "import { colord } from 'colord';"
const getReplaceAttrValues = (colorPropName = 'color') => ({
  currentColor: `{${colorPropName}}`,
  'color-mix(in srgb, currentColor 60%, white)': `{colord(${colorPropName}).lighten(0.4).toHex()}`,
  'color-mix(in srgb, currentColor 70%, white)': `{colord(${colorPropName}).lighten(0.3).toHex()}`,
  'color-mix(in srgb, currentColor 80%, white)': `{colord(${colorPropName}).lighten(0.2).toHex()}`,
  'color-mix(in srgb, currentColor 80%, black)': `{colord(${colorPropName}).darken(0.2).toHex()}`,
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
