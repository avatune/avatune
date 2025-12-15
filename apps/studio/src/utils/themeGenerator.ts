import JSZip from 'jszip'
import type { ThemeData } from '../types'
import { toKebabCase } from './caseUtils'
import {
  generateAssetFrameworkFile,
  generateThemeFile,
  generateThemeFrameworkFile,
} from './generators'
import {
  generateAssetsChangelog,
  generateAssetsGlobalDts,
  generateAssetsPackageJson,
  generateAssetsReadme,
  generateAssetsRslibConfig,
  generateAssetsRslibNativeConfig,
  generateAssetsRslibShared,
  generateAssetsTsconfig,
  generateThemeChangelog,
  generateThemeColors,
  generateThemePackageJson,
  generateThemeReadme,
  generateThemeRslibConfig,
  generateThemeTsconfig,
} from './templates'
import type { AssetFile } from './types'

// Re-export for backwards compatibility
export { generateThemeFile } from './generators'

/**
 * Generates a ZIP file containing the complete theme and assets packages
 */
export async function generateThemeFolder(
  themeName: string,
  themeCode: string,
  themeData: ThemeData,
): Promise<void> {
  const zip = new JSZip()
  const assetsPackageName = `${themeName}-assets`
  const themePackageName = `${themeName}-theme`

  // Prepare asset files
  const allAssets = themeData.headAsset
    ? [themeData.headAsset, ...themeData.assets]
    : themeData.assets

  const assetFiles: AssetFile[] = allAssets.map((asset) => ({
    category: asset.category,
    name: asset.name,
    fileName: `${toKebabCase(asset.name)}.svg`,
    asset,
  }))

  // Sort assets by category, then by name
  assetFiles.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  // Group assets by category for SVG folder organization
  const assetsByCategory = new Map<string, AssetFile[]>()
  for (const assetFile of assetFiles) {
    if (!assetsByCategory.has(assetFile.category)) {
      assetsByCategory.set(assetFile.category, [])
    }
    assetsByCategory.get(assetFile.category)!.push(assetFile)
  }

  // ============================================================================
  // ASSETS PACKAGE
  // ============================================================================
  const assetsFolder = zip.folder(assetsPackageName)
  const assetsSrcFolder = assetsFolder?.folder('src')
  const assetsSvgFolder = assetsSrcFolder?.folder('svg')

  // Add SVG files organized by category
  for (const [category, categoryAssets] of assetsByCategory.entries()) {
    const categoryFolder = assetsSvgFolder?.folder(category)
    for (const assetFile of categoryAssets) {
      const response = await fetch(assetFile.asset.dataUrl)
      const blob = await response.blob()
      categoryFolder?.file(assetFile.fileName, blob)
    }
  }

  // Generate framework entrypoints
  const assetFrameworks = [
    'react',
    'vue',
    'svelte',
    'svg',
    'react-native',
  ] as const
  for (const framework of assetFrameworks) {
    const content = generateAssetFrameworkFile(assetFiles, framework)
    assetsSrcFolder?.file(`${framework}.ts`, content)
  }

  // Add assets package configuration files
  assetsFolder?.file(
    'package.json',
    generateAssetsPackageJson(assetsPackageName),
  )
  assetsFolder?.file('tsconfig.json', generateAssetsTsconfig())
  assetsFolder?.file('rslib.config.ts', generateAssetsRslibConfig())
  assetsFolder?.file('rslib.shared.ts', generateAssetsRslibShared())
  assetsFolder?.file(
    'rslib.native.config.ts',
    generateAssetsRslibNativeConfig(),
  )
  assetsSrcFolder?.file('global.d.ts', generateAssetsGlobalDts())
  assetsFolder?.file(
    'README.md',
    generateAssetsReadme(themeName, assetsPackageName),
  )

  // ============================================================================
  // THEME PACKAGE
  // ============================================================================
  const themeFolder = zip.folder(themePackageName)
  const themeSrcFolder = themeFolder?.folder('src')

  // Add shared.ts and colors.ts
  themeSrcFolder?.file('shared.ts', themeCode)
  themeSrcFolder?.file('colors.ts', generateThemeColors())

  // Generate framework-specific theme files
  const themeFrameworks = [
    'react',
    'vue',
    'svelte',
    'vanilla',
    'react-native',
  ] as const
  for (const framework of themeFrameworks) {
    const content = generateThemeFrameworkFile(
      assetFiles,
      framework,
      assetsPackageName,
    )
    themeSrcFolder?.file(`${framework}.ts`, content)
  }

  // Add theme package configuration files
  themeFolder?.file(
    'package.json',
    generateThemePackageJson(themePackageName, assetsPackageName),
  )
  themeFolder?.file('tsconfig.json', generateThemeTsconfig(assetsPackageName))
  themeFolder?.file('rslib.config.ts', generateThemeRslibConfig())
  themeFolder?.file(
    'README.md',
    generateThemeReadme(themeName, themePackageName, assetsPackageName),
  )

  // ============================================================================
  // GENERATE AND DOWNLOAD ZIP
  // ============================================================================
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${themeName}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
