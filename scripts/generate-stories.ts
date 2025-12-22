#!/usr/bin/env bun
/**
 * Generates Storybook stories for all frameworks (React, Vue, Svelte, Vanilla)
 * from shared story configuration
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

type Framework = 'react' | 'vue' | 'svelte' | 'vanilla' | 'react-native'

// Framework-specific configurations
const FRAMEWORK_CONFIG = {
  react: {
    storyPath: 'apps/react-storybook/src/stories',
    packageJsonPath: 'apps/react-storybook/package.json',
    fileExt: 'tsx',
    avatarItemType: 'ReactAvatarItem',
    storyRenderer: 'react-vite',
  },
  vue: {
    storyPath: 'apps/vue-storybook/src/stories',
    packageJsonPath: 'apps/vue-storybook/package.json',
    fileExt: 'ts',
    avatarItemType: 'VueAvatarItem',
    storyRenderer: 'vue3-vite',
  },
  svelte: {
    storyPath: 'apps/svelte-storybook/src/stories',
    packageJsonPath: 'apps/svelte-storybook/package.json',
    fileExt: 'ts',
    avatarItemType: 'SvelteAvatarItem',
    storyRenderer: 'svelte-vite',
  },
  vanilla: {
    storyPath: 'apps/vanilla-storybook/src/stories',
    packageJsonPath: 'apps/vanilla-storybook/package.json',
    fileExt: 'ts',
    avatarItemType: 'VanillaAvatarItem',
    storyRenderer: 'html-vite',
  },
  'react-native': {
    storyPath: 'apps/RNStorybook/.rnstorybook/stories',
    packageJsonPath: 'apps/RNStorybook/package.json',
    fileExt: 'tsx',
    avatarItemType: 'ReactNativeAvatarItem',
    storyRenderer: 'react-native',
  },
} as const

// Discover available themes
function discoverThemes(): string[] {
  const packagesDir = join(process.cwd(), 'packages', 'themes')
  const packages = readdirSync(packagesDir)

  return packages
    .filter((pkg) => pkg.endsWith('-theme'))
    .map((pkg) => pkg.replace('-theme', ''))
    .filter((name) => name !== 'types')
}

// Update package.json with theme dependencies
function updatePackageJsonThemes(
  packageJsonPath: string,
  themes: string[],
): boolean {
  const fullPath = join(process.cwd(), packageJsonPath)
  const content = readFileSync(fullPath, 'utf-8')
  const packageJson = JSON.parse(content)

  const dependencies = packageJson.dependencies || {}

  // Get current theme dependencies
  const currentThemes = Object.keys(dependencies)
    .filter((dep) => dep.startsWith('@avatune/') && dep.endsWith('-theme'))
    .map((dep) => dep.replace('@avatune/', '').replace('-theme', ''))

  // Check if any themes are missing
  const missingThemes = themes.filter((theme) => !currentThemes.includes(theme))

  if (missingThemes.length === 0) {
    return false // No updates needed
  }

  // Add missing themes
  for (const theme of missingThemes) {
    dependencies[`@avatune/${theme}-theme`] = 'workspace:*'
  }

  // Sort dependencies alphabetically
  const sortedDependencies: Record<string, string> = {}
  for (const key of Object.keys(dependencies).sort()) {
    sortedDependencies[key] = dependencies[key]
  }
  packageJson.dependencies = sortedDependencies

  // Write back with proper formatting
  writeFileSync(fullPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8')

  return true
}

// Utility functions
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Shared generators
function generateThemeImports(themes: string[], framework: Framework): string {
  const sortedThemes = [...themes].sort()
  return sortedThemes
    .map((theme) => {
      const themeName = toPascalCase(theme)
      return `import ${themeName.toLowerCase()}Theme from '@avatune/${theme}-theme/${framework}'`
    })
    .join('\n')
}

function generateThemesObject(themes: string[]): string {
  const sortedThemes = [...themes].sort()
  return sortedThemes
    .map((theme) => {
      const themeName = toPascalCase(theme)
      const displayName = themeName.replace(/([A-Z])/g, ' $1').trim()
      return `  '${displayName}': ${themeName.toLowerCase()}Theme,`
    })
    .join('\n')
}

function generateSeedStoryArgTypes(): string {
  return `  argTypes: {
    theme: {
      control: { type: 'select' },
      options: Object.keys(themes),
    },
    seed: { control: { type: 'text' } },
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  },`
}

function generateGetArgTypesFunction(
  avatarItemType: string,
  includeTypeAssertion = true,
): string {
  const typeAsssertion = includeTypeAssertion
    ? `  type Args = ExtractStoryArgs<T>\n`
    : ''
  const returnType = includeTypeAssertion
    ? ` as StoryObj<Args>['argTypes']`
    : ''

  return `const getArgTypes = <T extends Theme<${avatarItemType}>>(theme: T) => {
${typeAsssertion}  const argTypes: Record<string, unknown> = {
    size: { control: { type: 'range', min: 100, max: 800, step: 50 } },
  }

  const colorPalettes = theme.colorPalettes
  for (const [category, items] of Object.entries(theme)) {
    const excludeCategories = ['style', 'predictorMappings', 'colorPalettes', 'connectedColors']
    if (excludeCategories.includes(category)) continue

    const presetColors = colorPalettes[category as keyof typeof colorPalettes]
    argTypes[\`\${category}Color\`] = { control: { type: 'color', presetColors } }
    argTypes[category] = {
      control: { type: 'select' },
      options: Object.keys(items),
    }
  }
  argTypes.backgroundColor = { control: { type: 'color', presetColors: colorPalettes.background } } as const

  return argTypes${returnType}
}`
}

function generateThemeTypes(
  themes: string[],
  typeTemplate: (themeName: string) => string,
): string {
  const sortedThemes = [...themes].sort()
  return sortedThemes
    .map((theme) => {
      const themeName = toPascalCase(theme)
      return typeTemplate(themeName)
    })
    .join('\n')
}

function generateStories(
  themes: string[],
  storyTemplate: (themeName: string, themeVar: string) => string,
): string {
  const sortedThemes = [...themes].sort()
  return sortedThemes
    .map((theme) => {
      const themeName = toPascalCase(theme)
      const themeVar = themeName.toLowerCase()
      return storyTemplate(themeName, themeVar)
    })
    .join('\n\n')
}

// Generate React story file
function generateReactStory(themes: string[]): string {
  const themeImports = generateThemeImports(themes, 'react')

  const themeTypes = generateThemeTypes(
    themes,
    (themeName) =>
      `type ${themeName}Args = ExtractStoryArgs<typeof ${themeName.toLowerCase()}Theme>`,
  )

  const stories = generateStories(
    themes,
    (
      themeName,
      themeVar,
    ) => `export const ${themeName}: StoryObj<${themeName}Args> = {
  argTypes: getArgTypes(${themeVar}Theme),
  render: (args) => <Avatar theme={${themeVar}Theme} {...args} />,
  args: {
    size: 300,
  },
}`,
  )

  const themesObject = generateThemesObject(themes)

  return `${themeImports}
import type { AvatarProps } from '@avatune/react'
import { Avatar } from '@avatune/react'
import type { ReactAvatarItem, Theme } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type ExtractStoryArgs<T extends Theme<ReactAvatarItem>> = Omit<
  AvatarProps<T>,
  'theme'
>

${themeTypes}

${generateGetArgTypesFunction('ReactAvatarItem')}

${stories}

const themes = {
${themesObject}
} as const

export const Seed: StoryObj<{
  theme: keyof typeof themes
  seed?: string | number
  size?: number
}> = {
${generateSeedStoryArgTypes()}
  render: ({ theme: themeName, seed, size = 300 }) => {
    const selectedTheme = themes[themeName]
    return <Avatar theme={selectedTheme} seed={seed} size={size} />
  },
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
`
}

// Generate Vue story file
function generateVueStory(themes: string[]): string {
  const themeImports = generateThemeImports(themes, 'vue')

  const themeTypes = generateThemeTypes(
    themes,
    (themeName) =>
      `type ${themeName}Args = Omit<AvatarProps<typeof ${themeName.toLowerCase()}Theme>, 'theme'>`,
  )

  const stories = generateStories(
    themes,
    (
      themeName,
      themeVar,
    ) => `export const ${themeName}: StoryObj<${themeName}Args> = {
  argTypes: getArgTypes(${themeVar}Theme),
  render: (args: ${themeName}Args) => ({
    components: { Avatar },
    setup: () => ({ args, theme: ${themeVar}Theme }),
    template: '<Avatar :theme="theme" v-bind="args" />',
  }),
  args: {
    size: 300,
  },
}`,
  )

  const themesObject = generateThemesObject(themes)

  return `${themeImports}
import type { Theme, VueAvatarItem } from '@avatune/types'
import type { AvatarProps } from '@avatune/vue'
import { Avatar } from '@avatune/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

${themeTypes}

${generateGetArgTypesFunction('VueAvatarItem', false)}

${stories}

const themes = {
${themesObject}
} as const

export const Seed: StoryObj<{
  theme: keyof typeof themes
  seed?: string | number
  size?: number
}> = {
${generateSeedStoryArgTypes()}
  render: ({
    theme: themeName,
    seed,
    size = 300,
  }: {
    theme: keyof typeof themes
    seed?: string | number
    size?: number
  }) => ({
    components: { Avatar },
    setup: () => ({
      theme: themes[themeName],
      seed,
      size,
    }),
    template: '<Avatar :theme="theme" :seed="seed" :size="size" />',
  }),
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
`
}

// Generate Svelte story file
function generateSvelteStory(themes: string[]): string {
  const themeImports = generateThemeImports(themes, 'svelte')

  const themeTypes = generateThemeTypes(
    themes,
    (themeName) =>
      `type ${themeName}Args = ExtractStoryArgs<typeof ${themeName.toLowerCase()}Theme>`,
  )

  const stories = generateStories(
    themes,
    (
      themeName,
      themeVar,
    ) => `export const ${themeName}: StoryObj<${themeName}Args> = {
  argTypes: getArgTypes(${themeVar}Theme),
  render: (args) => ({
    Component: Avatar,
    props: { theme: ${themeVar}Theme, ...args },
  }),
  args: {
    size: 300,
  },
}`,
  )

  const themesObject = generateThemesObject(themes)

  return `${themeImports}
import type { AvatarProps } from '@avatune/svelte'
import { Avatar } from '@avatune/svelte'
import type { SvelteAvatarItem, Theme } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/svelte-vite'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type ExtractStoryArgs<T extends Theme<SvelteAvatarItem>> = Omit<
  AvatarProps<T>,
  'theme'
>

${themeTypes}

${generateGetArgTypesFunction('SvelteAvatarItem')}

${stories}

const themes = {
${themesObject}
} as const

export const Seed: StoryObj = {
${generateSeedStoryArgTypes()}
  render: (args) => ({
    Component: Avatar,
    props: {
      theme: themes[args.theme as keyof typeof themes],
      seed: args.seed,
      size: args.size,
    },
  }),
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
`
}

// Generate React Native story file
function generateReactNativeStory(themes: string[]): string {
  const themeImports = generateThemeImports(themes, 'react-native')

  const themeTypes = generateThemeTypes(
    themes,
    (themeName) =>
      `type ${themeName}Args = ExtractStoryArgs<typeof ${themeName.toLowerCase()}Theme>`,
  )

  const stories = generateStories(
    themes,
    (
      themeName,
      themeVar,
    ) => `export const ${themeName}: StoryObj<${themeName}Args> = {
  argTypes: getArgTypes(${themeVar}Theme),
  render: (args) => <Avatar theme={${themeVar}Theme} {...args} />,
  args: {
    size: 300,
  },
}`,
  )

  const themesObject = generateThemesObject(themes)

  return `${themeImports}
import type { AvatarProps } from '@avatune/react-native'
import { Avatar } from '@avatune/react-native'
import type { ReactNativeAvatarItem, ReactNativeTheme, Theme } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/react-native'

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta

type ExtractStoryArgs<T extends ReactNativeTheme> = Omit<
  AvatarProps<T>,
  'theme'
>

${themeTypes}

${generateGetArgTypesFunction('ReactNativeAvatarItem')}

${stories}

const themes = {
${themesObject}
} as const

export const Seed: StoryObj<{
  theme: keyof typeof themes
  seed?: string | number
  size?: number
}> = {
${generateSeedStoryArgTypes()}
  render: ({ theme: themeName, seed, size = 300 }) => {
    const selectedTheme = themes[themeName]
    return <Avatar theme={selectedTheme} seed={seed} size={size} />
  },
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
`
}

// Generate Vanilla story file
function generateVanillaStory(themes: string[]): string {
  const themeImports = generateThemeImports(themes, 'vanilla')

  const themeTypes = generateThemeTypes(
    themes,
    (themeName) =>
      `type ${themeName}Args = Omit<AvatarArgs<typeof ${themeName.toLowerCase()}Theme>, 'theme'>`,
  )

  const stories = generateStories(
    themes,
    (
      themeName,
      themeVar,
    ) => `export const ${themeName}: StoryObj<${themeName}Args> = {
  argTypes: getArgTypes(${themeVar}Theme),
  render: (args: ${themeName}Args) => {
    return avatar({ theme: ${themeVar}Theme, ...args })
  },
  args: {
    size: 300,
  },
}`,
  )

  const themesObject = generateThemesObject(themes)

  return `${themeImports}
import type { Theme, VanillaAvatarItem } from '@avatune/types'
import { type AvatarArgs, avatar } from '@avatune/vanilla'
import type { Meta, StoryObj } from '@storybook/html-vite'

const meta = {
  title: 'Avatar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta

${themeTypes}

${generateGetArgTypesFunction('VanillaAvatarItem', false)}

${stories}

const themes = {
${themesObject}
} as const

export const Seed: StoryObj<{
  theme: keyof typeof themes
  seed?: string | number
  size?: number
}> = {
${generateSeedStoryArgTypes()}
  render: ({
    theme: themeName,
    seed,
    size = 300,
  }: {
    theme: keyof typeof themes
    seed?: string | number
    size?: number
  }) => {
    return avatar({
      theme: themes[themeName],
      seed,
      size,
    })
  },
  args: {
    theme: Object.keys(themes)[0] as keyof typeof themes,
    seed: 'Type any seed phrase here',
    size: 300,
  },
}
`
}

// Main execution
function main() {
  const { values } = parseArgs({
    options: {
      framework: {
        type: 'string',
        short: 'f',
      },
    },
  })

  const frameworks = values.framework
    ? [values.framework as Framework]
    : (['react', 'vue', 'svelte', 'vanilla', 'react-native'] as Framework[])

  const themes = discoverThemes()
  console.log(`Found ${themes.length} themes: ${themes.join(', ')}`)

  for (const framework of frameworks) {
    const config = FRAMEWORK_CONFIG[framework]
    if (!config) {
      console.warn(`Unsupported framework: ${framework}`)
      continue
    }

    let content: string
    switch (framework) {
      case 'react':
        content = generateReactStory(themes)
        break
      case 'vue':
        content = generateVueStory(themes)
        break
      case 'svelte':
        content = generateSvelteStory(themes)
        break
      case 'vanilla':
        content = generateVanillaStory(themes)
        break
      case 'react-native':
        content = generateReactNativeStory(themes)
        break
      default:
        console.warn(`No generator for framework: ${framework}`)
        continue
    }

    const outputPath = join(
      process.cwd(),
      config.storyPath,
      `Avatar.stories.${config.fileExt}`,
    )

    writeFileSync(outputPath, content, 'utf-8')
    console.log(`✓ Generated ${framework} story at ${outputPath}`)

    // Update package.json with theme dependencies
    const updated = updatePackageJsonThemes(config.packageJsonPath, themes)
    if (updated) {
      console.log(`✓ Updated ${framework} package.json with new themes`)
    }
  }
}

main()
