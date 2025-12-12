import { capitalizeFirst, toCamelCase, toPascalCase } from '../caseUtils'
import type { AssetFile } from '../types'

type AssetFramework = 'react' | 'vue' | 'svelte' | 'svg' | 'react-native'

/**
 * Generates framework-specific asset export files (e.g., react.ts, vue.ts)
 */
export function generateAssetFrameworkFile(
  assets: AssetFile[],
  framework: AssetFramework,
): string {
  const imports: string[] = []
  const exports: string[] = []
  let currentCategory = ''

  const queryParam = {
    react: '?react',
    vue: '?vue',
    svelte: '?svelte',
    svg: '?raw',
    'react-native': '?native',
  }[framework]

  const isSvg = framework === 'svg'

  for (const assetFile of assets) {
    if (assetFile.category !== currentCategory) {
      if (currentCategory !== '') {
        imports.push('')
        exports.push('')
      }
      const categoryComment = `// ${capitalizeFirst(assetFile.category)}`
      imports.push(categoryComment)
      exports.push(categoryComment)
      currentCategory = assetFile.category
    }

    const componentName = isSvg
      ? `${toCamelCase(assetFile.category)}${toPascalCase(assetFile.name)}`
      : `${capitalizeFirst(assetFile.category)}${toPascalCase(assetFile.name)}`

    const importPath = `./svg/${assetFile.category}/${assetFile.fileName}${queryParam}`
    imports.push(`import ${componentName} from '${importPath}'`)
    exports.push(`  ${componentName},`)
  }

  return `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n}\n`
}
