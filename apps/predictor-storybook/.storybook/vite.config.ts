import { defineConfig } from 'vite'
import rsbuildPluginCopyPredictorsTfjsModels from './rsbuild-plugin-copy-predictors-tfjs-models'

export default defineConfig({
  plugins: [rsbuildPluginCopyPredictorsTfjsModels],
})
