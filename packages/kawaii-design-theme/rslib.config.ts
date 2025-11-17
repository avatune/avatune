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
      vanilla: './src/vanilla.ts',
      react: './src/react.ts',
      vue: './src/vue.ts',
      svelte: './src/svelte.ts',
    },
  },
})
