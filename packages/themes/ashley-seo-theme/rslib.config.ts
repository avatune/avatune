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
  output: {
    minify: true,
  },
  source: {
    entry: {
      react: './src/react.ts',
      svelte: './src/svelte.ts',
      vue: './src/vue.ts',
      vanilla: './src/vanilla.ts',
      'react-native': './src/react-native.ts',
    },
  },
})
