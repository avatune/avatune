// plugin.ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RsbuildPlugin, Rspack } from '@rsbuild/core'
import deepmerge from 'deepmerge'
import type { Config as SvgoConfig } from 'svgo'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export type PluginOptions = {
  svgoConfig?: SvgoConfig
  svgo?: boolean
  query?: RegExp
  mixedImport?: boolean
  exclude?: Rspack.RuleSetCondition
  debug?: boolean
}

const SVG_REGEX = /\.svg$/

const getDefaultSvgoConfig = (): SvgoConfig => ({
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { removeViewBox: false } },
    } as any,
    'prefixIds' as any,
  ],
})

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

      const svgoDefaults = { svgo: true, svgoConfig: getDefaultSvgoConfig() }
      const merged = deepmerge(svgoDefaults, {
        svgo: options.svgo,
        svgoConfig: options.svgoConfig || {},
      })

      const svelteQuery = /(^|\?)svelte($|&)/

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
  },
})
