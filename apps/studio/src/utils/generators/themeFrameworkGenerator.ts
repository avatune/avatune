import { capitalizeFirst, toCamelCase, toPascalCase } from '../caseUtils'
import type { AssetFile } from '../types'

type ThemeFramework = 'react' | 'vue' | 'svelte' | 'vanilla' | 'react-native'

/**
 * Generates framework-specific theme files (e.g., react.ts, vue.ts, vanilla.ts)
 */
export function generateThemeFrameworkFile(
  assets: AssetFile[],
  framework: ThemeFramework,
  assetsPackageName: string,
): string {
  const imports: string[] = []
  const componentMaps: string[] = []

  const isVanilla = framework === 'vanilla'
  const importPath = isVanilla
    ? `@avatune/${assetsPackageName}`
    : `@avatune/${assetsPackageName}/${framework}`

  // Group assets by category
  const assetsByCategory = new Map<string, AssetFile[]>()
  for (const asset of assets) {
    if (!assetsByCategory.has(asset.category)) {
      assetsByCategory.set(asset.category, [])
    }
    const categoryAssets = assetsByCategory.get(asset.category)
    if (categoryAssets) {
      categoryAssets.push(asset)
    }
  }

  // Generate imports
  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    for (const asset of categoryAssets) {
      const componentName = isVanilla
        ? `${toCamelCase(category)}${toPascalCase(asset.name)}`
        : `${capitalizeFirst(category)}${toPascalCase(asset.name)}`

      imports.push(`  ${componentName},`)
    }
  }

  const importStatement = `import {\n${imports.join('\n')}\n} from '${importPath}'`

  // Generate component maps
  const typeMap = {
    react: 'ReactAvatarItem, ReactTheme',
    vue: 'VueAvatarItem, VueTheme',
    svelte: 'SvelteAvatarItem, SvelteTheme',
    vanilla: 'VanillaAvatarItem, VanillaTheme',
    'react-native': 'ReactNativeAvatarItem, ReactNativeTheme',
  }[framework]

  const methodName = isVanilla ? 'code' : 'Component'

  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    const items: string[] = []
    for (const asset of categoryAssets) {
      const componentName = isVanilla
        ? `${toCamelCase(category)}${toPascalCase(asset.name)}`
        : `${capitalizeFirst(category)}${toPascalCase(asset.name)}`
      const assetName = toCamelCase(asset.name)
      items.push(`    ${assetName}: { ${methodName}: ${componentName} },`)
    }
    componentMaps.push(
      `  .withComponents('${category}', {\n${items.join('\n')}\n  })`,
    )
  }

  return `${importStatement}
import type { ${typeMap} } from '@avatune/types'
import shared from './shared'

export default shared
  .toFramework<${typeMap.split(',')[0]}>()
${componentMaps.join('\n')}
  .build() satisfies ${typeMap.split(',')[1]}
`
}
