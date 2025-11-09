import { copyFileSync, mkdirSync, readdirSync, rmdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'copy-tfjs-models',
      buildStart() {
        const publicDir = join(__dirname, '..', 'public', 'models')

        try {
          rmdirSync(publicDir, { recursive: true })
        } catch {}

        const models = ['hair_color', 'hair_length', 'skin_tone']

        for (const modelName of models) {
          const predictorDist = join(
            __dirname,
            '../../../packages',
            `${modelName.replace('_', '-')}-predictor`,
            'dist',
          )
          const srcDir = join(predictorDist, 'model')
          const destDir = join(publicDir, modelName)

          try {
            mkdirSync(destDir, { recursive: true })

            copyFileSync(
              join(srcDir, 'model.json'),
              join(destDir, 'model.json'),
            )

            copyFileSync(
              join(srcDir, 'classes.json'),
              join(destDir, 'classes.json'),
            )

            const files = readdirSync(srcDir)
            for (const file of files) {
              if (file.endsWith('.bin')) {
                copyFileSync(join(srcDir, file), join(destDir, file))
              }
            }

            console.log(`✓ Copied ${modelName} model to public/models`)
          } catch (err) {
            console.warn(`⚠ Failed to copy ${modelName} model:`, err)
          }
        }
      },
    },
  ],
})
