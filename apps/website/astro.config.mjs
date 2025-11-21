// @ts-check

import mdx from '@astrojs/mdx'
import starlight from '@astrojs/starlight'
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
          label: 'Frameworks',
          items: [
            { label: 'React', slug: 'packages/react' },
            { label: 'Vue', slug: 'packages/vue' },
            { label: 'Svelte', slug: 'packages/svelte' },
            { label: 'Vanilla', slug: 'packages/vanilla' },
          ],
        },
        {
          label: 'Themes',
          items: [
            {
              label: 'Kawaii Design',
              slug: 'packages/kawaii-design-theme',
            },
            {
              label: 'Kawaii Assets',
              slug: 'packages/kawaii-design-assets',
            },
            { label: 'Miniavs', slug: 'packages/miniavs-theme' },
            { label: 'Miniavs Assets', slug: 'packages/miniavs-assets' },
            {
              label: 'Flat Design',
              slug: 'packages/flat-design-theme',
            },
            { label: 'Flat Assets', slug: 'packages/flat-design-assets' },
            {
              label: 'Micah Design',
              slug: 'packages/micah-design-theme',
            },
            { label: 'Micah Assets', slug: 'packages/micah-design-assets' },
            { label: 'Kyute Assets', slug: 'packages/kyute-assets' },
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
  ],
})
