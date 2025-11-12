import { pluginCopyTfjsModel } from '@avatune/rsbuild-plugin-copy-tfjs-model'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      index: 'src/index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: {
        bundle: false,
      },
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
  output: {
    target: 'node',
    externals: {
      '@tensorflow/tfjs': '@tensorflow/tfjs',
      '@tensorflow/tfjs-backend-webgl': '@tensorflow/tfjs-backend-webgl',
      '@tensorflow/tfjs-backend-wasm': '@tensorflow/tfjs-backend-wasm',
    },
  },
  plugins: [pluginCopyTfjsModel({ modelName: 'hair_color' })],
})
