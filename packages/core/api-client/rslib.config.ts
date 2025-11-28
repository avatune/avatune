import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: {
        bundle: true,
      },
    },
    {
      format: 'cjs',
      dts: false,
    },
  ],
  output: {
    target: 'node',
    minify: true,
  },
})
