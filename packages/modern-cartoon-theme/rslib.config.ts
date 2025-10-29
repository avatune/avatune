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
      index: './src/index.ts',
      vanilla: './src/vanilla.ts',
      react: './src/react.ts',
    },
  },
  output: {
    target: 'node',
    externals: {
      '@avatune/modern-cartoon-assets': '@avatune/modern-cartoon-assets',
      '@avatune/modern-cartoon-assets/svg':
        '@avatune/modern-cartoon-assets/svg',
      '@avatune/types': '@avatune/types',
    },
  },
})
