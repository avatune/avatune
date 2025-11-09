import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RsbuildPlugin } from '@rsbuild/core'

export interface CopyTfjsModelOptions {
  modelName: string
  pythonModelsDir?: string
  outputDir?: string
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function pluginCopyTfjsModel(
  options: CopyTfjsModelOptions,
): RsbuildPlugin {
  const { modelName, pythonModelsDir, outputDir = 'dist/model' } = options

  return {
    name: 'copy-tfjs-model',
    setup(api) {
      api.onAfterBuild(() => {
        const modelSrcDir = pythonModelsDir
          ? path.join(pythonModelsDir, modelName, 'tfjs')
          : path.join(
              __dirname,
              '..',
              '..',
              '..',
              'python',
              'models',
              modelName,
              'tfjs',
            )

        const modelDestDir = path.join(process.cwd(), outputDir)

        try {
          mkdirSync(modelDestDir, { recursive: true })

          copyFileSync(
            path.join(modelSrcDir, 'model.json'),
            path.join(modelDestDir, 'model.json'),
          )

          copyFileSync(
            path.join(modelSrcDir, 'classes.json'),
            path.join(modelDestDir, 'classes.json'),
          )

          const files = readdirSync(modelSrcDir)
          for (const file of files) {
            if (file.endsWith('.bin')) {
              copyFileSync(
                path.join(modelSrcDir, file),
                path.join(modelDestDir, file),
              )
            }
          }

          console.log(`✓ Copied ${modelName} model to ${outputDir}`)
        } catch (err) {
          console.warn(`⚠ Failed to copy ${modelName} model:`, err)
        }
      })
    },
  }
}
