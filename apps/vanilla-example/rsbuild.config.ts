import { defineConfig } from '@rsbuild/core'

export default defineConfig({
  html: {
    template: './src/index.html',
  },
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
})
