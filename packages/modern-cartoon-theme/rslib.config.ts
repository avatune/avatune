import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginVue } from '@rsbuild/plugin-vue'
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
  output: {
    target: 'node',
    externals: {
      '@avatune/modern-cartoon-assets': '@avatune/modern-cartoon-assets',
      '@avatune/modern-cartoon-assets/svg':
        '@avatune/modern-cartoon-assets/svg',
      '@avatune/types': '@avatune/types',
    },
  },
  plugins: [pluginVue(), pluginSvelte()],
})
