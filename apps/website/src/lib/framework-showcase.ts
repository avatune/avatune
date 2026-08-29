import type { StaticImageData } from 'next/image'
import { getSingletonHighlighter } from 'shiki/bundle/full'
import angularLogo from '../assets/angular-logo.svg'
import jsLogo from '../assets/javascript-logo.svg'
import reactLogo from '../assets/react-logo.svg'
import reactNativeLogo from '../assets/react-native.svg'
import solidjsLogo from '../assets/solidjs-logo.svg'
import svelteLogo from '../assets/svelte-logo.svg'
import swiftLogo from '../assets/swift-logo.svg'
import vueLogo from '../assets/vue-logo.svg'

export type FrameworkThemeId =
  | 'yanliu'
  | 'miniavs'
  | 'nevmstas'
  | 'micah'
  | 'kyute'
  | 'pacovqzz'
  | 'fatinVerse'

export interface FrameworkSpec {
  label: string
  value: string
  note?: string
}

export interface FrameworkInstall {
  label: string
  command: string
}

export interface FrameworkShowcaseEntry {
  id: string
  label: string
  tagline: string
  description: string
  filePath: string
  language: string
  themeId: FrameworkThemeId
  install: FrameworkInstall
  specs: FrameworkSpec[]
  snippet: string
  highlightedSnippet: string
  logo?: {
    src: StaticImageData
    alt: string
  }
}

interface FrameworkDefinition {
  id: string
  label: string
  tagline: string
  description: string
  language: string
  filePath: string
  themeId: FrameworkThemeId
  install: FrameworkInstall
  specs: FrameworkSpec[]
  logo?: {
    src: StaticImageData
    alt: string
  }
  getSnippet: (seed: string) => string
}

function npmPackage(
  pkg: string,
  { size, deps, since }: { size: string; deps: string; since: string },
): Pick<FrameworkDefinition, 'install' | 'specs'> {
  return {
    install: { label: `npm i ${pkg}`, command: `npm i ${pkg}` },
    specs: [
      { label: 'package', value: pkg },
      { label: 'size', value: size, note: 'gzipped' },
      { label: 'deps', value: deps },
      { label: 'since', value: since },
    ],
  }
}

const frameworkDefinitions: FrameworkDefinition[] = [
  {
    id: 'react',
    label: 'React',
    tagline: 'First-class React, with Suspense and RSC.',
    description: 'Hooks, config helpers, and starter kit.',
    language: 'tsx',
    filePath: 'src/components/Profile.tsx',
    themeId: 'kyute',
    ...npmPackage('@avatune/react', {
      size: '8.1kb',
      deps: '0',
      since: 'v2.1',
    }),
    logo: { src: reactLogo.src, alt: 'React logo' },
    getSnippet: (seed: string) => `import { Avatar } from '@avatune/react'
import theme from '@avatune/kyute-theme/react'

export default function Profile({ user }) {
  return (
    <Avatar
      seed="${seed}"
      theme={theme}
      size={96}
    />
  )
}`,
  },
  {
    id: 'svelte',
    label: 'Svelte',
    tagline: 'Zero runtime. Compiles to inline SVG.',
    description: 'Lightweight bindings with actions + stores.',
    language: 'svelte',
    filePath: 'lib/Profile.svelte',
    themeId: 'nevmstas',
    ...npmPackage('@avatune/svelte', {
      size: '6.4kb',
      deps: '0',
      since: 'v3.1',
    }),
    logo: { src: svelteLogo.src, alt: 'Svelte logo' },
    getSnippet: (seed: string) => {
      const scriptTag = '<script lang="ts">'
      const scriptClose = '</' + 'script>'
      return `${scriptTag}
  import { Avatar } from '@avatune/svelte'
  import theme from '@avatune/nevmstas-theme/svelte'
  export let user
${scriptClose}

<Avatar seed="${seed}" theme={theme} size={96} />`
    },
  },
  {
    id: 'vue',
    label: 'Vue',
    tagline: 'SFC-friendly with reactive props.',
    description: 'Composable API bindings with examples.',
    language: 'vue',
    filePath: 'components/Profile.vue',
    themeId: 'miniavs',
    ...npmPackage('@avatune/vue', { size: '7.2kb', deps: '0', since: 'v2.1' }),
    logo: { src: vueLogo.src, alt: 'Vue logo' },
    getSnippet: (seed: string) => {
      const scriptTag = '<script setup lang="ts">'
      const scriptClose = '</' + 'script>'
      return `${scriptTag}
import { Avatar } from '@avatune/vue'
import theme from '@avatune/miniavs-theme/vue'

defineProps<{ user: { id: string } }>()
${scriptClose}

<template>
  <Avatar seed="${seed}" :theme="theme" :size="96" />
</template>`
    },
  },
  {
    id: 'solidjs',
    label: 'SolidJS',
    tagline: 'Fine-grained reactivity, server-rendered.',
    description: 'Reactive primitives without virtual DOM.',
    language: 'tsx',
    filePath: 'src/components/Profile.tsx',
    themeId: 'yanliu',
    ...npmPackage('@avatune/solidjs', {
      size: '6.0kb',
      deps: '0',
      since: 'v1.1',
    }),
    logo: { src: solidjsLogo.src, alt: 'SolidJS logo' },
    getSnippet: (seed: string) => `import { Avatar } from '@avatune/solidjs'
import theme from '@avatune/yanliu-theme/solidjs'

export default function Profile(props) {
  return (
    <Avatar
      seed="${seed}"
      theme={theme}
      size={96}
    />
  )
}`,
  },
  {
    id: 'angular',
    label: 'Angular',
    tagline: 'Standalone component with signal inputs.',
    description: 'Angular renderer for the Avatune avatar primitive.',
    language: 'ts',
    filePath: 'src/app/profile.component.ts',
    themeId: 'pacovqzz',
    ...npmPackage('@avatune/angular', {
      size: '9.4kb',
      deps: '0',
      since: 'v1.2',
    }),
    logo: { src: angularLogo.src, alt: 'Angular logo' },
    getSnippet: (seed: string) => `import { Component } from '@angular/core'
import { Avatar } from '@avatune/angular'
import theme from '@avatune/pacovqzz-theme/angular'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Avatar],
  template: \`
    <avatune-avatar
      [theme]="theme"
      [inputSize]="96"
      seed="${seed}"
    />
  \`,
})
export class ProfileComponent {
  theme = theme
}`,
  },
  {
    id: 'react-native',
    label: 'React Native',
    tagline: 'Native component for iOS and Android.',
    description: 'Native component for iOS and Android apps.',
    language: 'tsx',
    filePath: 'app/Profile.tsx',
    themeId: 'kyute',
    ...npmPackage('@avatune/react-native', {
      size: '7.8kb',
      deps: '0',
      since: 'v2.1',
    }),
    logo: { src: reactNativeLogo.src, alt: 'React Native logo' },
    getSnippet: (
      seed: string,
    ) => `import { Avatar } from '@avatune/react-native'
import theme from '@avatune/kyute-theme/react-native'

export function Profile() {
  return (
    <Avatar
      seed="${seed}"
      theme={theme}
      size={96}
    />
  )
}`,
  },
  {
    id: 'swift',
    label: 'Swift',
    tagline: 'Native on Apple platforms, drawn with CoreGraphics.',
    description: 'SwiftUI, UIKit, and AppKit from the same themes.',
    language: 'swift',
    filePath: 'Sources/Profile/ProfileAvatar.swift',
    themeId: 'fatinVerse',
    install: {
      label: 'github.com/avatune/avatune-swift',
      command: 'https://github.com/avatune/avatune-swift',
    },
    specs: [
      { label: 'product', value: 'AvatuneFatinVerse' },
      { label: 'platforms', value: 'iOS 15+, macOS 12+' },
      { label: 'deps', value: '1', note: 'SwiftDraw' },
      { label: 'since', value: 'v0.1' },
    ],
    logo: { src: swiftLogo.src, alt: 'Swift logo' },
    getSnippet: (seed: string) => `import AvatuneFatinVerse
import AvatuneRender
import SwiftUI

struct ProfileAvatar: View {
    let user: User

    var body: some View {
        AvatarView(FatinVerseAvatar(seed: .string("${seed}")))
            .frame(width: 96, height: 96)
    }
}`,
  },
  {
    id: 'js',
    label: 'Vanilla',
    tagline: 'Just SVG strings. No framework needed.',
    description: 'Framework-agnostic utilities and CSS tokens.',
    language: 'ts',
    filePath: 'scripts/avatar.ts',
    themeId: 'micah',
    ...npmPackage('@avatune/vanilla', {
      size: '4.1kb',
      deps: '0',
      since: 'v2.1',
    }),
    logo: { src: jsLogo.src, alt: 'JavaScript logo' },
    getSnippet: (seed: string) => `import { avatar } from '@avatune/vanilla'
import theme from '@avatune/micah-theme/vanilla'

const container = document.getElementById('avatar')
const svg = avatar({
  seed: '${seed}',
  theme,
  size: 96,
})

container?.appendChild(svg)`,
  },
] as const

export async function getFrameworkShowcaseEntries(): Promise<
  FrameworkShowcaseEntry[]
> {
  const highlighter = await getSingletonHighlighter({
    themes: ['github-dark'],
    langs: [
      'tsx',
      'html',
      'ts',
      'javascript',
      'typescript',
      'vue',
      'svelte',
      'swift',
    ],
  })

  return Promise.all(
    frameworkDefinitions.map(async (definition) => {
      const snippet = definition.getSnippet('user-42')
      const lang =
        definition.language === 'svelte' || definition.language === 'vue'
          ? 'html'
          : definition.language
      const highlightedSnippet = highlighter.codeToHtml(snippet, {
        lang,
        theme: 'github-dark',
      })

      return {
        id: definition.id,
        label: definition.label,
        tagline: definition.tagline,
        description: definition.description,
        filePath: definition.filePath,
        language: definition.language,
        themeId: definition.themeId,
        install: definition.install,
        specs: definition.specs,
        snippet,
        highlightedSnippet,
        logo: definition.logo,
      } satisfies FrameworkShowcaseEntry
    }),
  )
}
