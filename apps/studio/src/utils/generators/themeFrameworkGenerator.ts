import { capitalizeFirst, toCamelCase, toPascalCase } from '../caseUtils'
import type { AssetFile } from '../types'

type ThemeFramework =
  | 'react'
  | 'vue'
  | 'svelte'
  | 'vanilla'
  | 'react-native'
  | 'solidjs'
  | 'angular'

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
  const isAngular = framework === 'angular'
  const assetImportSuffix =
    framework === 'solidjs' ? 'solid' : isVanilla ? '' : framework
  const importPath = isVanilla
    ? `@avatune/${assetsPackageName}`
    : `@avatune/${assetsPackageName}/${assetImportSuffix}`

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
    solidjs: 'SolidJsAvatarItem, SolidJsTheme',
    angular: 'AngularAvatarItem, AngularTheme',
  }[framework]

  const methodName = isVanilla ? 'code' : 'Component'

  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    const items: string[] = []
    for (const asset of categoryAssets) {
      const componentName = isVanilla
        ? `${toCamelCase(category)}${toPascalCase(asset.name)}`
        : `${capitalizeFirst(category)}${toPascalCase(asset.name)}`
      const assetName = toCamelCase(asset.name)
      const itemValue = isAngular
        ? `toAngularItem(${componentName})`
        : `{ ${methodName}: ${componentName} }`
      items.push(`    ${assetName}: ${itemValue},`)
    }
    componentMaps.push(
      `  .withComponents('${category}', {\n${items.join('\n')}\n  })`,
    )
  }

  const angularHelper = isAngular
    ? `
const toAngularItem = (asset: {
  template: string | ((color: string, uid: string) => string)
}) => ({
  template: asset.template,
  Component: null,
})
`
    : ''

  return `${importStatement}
import type { ${typeMap} } from '@avatune/types'
import shared from './shared'
${angularHelper}
export default shared
  .toFramework<${typeMap.split(',')[0]}>()
${componentMaps.join('\n')}
  .build() satisfies ${typeMap.split(',')[1]}
`
}
