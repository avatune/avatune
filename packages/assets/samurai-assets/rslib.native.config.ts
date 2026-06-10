import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig } from '@rslib/core'
import { svgoConfig } from './rslib.shared'

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
      },
    }),
    pluginReact(),
  ],
})
