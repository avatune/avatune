// @ts-check

import mdx from '@astrojs/mdx'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    // @ts-expect-error - tailwindcss types are not compatible with astro
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['zod'],
    },
  },
  integrations: [
    starlight({
      customCss: ['./src/styles/global.css'],
      title: 'Avatune',
      favicon: '/favicon.png',
      logo: {
        src: './public/favicon.png',
        alt: 'Avatune Logo',
      },
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
            { label: 'Welcome', slug: 'docs' },
            { label: 'Getting Started', slug: 'getting-started' },
            { label: 'Playground', slug: 'playground' },
            {
              label: 'Studio',
              slug: 'studio',
              badge: { text: 'Beta', variant: 'caution' },
            },
          ],
        },
        {
          label: 'Frameworks',
          items: [
            { label: 'React', slug: 'packages/react' },
            { label: 'React Native', slug: 'packages/react-native' },
            { label: 'Angular', slug: 'packages/angular' },
            { label: 'SolidJS', slug: 'packages/solidjs' },
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
            {
              label: 'Fatin Verse',
              slug: 'packages/fatin-verse-theme',
            },
            { label: 'Miniavs', slug: 'packages/miniavs-theme' },
            {
              label: 'Nevmstas',
              slug: 'packages/nevmstas-theme',
            },
            {
              label: 'Ashley Seo',
              slug: 'packages/ashley-seo-theme',
            },
            {
              label: 'Ashleyy',
              slug: 'packages/ashleyy-theme',
            },
            {
              label: 'Micah',
              slug: 'packages/micah-theme',
            },
            { label: 'Kyute', slug: 'packages/kyute-theme' },
            { label: 'Pacovqzz', slug: 'packages/pacovqzz-theme' },
            {
              label: 'Pawel Olek',
              items: [
                { label: 'Man', slug: 'packages/pawel-olek-man-theme' },
                { label: 'Woman', slug: 'packages/pawel-olek-woman-theme' },
              ],
            },
          ],
        },
        {
          label: 'Predictors',
          items: [
            {
              label: 'Facial Hair Predictor',
              slug: 'packages/facial-hair-predictor',
            },
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
        {
          label: 'API',
          items: [{ label: 'REST API', slug: 'api' }],
        },
      ],
    }),
    mdx(),
    svelte(),
  ],
})
