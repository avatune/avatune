import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      source: {
        entry: {
          vanilla: './src/vanilla.ts',
          react: './src/react.ts',
          vue: './src/vue.ts',
          'react-native': './src/react-native.ts',
        },
      },
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
      dts: false,
      source: {
        entry: {
          vanilla: './src/vanilla.ts',
          react: './src/react.ts',
          vue: './src/vue.ts',
          'react-native': './src/react-native.ts',
        },
      },
    },
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      source: {
        entry: {
          svelte: './src/svelte.ts',
        },
      },
      output: {
        // Keep all @avatune dependencies external so SvelteKit resolves them
        // and compiles Svelte components with correct SSR mode
        externals: [/@avatune\/.*/],
      },
    },
  ],
  output: {
    minify: true,
  },
})
