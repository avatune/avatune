import angularLogo from '../assets/angular-logo.svg'
import jsLogo from '../assets/javascript-logo.svg'
import reactLogo from '../assets/react-logo.svg'
import reactNativeLogo from '../assets/react-native.svg'
import solidjsLogo from '../assets/solidjs-logo.svg'
import svelteLogo from '../assets/svelte-logo.svg'
import vueLogo from '../assets/vue-logo.svg'

export type ThemeId =
  | 'kyute'
  | 'micah'
  | 'miniavs'
  | 'nevmstas'
  | 'pacovqzz'
  | 'yanliu'
  | 'fatinVerse'
  | 'ashleySeo'
  | 'pawelOlekMan'
  | 'pawelOlekWoman'

export interface ThemeInfo {
  id: ThemeId
  label: string
  packageName: string
}

export interface ThemeCategory {
  id: string
  label: string
  items: string[]
  optional: boolean
}

export interface FrameworkDefinition {
  id: string
  label: string
  language: string
  filePath: string
  logo?: {
    src: string
    alt: string
  }
}

export const themeInfos: ThemeInfo[] = [
  { id: 'kyute', label: 'Kyute', packageName: '@avatune/kyute-theme' },
  { id: 'micah', label: 'Micah', packageName: '@avatune/micah-theme' },
  { id: 'miniavs', label: 'Miniavs', packageName: '@avatune/miniavs-theme' },
  { id: 'pacovqzz', label: 'Pacovqzz', packageName: '@avatune/pacovqzz-theme' },
  { id: 'yanliu', label: 'Yanliu', packageName: '@avatune/yanliu-theme' },
  { id: 'nevmstas', label: 'Nevmstas', packageName: '@avatune/nevmstas-theme' },
  {
    id: 'fatinVerse',
    label: 'Fatin Verse',
    packageName: '@avatune/fatin-verse-theme',
  },
  {
    id: 'ashleySeo',
    label: 'Ashley Seo',
    packageName: '@avatune/ashley-seo-theme',
  },
  {
    id: 'pawelOlekMan',
    label: 'Pawel Olek Man',
    packageName: '@avatune/pawel-olek-man-theme',
  },
  {
    id: 'pawelOlekWoman',
    label: 'Pawel Olek Woman',
    packageName: '@avatune/pawel-olek-woman-theme',
  },
]

export const frameworks: FrameworkDefinition[] = [
  {
    id: 'react',
    label: 'React',
    language: 'tsx',
    filePath: 'src/components/Avatar.tsx',
    logo: { src: reactLogo.src, alt: 'React logo' },
  },
  {
    id: 'angular',
    label: 'Angular',
    language: 'ts',
    filePath: 'src/app/avatar.component.ts',
    logo: { src: angularLogo.src, alt: 'Angular logo' },
  },
  {
    id: 'vue',
    label: 'Vue',
    language: 'vue',
    filePath: 'src/components/Avatar.vue',
    logo: { src: vueLogo.src, alt: 'Vue logo' },
  },
  {
    id: 'svelte',
    label: 'Svelte',
    language: 'svelte',
    filePath: 'src/components/Avatar.svelte',
    logo: { src: svelteLogo.src, alt: 'Svelte logo' },
  },
  {
    id: 'react-native',
    label: 'React Native',
    language: 'tsx',
    filePath: 'app/Avatar.tsx',
    logo: { src: reactNativeLogo.src, alt: 'React Native logo' },
  },
  {
    id: 'solidjs',
    label: 'SolidJS',
    language: 'ts',
    filePath: 'src/components/Avatar.tsx',
    logo: { src: solidjsLogo.src, alt: 'SolidJS logo' },
  },
  {
    id: 'js',
    label: 'Vanilla JS',
    language: 'ts',
    filePath: 'src/components/avatar.ts',
    logo: { src: jsLogo.src, alt: 'JavaScript logo' },
  },
]

const THEME_META_KEYS = new Set([
  'style',
  'colorPalettes',
  'predictorMappings',
  'connectedColors',
])

const CATEGORY_LABELS: Record<string, string> = {
  hair: 'Hair',
  eyes: 'Eyes',
  eyebrows: 'Eyebrows',
  mouth: 'Mouth',
  body: 'Body',
  head: 'Head',
  ears: 'Ears',
  nose: 'Nose',
  glasses: 'Glasses',
  faceHair: 'Facial',
  faceDetails: 'Details',
  accessories: 'Extras',
  forelock: 'Forelock',
  hats: 'Hats',
}

export function extractCategories(
  theme: Record<string, unknown>,
): ThemeCategory[] {
  const categories: ThemeCategory[] = []

  for (const key of Object.keys(theme)) {
    if (THEME_META_KEYS.has(key)) continue

    const categoryData = theme[key]
    if (typeof categoryData !== 'object' || categoryData === null) continue

    const items = Object.keys(categoryData).filter((item) => item !== 'none')
    const hasNone = 'none' in categoryData

    if (items.length === 0) continue

    categories.push({
      id: key,
      label: CATEGORY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
      items,
      optional: hasNone,
    })
  }

  // Sort categories: required first, then optional
  return categories.sort((a, b) => {
    if (a.optional !== b.optional) return a.optional ? 1 : -1
    return 0
  })
}

export function generateSnippet(
  frameworkId: string,
  themeInfo: ThemeInfo,
  selections: Record<string, string>,
  seed: string = 'my-avatar',
): string {
  const frameworkSuffix =
    frameworkId === 'js'
      ? 'vanilla'
      : frameworkId === 'react-native'
        ? 'react-native'
        : frameworkId
  const themeImportPath = `${themeInfo.packageName}/${frameworkSuffix}`

  const filteredSelections = Object.entries(selections).filter(
    ([_, value]) => value && value !== 'none',
  )
  const hasSelections = filteredSelections.length > 0

  switch (frameworkId) {
    case 'react': {
      const propsLines = filteredSelections
        .map(([k, v]) => `      ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `import { Avatar } from '@avatune/react'
import theme from '${themeImportPath}'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="${seed}"${propsStr}
    />
  )
}`
    }

    case 'vue': {
      const scriptTag = '<script setup lang="ts">'
      const scriptClose = '</' + 'script>'
      const propsLines = filteredSelections
        .map(([k, v]) => `    ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `${scriptTag}
import { Avatar } from '@avatune/vue'
import theme from '${themeImportPath}'
${scriptClose}

<template>
  <Avatar
    :theme="theme"
    :size="300"
    seed="my-avatar"${propsStr}
  />
</template>`
    }

    case 'svelte': {
      const scriptTag = '<script lang="ts">'
      const scriptClose = '</' + 'script>'
      const propsLines = filteredSelections
        .map(([k, v]) => `  ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `${scriptTag}
  import { Avatar } from '@avatune/svelte'
  import theme from '${themeImportPath}'
${scriptClose}

<Avatar
  theme={theme}
  size={300}
  seed="my-avatar"${propsStr}
/>`
    }

    case 'react-native': {
      const propsLines = filteredSelections
        .map(([k, v]) => `      ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `import { Avatar } from '@avatune/react-native'
import theme from '${themeImportPath}'

export function AvatarPreview() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="${seed}"${propsStr}
    />
  )
}`
    }

    case 'angular': {
      const propsLines = filteredSelections
        .map(([k, v]) => `    ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `import { Component } from '@angular/core'
import { Avatar } from '@avatune/angular'
import theme from '${themeImportPath}'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Avatar],
  template: \`
    <avatune-avatar
      [theme]="theme"
      [inputSize]="300"
      seed="${seed}"${propsStr}
    />
  \`,
})
export class AppComponent {
  theme = theme
}`
    }

    case 'solidjs': {
      const propsLines = filteredSelections
        .map(([k, v]) => `      ${k}="${v}"`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `import { Avatar } from '@avatune/solidjs'
import theme from '${themeImportPath}'

function App() {
  return (
    <Avatar
      theme={theme}
      size={300}
      seed="${seed}"${propsStr}
    />
  )
}`
    }

    case 'js': {
      const propsLines = filteredSelections
        .map(([k, v]) => `  ${k}: '${v}',`)
        .join('\n')
      const propsStr = hasSelections ? `\n${propsLines}` : ''
      return `import { avatar } from '@avatune/vanilla'
import theme from '${themeImportPath}'

const container = document.getElementById('avatar-container')
const svg = avatar({
  theme,
  size: 300,
  seed: '${seed}',${propsStr}
})

container?.appendChild(svg)`
    }

    default:
      return ''
  }
}
