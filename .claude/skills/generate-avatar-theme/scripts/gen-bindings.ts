#!/usr/bin/env bun
/**
 * Generate the 7 framework binding files for a theme package from its
 * assets package's SVG directory structure.
 *
 * Usage: bun gen-bindings.ts <name>
 * Example: bun gen-bindings.ts anime-samurai
 *   reads  packages/assets/<name>-assets/src/svg/<category>/<item>.svg
 *   writes packages/themes/<name>-theme/src/{vanilla,react,vue,svelte,solidjs,react-native,angular}.ts
 *
 * Run `bunx biome check --write` on the theme src afterwards.
 * Note: shared.ts/colors.ts are NOT generated — write those by hand.
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const name = process.argv[2]
if (!name) {
  console.error('Usage: bun gen-bindings.ts <name>  (e.g. "cyberpunk")')
  process.exit(1)
}

const svgDir = join(process.cwd(), 'packages', 'assets', `${name}-assets`, 'src', 'svg')
const outDir = join(process.cwd(), 'packages', 'themes', `${name}-theme`, 'src')
if (!existsSync(svgDir) || !existsSync(outDir)) {
  console.error(`Missing ${svgDir} or ${outDir}`)
  process.exit(1)
}

const items: Record<string, string[]> = {}
for (const category of readdirSync(svgDir).sort()) {
  const files = readdirSync(join(svgDir, category)).filter((f) => f.endsWith('.svg'))
  if (files.length) items[category] = files.map((f) => basename(f, '.svg')).sort()
}

const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const importName = (category: string, item: string, camel: boolean) => {
  const n = `${pascal(category)}${pascal(item)}`
  return camel ? n.charAt(0).toLowerCase() + n.slice(1) : n
}

interface Framework {
  file: string
  subpath: string
  itemType: string
  themeType: string | null
  camel: boolean
  angular?: boolean
}

const frameworks: Framework[] = [
  { file: 'vanilla', subpath: '', itemType: 'VanillaAvatarItem', themeType: 'VanillaTheme', camel: true },
  { file: 'react', subpath: '/react', itemType: 'ReactAvatarItem', themeType: 'ReactTheme', camel: false },
  { file: 'vue', subpath: '/vue', itemType: 'VueAvatarItem', themeType: 'VueTheme', camel: false },
  { file: 'svelte', subpath: '/svelte', itemType: 'SvelteAvatarItem', themeType: 'SvelteTheme', camel: false },
  { file: 'solidjs', subpath: '/solid', itemType: 'SolidJsAvatarItem', themeType: 'SolidJsTheme', camel: false },
  { file: 'react-native', subpath: '/react-native', itemType: 'ReactNativeAvatarItem', themeType: 'ReactNativeTheme', camel: false },
  { file: 'angular', subpath: '/angular', itemType: 'AngularAvatarItem', themeType: null, camel: false, angular: true },
]

for (const fw of frameworks) {
  const names: string[] = []
  for (const [category, list] of Object.entries(items)) {
    for (const item of list) names.push(importName(category, item, fw.camel))
  }
  names.sort((a, b) => a.localeCompare(b))

  const lines: string[] = []
  lines.push('import {')
  for (const n of names) lines.push(`  ${n},`)
  lines.push(`} from '@avatune/${name}-assets${fw.subpath}'`)
  lines.push(
    fw.themeType
      ? `import type { ${fw.itemType}, ${fw.themeType} } from '@avatune/types'`
      : `import type { ${fw.itemType} } from '@avatune/types'`,
  )
  lines.push("import shared from './shared'")
  lines.push('')

  if (fw.angular) {
    lines.push('const toAngularItem = (asset: {')
    lines.push('  template: string | ((color: string, uid: string) => string)')
    lines.push('}) => ({')
    lines.push('  template: asset.template,')
    lines.push('  Component: null,')
    lines.push('})')
    lines.push('')
  }

  lines.push('export default shared')
  lines.push(`  .toFramework<${fw.itemType}>()`)
  for (const [category, list] of Object.entries(items)) {
    lines.push(`  .withComponents('${category}', {`)
    for (const item of list) {
      const ref = importName(category, item, fw.camel)
      if (fw.angular) lines.push(`    ${item}: toAngularItem(${ref}),`)
      else if (fw.file === 'vanilla') lines.push(`    ${item}: { code: ${ref} },`)
      else lines.push(`    ${item}: { Component: ${ref} },`)
    }
    lines.push('  })')
  }
  lines.push(fw.themeType ? `  .build() satisfies ${fw.themeType}` : '  .build()')
  lines.push('')

  writeFileSync(join(outDir, `${fw.file}.ts`), lines.join('\n'))
  console.log(`wrote ${join(outDir, `${fw.file}.ts`)}`)
}
