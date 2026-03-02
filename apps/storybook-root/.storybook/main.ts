import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/html-vite'

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
    predictor: {
      title: 'Photo Analysis',
      url: 'http://localhost:6005',
      expanded: true,
    },
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
    solidjs: {
      title: 'SolidJS',
      url: 'http://localhost:6011',
      expanded: true,
    },
    angular: {
      title: 'Angular',
      url: 'http://localhost:6012',
      expanded: true,
    },
  },
}

export default config
