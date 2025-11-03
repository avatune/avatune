import { defineConfig } from '@rslib/core'
import { cpSync } from 'node:fs'

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
      index: './src/plugin.ts',
    },
  },
  output: {
    target: 'node',
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
