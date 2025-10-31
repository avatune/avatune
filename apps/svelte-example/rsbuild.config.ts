import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { defineConfig } from '@rsbuild/core'

export default defineConfig({
  plugins: [pluginSvelte()],
  html: {
    template: './index.html',
  },
})
