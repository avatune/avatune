import { codeToHtml } from 'shiki'
import jsLogo from '../assets/javascript-logo.svg'
import reactLogo from '../assets/react-logo.svg'
import reactNativeLogo from '../assets/react-native.svg'
import svelteLogo from '../assets/svelte-logo.svg'
import vueLogo from '../assets/vue-logo.svg'

export type FrameworkThemeId =
  | 'yanliu'
  | 'miniavs'
  | 'nevmstas'
  | 'micah'
  | 'kyute'

export interface FrameworkShowcaseEntry {
  id: string
  label: string
  description: string
  filePath: string
  language: string
  themeId: FrameworkThemeId
  snippet: string
  highlightedSnippet: string
  logo?: {
    src: string
    alt: string
  }
}

interface FrameworkDefinition {
  id: string
  label: string
  description: string
  language: string
  filePath: string
  themeId: FrameworkThemeId
  logo?: {
    src: string
    alt: string
  }
  getSnippet: (seed: string) => string
}

const frameworkDefinitions: FrameworkDefinition[] = [
  {
    id: 'react',
    label: 'React',
    description: 'Hooks, config helpers, and starter kit.',
    language: 'tsx',
    filePath: 'src/components/Avatar.tsx',
    themeId: 'yanliu',
    logo: { src: reactLogo.src, alt: 'React logo' },
    getSnippet: (seed: string) => `import { Avatar } from '@avatune/react'
import theme from '@avatune/yanliu-theme/react'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="${seed}"
    />
  )
}`,
  },
  {
    id: 'vue',
    label: 'Vue',
    description: 'Composable API bindings with examples.',
    language: 'vue',
    filePath: 'src/components/Avatar.vue',
    themeId: 'miniavs',
    logo: { src: vueLogo.src, alt: 'Vue logo' },
    getSnippet: (seed: string) => {
      const scriptTag = '<script setup lang="ts">'
      const scriptClose = '</' + 'script>'
      return `${scriptTag}
import { Avatar } from '@avatune/vue'
import theme from '@avatune/miniavs-theme/vue'
${scriptClose}

<template>
  <Avatar
    :theme="theme"
    :size="300"
    seed="${seed}"
  />
</template>`
    },
  },
  {
    id: 'svelte',
    label: 'Svelte',
    description: 'Lightweight bindings with actions + stores.',
    language: 'svelte',
    filePath: 'src/components/Avatar.svelte',
    logo: { src: svelteLogo.src, alt: 'Svelte logo' },
    themeId: 'nevmstas',
    getSnippet: (seed: string) => {
      const scriptTag = '<script lang="ts">'
      const scriptClose = '</' + 'script>'
      return `${scriptTag}
  import { Avatar } from '@avatune/svelte'
  import theme from '@avatune/nevmstas-theme/svelte'
${scriptClose}

<Avatar
  theme={theme}
  size={300}
  seed="${seed}"
/>`
    },
  },
  {
    id: 'react-native',
    label: 'React Native',
    description: 'Native component for iOS and Android apps.',
    language: 'tsx',
    filePath: 'app/Avatar.tsx',
    themeId: 'kyute',
    logo: { src: reactNativeLogo.src, alt: 'React Native logo' },
    getSnippet: (
      seed: string,
    ) => `import { Avatar } from '@avatune/react-native'
import theme from '@avatune/kyute-theme/react-native'

export function AvatarPreview() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="${seed}"
    />
  )
}
`,
  },
  {
    id: 'vanilla',
    label: 'Vanilla JS',
    description: 'Framework-agnostic utilities and CSS tokens.',
    language: 'ts',
    filePath: 'src/components/avatar.ts',
    themeId: 'micah',
    logo: { src: jsLogo.src, alt: 'JavaScript logo' },
    getSnippet: (seed: string) => `import { avatar } from '@avatune/vanilla'
import theme from '@avatune/micah-theme/vanilla'

const container = document.getElementById('avatar-container')
const svg = avatar({
  theme,
  size: 300,
  seed: '${seed}',
})

container?.appendChild(svg)`,
  },
] as const

export async function getFrameworkShowcaseEntries() {
  const entries = await Promise.all(
    frameworkDefinitions.map(async (definition) => {
      const snippet = definition.getSnippet(definition.id)
      const highlightedSnippet = await codeToHtml(snippet, {
        lang: definition.language,
        theme: 'github-dark',
      })

      return {
        id: definition.id,
        label: definition.label,
        description: definition.description,
        filePath: definition.filePath,
        language: definition.language,
        themeId: definition.themeId,
        snippet,
        highlightedSnippet,
        logo: definition.logo,
      } satisfies FrameworkShowcaseEntry
    }),
  )

  return entries
}
