import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
      dts: false,
    },
  ],
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  output: {
    target: 'node',
    minify: true,
    externals: {
      '@avatune/types': '@avatune/types',
      react: 'react',
      'react/jsx-runtime': 'react/jsx-runtime',
    },
  },
  plugins: [pluginReact()],
})
