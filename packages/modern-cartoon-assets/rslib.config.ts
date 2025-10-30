import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { pluginVue } from '@rsbuild/plugin-vue'
import { defineConfig } from '@rslib/core'
import { pluginSvgToVue } from './plugins/svg-to-vue/plugin'

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
      vue: './src/vue.ts',
    },
  },
  plugins: [
    pluginSvgr(),
    pluginSvgToVue({
      svgo: true,
    }),
    pluginVue(),
    pluginReact(),
  ],
})
