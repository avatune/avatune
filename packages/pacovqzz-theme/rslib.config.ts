import { defineConfig } from '@rslib/core'

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
      svelte: './src/svelte.ts',
      vue: './src/vue.ts',
      vanilla: './src/vanilla.ts',
    },
  },
})
