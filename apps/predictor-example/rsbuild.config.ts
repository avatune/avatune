import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        {
          name: 'copy-tfjs-models',
          apply(compiler) {
            compiler.hooks.beforeCompile.tap('copy-tfjs-models', () => {
              const projectRoot = resolve(__dirname, '../..')
              const publicDir = resolve(__dirname, 'public')

              console.log('Copying TFJS models to public directory...')

              // Create models directory
              const modelsDir = resolve(publicDir, 'models')
              if (!existsSync(modelsDir)) {
                mkdirSync(modelsDir, { recursive: true })
              }

              // Copy each model
              const models = [
                { name: 'hair-color', source: 'hair_color' },
                { name: 'hair-length', source: 'hair_length' },
                { name: 'skin-tone', source: 'skin_tone' },
              ]

              for (const { name, source } of models) {
                const sourceDir = resolve(
                  projectRoot,
                  'python/models',
                  source,
                  'tfjs',
                )
                const destDir = resolve(modelsDir, name)

                if (existsSync(sourceDir)) {
                  console.log(`  ✓ Copying ${name} model...`)
                  cpSync(sourceDir, destDir, { recursive: true })
                } else {
                  console.warn(`  ⚠ Model not found: ${sourceDir}`)
                }
              }

              console.log('✓ Models copied successfully\n')
            })
          },
        },
      ],
    },
  },
})
