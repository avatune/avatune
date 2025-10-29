import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig } from '@rslib/core'

//TODO: add entry points
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
      react: './src/react.ts',
      svg: './src/svg.ts',
    },
  },
  plugins: [pluginSvgr(), pluginReact()],
})
