/// <reference types="vitest" />

import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig((configEnv) => ({
  plugins: [svelte()],
  resolve: {
    conditions: configEnv.mode === 'test' ? ['browser'] : [],
    alias: {
      // This is already set up in svelte.config.js, but we need it explicitly here for vitest
      $lib: path.resolve(__dirname, 'src'),
    },
  },
}))
