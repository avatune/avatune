import { defineConfig } from '@rslib/core'
import path from 'path'

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
    },
    alias: {
      '@assets': path.resolve(__dirname, 'assets'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.svg$/i,
            oneOf: [
              { resourceQuery: /raw/, type: 'asset/source' },
              { type: 'asset/inline' },
            ],
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
    },
  },
})
