import { pluginSvgToSvelte } from '@avatune/rsbuild-plugin-svg-to-svelte'
import { pluginSvgToVue } from '@avatune/rsbuild-plugin-svg-to-vue'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
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
      react: './src/react.ts',
      svg: './src/svg.ts',
      svelte: './src/svelte.ts',
      vue: './src/vue.ts',
    },
  },
  plugins: [
    pluginSvgr(),
    pluginSvgToVue({
      svgo: true,
    }),
    pluginSvgToSvelte({
      svgo: true,
    }),
    pluginVue(),
    pluginSvelte(),
    pluginReact(),
  ],
})
