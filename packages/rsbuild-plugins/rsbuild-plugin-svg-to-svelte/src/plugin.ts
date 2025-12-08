// plugin.ts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import type { Config as SvgoConfig } from 'svgo'
// @ts-expect-error - loader.mjs exports transformSvgToSvelteSource
import { transformSvgToSvelteSource } from './loader.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export type EmitSvelteFilesOptions = {
  /** Source directory containing SVG files organized in category folders */
  svgDir: string
  /** Output directory for .svelte files (default: 'dist/svelte') */
  outDir?: string
}

export type PluginOptions = {
  svgoConfig?: SvgoConfig
  svgo?: boolean
  query?: RegExp
  mixedImport?: boolean
  exclude?: Rspack.RuleSetCondition
  debug?: boolean
  imports?: string
  replaceAttrValues?: Record<string, string>
  /** Emit raw .svelte files for SSR compatibility */
  emitSvelteFiles?: EmitSvelteFilesOptions
}

const SVG_REGEX = /\.svg$/

function toPascalCase(str: string): string {
  return str
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getDefaultSvgoConfig = (): SvgoConfig =>
  ({
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: {} },
      },
    ],
  }) as SvgoConfig

export const PLUGIN_NAME = 'avatune:svg-to-svelte'

export const pluginSvgToSvelte = (
  options: PluginOptions = {},
): RsbuildPlugin => ({
  name: PLUGIN_NAME,
  pre: ['rsbuild:svgr'],
  setup(api) {
    api.modifyBundlerChain((chain, { CHAIN_ID, environment }) => {
      const debug = !!options.debug
      const { config } = environment
      const { dataUriLimit } = config.output
      const maxSize =
        typeof dataUriLimit === 'number' ? dataUriLimit : dataUriLimit.svg

      // --- Safely retrieve existing generator options if present ---
      let generatorOptions: Rspack.GeneratorOptionsByModuleType['asset/resource'] =
        {}
      try {
        if (chain.module.rules.has(CHAIN_ID.RULE.SVG)) {
          const existingRule = chain.module.rules.get(CHAIN_ID.RULE.SVG)
          if (existingRule?.oneOfs) {
            const svgUrlOneOfId = CHAIN_ID.ONE_OF?.SVG_URL
            if (svgUrlOneOfId && existingRule.oneOfs.has(svgUrlOneOfId)) {
              const urlOneOf = existingRule.oneOfs.get(svgUrlOneOfId)
              // urlOneOf may be undefined or not have 'get'
              if (urlOneOf && typeof urlOneOf.get === 'function') {
                const gen = urlOneOf.get('generator')
                if (gen) generatorOptions = gen
              }
            } else {
              // fallback: try to find any oneOf that looks like SVG_URL by name
              for (const [_, v] of Object.entries(existingRule.oneOfs)) {
                try {
                  const maybeGen = v.get?.('generator')
                  if (maybeGen) {
                    generatorOptions = maybeGen
                    break
                  }
                } catch {
                  // ignore
                }
              }
            }
          }
        }
      } catch (e) {
        if (debug)
          console.warn(
            `[${PLUGIN_NAME}] failed to read existing svg generator options:`,
            e,
          )
        generatorOptions = {}
      }

      // --- Force exclude ?svelte from builtin rule if it exists (defensive) ---
      try {
        if (chain.module.rules.has(CHAIN_ID.RULE.SVG)) {
          const builtin = chain.module.rules.get(CHAIN_ID.RULE.SVG)
          if (builtin?.exclude && typeof builtin.exclude.add === 'function') {
            builtin.exclude.add(/\?svelte$/)
            if (debug)
              console.log(
                `[${PLUGIN_NAME}] added exclude ?svelte to builtin svg rule`,
              )
          }
        }
      } catch (e) {
        if (debug)
          console.warn(
            `[${PLUGIN_NAME}] could not add exclude to builtin svg rule:`,
            e,
          )
      }

      // --- Create controlled svg rule set ---
      const rule = chain.module.rule(CHAIN_ID.RULE.SVG).test(SVG_REGEX)

      // User-provided svgoConfig replaces defaults entirely (no merge)
      const merged = {
        svgo: options.svgo ?? true,
        svgoConfig: options.svgoConfig || getDefaultSvgoConfig(),
      }

      const svelteQuery = /(^|\?)svelte($|&)/

      const replaceAttrValues = options.replaceAttrValues
        ? Object.entries(options.replaceAttrValues).reduce(
            (acc, [key, value]) => {
              acc[key] = value
              acc[key.toLowerCase()] = value
              return acc
            },
            options.replaceAttrValues,
          )
        : undefined

      // 1) svelte component rule FIRST
      try {
        rule
          .oneOf('svg-svelte')
          .before(CHAIN_ID.ONE_OF?.SVG_URL)
          .type('javascript/auto')
          .resourceQuery(svelteQuery)
          .use('svelte-svg-loader')
          .loader(path.resolve(__dirname, './loader.mjs'))
          .options({
            svgo: merged.svgo,
            svgoConfig: merged.svgoConfig,
            imports: options.imports,
            replaceAttrValues,
          })
          .end()
      } catch (e) {
        if (debug)
          console.warn(`[${PLUGIN_NAME}] failed to add svg-svelte oneOf:`, e)
      }

      // 2) asset/url
      try {
        rule
          .oneOf('svg-url')
          .type('asset/resource')
          .resourceQuery(/(__inline=false|url)/)
          .set('generator', generatorOptions)
      } catch (e) {
        if (debug)
          console.warn(`[${PLUGIN_NAME}] failed to add svg-url oneOf:`, e)
      }

      // 3) inline
      try {
        rule
          .oneOf('svg-inline')
          .type('asset/inline')
          .resourceQuery(/inline/)
      } catch (e) {
        if (debug)
          console.warn(`[${PLUGIN_NAME}] failed to add svg-inline oneOf:`, e)
      }

      // 4) raw
      try {
        rule.oneOf('svg-raw').type('asset/source').resourceQuery(/raw/)
      } catch (e) {
        if (debug)
          console.warn(`[${PLUGIN_NAME}] failed to add svg-raw oneOf:`, e)
      }

      // 5) mixedImport (optional)
      if (options.mixedImport) {
        try {
          const issuerInclude = [
            /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
            /\.mdx$/,
          ]
          const issuer = options.exclude
            ? { and: [issuerInclude, { not: options.exclude }] }
            : issuerInclude

          const svgRule = rule.oneOf('svg-default')

          if (
            options.exclude &&
            svgRule &&
            svgRule.exclude &&
            typeof svgRule.exclude.add === 'function'
          ) {
            svgRule.exclude.add(options.exclude)
          }

          svgRule
            .type('javascript/auto')
            .set('issuer', issuer)
            .use('svelte-svg-loader')
            .loader(path.resolve(__dirname, './loader.mjs'))
            .options({
              svgo: merged.svgo,
              svgoConfig: merged.svgoConfig,
              imports: options.imports,
              replaceAttrValues,
            })
            .end()
        } catch (e) {
          if (debug)
            console.warn(
              `[${PLUGIN_NAME}] failed to add mixedImport svg rule:`,
              e,
            )
        }
      }

      // 6) fallback asset
      try {
        rule
          .oneOf('svg-asset')
          .type('asset')
          .parser({
            dataUrlCondition: { maxSize },
          })
          .set('generator', generatorOptions)
      } catch (e) {
        if (debug)
          console.warn(`[${PLUGIN_NAME}] failed to add svg-asset oneOf:`, e)
      }

      if (debug) console.log(`[${PLUGIN_NAME}] svg rules configured`)
    })

    // Emit raw .svelte files for SSR compatibility
    if (options.emitSvelteFiles) {
      api.onAfterBuild(async () => {
        const { svgDir = 'svg', outDir = 'dist/svelte' } =
          options.emitSvelteFiles ?? {}
        const debug = !!options.debug

        if (!fs.existsSync(svgDir)) {
          console.warn(`[${PLUGIN_NAME}] svgDir not found: ${svgDir}`)
          return
        }

        const svgoConfig = options.svgoConfig || getDefaultSvgoConfig()
        const replaceAttrValues = options.replaceAttrValues
          ? Object.entries(options.replaceAttrValues).reduce(
              (acc, [key, value]) => {
                acc[key] = value
                acc[key.toLowerCase()] = value
                return acc
              },
              options.replaceAttrValues,
            )
          : undefined

        const transformOptions = {
          svgo: options.svgo ?? true,
          svgoConfig,
          imports: options.imports,
          replaceAttrValues,
        }

        // Ensure output directory exists
        fs.mkdirSync(outDir, { recursive: true })

        // Parse src/svelte.ts to get the correct export names
        // This handles cases where manual naming differs from auto-generated names
        const svelteSourcePath = path.join(path.dirname(svgDir), 'svelte.ts')
        const exportNameMap = new Map<string, string>() // svgPath -> exportName

        if (fs.existsSync(svelteSourcePath)) {
          const sourceContent = fs.readFileSync(svelteSourcePath, 'utf-8')
          // Match: import ComponentName from './svg/category/file.svg?svelte'
          const importRegex =
            /import\s+(\w+)\s+from\s+['"]\.\/svg\/([^'"]+)\.svg\?svelte['"]/g
          let match = importRegex.exec(sourceContent)
          while (match !== null) {
            const exportName = match[1]
            const relativePath = match[2]
            if (exportName && relativePath) {
              exportNameMap.set(relativePath, exportName)
            }

            match = importRegex.exec(sourceContent)
          }
        }

        // Find all SVG files organized by category
        const categories = fs.readdirSync(svgDir).filter((item) => {
          const itemPath = path.join(svgDir, item)
          return fs.statSync(itemPath).isDirectory()
        })

        const exports: string[] = []

        for (const category of categories) {
          const categoryPath = path.join(svgDir, category)
          const files = fs
            .readdirSync(categoryPath)
            .filter((f) => f.endsWith('.svg'))

          for (const file of files) {
            const svgPath = path.join(categoryPath, file)
            const svgContent = fs.readFileSync(svgPath, 'utf-8')
            const baseName = file.replace(/\.svg$/, '')
            const relativePath = `${category}/${baseName}`

            // Use name from source file if available, otherwise generate from path
            const componentName =
              exportNameMap.get(relativePath) ||
              `${capitalizeFirst(category)}${toPascalCase(baseName)}`
            const svelteFileName = `${componentName}.svelte`

            // Transform SVG to Svelte source
            const { svelteSource } = transformSvgToSvelteSource(
              svgContent,
              transformOptions,
              svgPath,
            )

            // Write .svelte file
            const outPath = path.join(outDir, svelteFileName)
            fs.writeFileSync(outPath, svelteSource, 'utf-8')

            exports.push(
              `export { default as ${componentName} } from './${svelteFileName}'`,
            )

            if (debug) {
              console.log(`[${PLUGIN_NAME}] emitted ${svelteFileName}`)
            }
          }
        }

        // Write index.js that re-exports all components
        const indexContent = `${exports.join('\n')}\n`
        fs.writeFileSync(path.join(outDir, 'index.js'), indexContent, 'utf-8')

        if (debug) {
          console.log(
            `[${PLUGIN_NAME}] emitted ${exports.length} .svelte files to ${outDir}`,
          )
        }
      })
    }
  },
})
