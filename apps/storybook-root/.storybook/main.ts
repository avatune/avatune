import type { StorybookConfig } from '@storybook/html-vite'

import { dirname } from 'path'

import { fileURLToPath } from 'url'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: getAbsolutePath('@storybook/html-vite'),
    options: {},
  },
  refs: {
    react: {
      title: 'React',
      url: 'http://localhost:6006',
      expanded: true,
    },
    vue: {
      title: 'Vue',
      url: 'http://localhost:6007',
      expanded: true,
    },
    svelte: {
      title: 'Svelte',
      url: 'http://localhost:6008',
      expanded: true,
    },
    vanilla: {
      title: 'Vanilla',
      url: 'http://localhost:6009',
      expanded: true,
    },
  },
}

export default config
