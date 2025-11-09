import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      index: 'src/index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: {
        bundle: false,
      },
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
  output: {
    target: 'node',
    externals: {
      '@rsbuild/core': '@rsbuild/core',
    },
  },
})
