import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

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
      index: './src/index.tsx',
    },
  },
  output: {
    target: 'node',
    externals: {
      '@avatune/types': '@avatune/types',
      react: 'react',
      'react-native': 'react-native',
      'react-native-svg': 'react-native-svg',
    },
  },
  plugins: [pluginReact()],
})
