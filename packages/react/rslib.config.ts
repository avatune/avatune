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
    },
  },
  plugins: [pluginReact()],
})
