import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/angular'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appNodeModules = resolve(__dirname, '../node_modules')

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/angular'),
    options: {
      projectName: 'angular-storybook',
    },
  },
  webpackFinal: async (config) => {
    config.resolve ??= {}
    config.resolve.modules = [
      appNodeModules,
      ...(config.resolve.modules ?? ['node_modules']),
    ]

    return config
  },
}
export default config
