// @ts-check

import mdx from '@astrojs/mdx'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
  integrations: [
    starlight({
      title: 'Avatune Docs',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/avatune/avatune',
        },
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Welcome', slug: 'welcome' },
            { label: 'Why Avatune', slug: 'why-avatune' },
          ],
        },
        {
          label: 'API',
          items: [{ label: 'REST API', slug: 'api' }],
        },
        {
          label: 'Frameworks',
          items: [
            { label: 'React', slug: 'packages/react' },
            { label: 'React Native', slug: 'packages/react-native' },
            { label: 'Vue', slug: 'packages/vue' },
            { label: 'Svelte', slug: 'packages/svelte' },
            { label: 'Vanilla', slug: 'packages/vanilla' },
          ],
        },
        {
          label: 'Themes',
          items: [
            {
              label: 'Yanliu',
              slug: 'packages/yanliu-theme',
            },
            { label: 'Miniavs', slug: 'packages/miniavs-theme' },
            {
              label: 'Nevmstas',
              slug: 'packages/nevmstas-theme',
            },
            {
              label: 'Micah',
              slug: 'packages/micah-theme',
            },
            { label: 'Kyute', slug: 'packages/kyute-theme' },
          ],
        },
        {
          label: 'Predictors',
          items: [
            {
              label: 'Hair Color Predictor',
              slug: 'packages/hair-color-predictor',
            },
            {
              label: 'Hair Length Predictor',
              slug: 'packages/hair-length-predictor',
            },
            {
              label: 'Skin Tone Predictor',
              slug: 'packages/skin-tone-predictor',
            },
          ],
        },
      ],
    }),
    mdx(),
    svelte(),
  ],
})
