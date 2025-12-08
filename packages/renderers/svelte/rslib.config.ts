import * as fs from 'node:fs'
import * as path from 'node:path'
import { pluginSvelte } from '@rsbuild/plugin-svelte'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      source: {
        entry: {
          index: './src/index.ts',
        },
      },
    },
  ],
  output: {
    minify: true,
  },
  plugins: [
    pluginSvelte(),
    {
      name: 'emit-svelte-entry',
      setup(api) {
        api.onAfterBuild(async () => {
          const distDir = path.resolve('./dist')
          const srcDir = path.resolve('./src')

          // Copy Avatar.svelte to dist
          const avatarSrc = path.join(srcDir, 'Avatar.svelte')
          const avatarDest = path.join(distDir, 'Avatar.svelte')
          fs.copyFileSync(avatarSrc, avatarDest)

          // Create svelte.js that re-exports from Avatar.svelte
          const svelteContent = `import AvatarComponent from './Avatar.svelte'
export { AvatarComponent as Avatar }
`
          fs.writeFileSync(path.join(distDir, 'svelte.js'), svelteContent)

          // Create svelte.d.ts with proper types
          const svelteDtsContent = `export { Avatar, type AvatarProps } from './index.js';
`
          fs.writeFileSync(path.join(distDir, 'svelte.d.ts'), svelteDtsContent)

          // Remove index.js - only keep index.d.ts for type references
          const indexJsPath = path.join(distDir, 'index.js')
          if (fs.existsSync(indexJsPath)) {
            fs.unlinkSync(indexJsPath)
          }
        })
      },
    },
  ],
})
