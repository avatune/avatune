import { cpSync } from 'node:fs'
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
      index: './src/plugin.ts',
    },
  },
  output: {
    target: 'node',
    minify: true,
  },
  plugins: [
    {
      name: 'copy-loader',
      setup(api) {
        api.onAfterBuild(() => {
          cpSync('./src/loader.mjs', './dist/loader.mjs')
        })
      },
    },
  ],
})
