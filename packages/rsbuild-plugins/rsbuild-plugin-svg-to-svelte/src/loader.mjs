import { normalize } from 'node:path'
import { callbackify } from 'node:util'
import { compile } from 'svelte/compiler'
import { optimize as optimizeSvg } from 'svgo'

const applyReplacements = (svg, replacements = {}) => {
  let result = svg

  // Sort keys by length (longest first) to ensure more specific patterns are replaced first
  const sortedKeys = Object.keys(replacements).sort(
    (a, b) => b.length - a.length,
  )

  for (const key of sortedKeys) {
    const value = replacements[key]
    result = result.replace(
      new RegExp(key.replace(/[()]/g, '\\$&'), 'g'),
      value,
    )
  }

  return result
}

/**
 * Transform SVG to Svelte component source (not compiled)
 */
export const transformSvgToSvelteSource = (
  contents,
  options = {},
  resourcePath = '',
) => {
  let svg = String(contents)

  // Apply SVGO optimization FIRST
  if (options.svgo !== false) {
    try {
      const svgoConfig = options.svgoConfig || {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {},
            },
          },
        ],
      }
      const res = optimizeSvg(svg, {
        ...svgoConfig,
        path: resourcePath,
      })
      if (res?.data) svg = res.data
    } catch (_e) {
      // ignore svgo errors (loader should not crash build by default)
      // but preserve original svg
    }
  }

  // Apply color attribute replacements AFTER SVGO
  if (options.replaceAttrValues) {
    svg = applyReplacements(svg, options.replaceAttrValues)
  }

  // Clean the SVG markup for Svelte component
  const cleanSvg = svg
    .replace(/^<\?xml.*?\?>/, '') // Remove XML declaration
    .replace(/<!DOCTYPE[^>]*>/, '') // Remove DOCTYPE
    .trim()

  // Detect which props/imports are actually used in the processed SVG
  const usesColord = cleanSvg.includes('colord(')
  const usesUid = cleanSvg.includes('uid')
  const usesColor = cleanSvg.includes('{color}') || cleanSvg.includes('(color)')
  const hasClass = /class="[^"]*"/.test(cleanSvg)
  const hasStyle = /style="[^"]*"/.test(cleanSvg)

  // Build imports conditionally
  const imports = options.imports || ''
  const conditionalImports = usesColord ? imports : ''

  // Build props list conditionally - only include props that are used
  const props = []
  if (hasClass) props.push("export let className = '';")
  if (hasStyle) props.push("export let style = '';")
  if (usesColor) props.push("export let color = 'currentColor';")
  if (usesUid) props.push("export let uid = '';")

  // Apply class/style replacements only if needed
  let finalSvg = cleanSvg
  if (hasClass) {
    finalSvg = finalSvg.replace(/class="([^"]*)"/, 'class="{className || \'$1\'}"')
  }
  if (hasStyle) {
    finalSvg = finalSvg.replace(/style="([^"]*)"/, 'style="{style || \'$1\'}"')
  }

  // Generate Svelte component source
  const svelteSource = `<script>
  ${conditionalImports}
  ${props.join('\n  ')}
</script>

${finalSvg}
`

  return { svelteSource, raw: svg }
}

const transformSvg = callbackify(async (contents, options = {}, state = {}) => {
  const resourcePath = state.filePath || state.filename || ''
  const { svelteSource, raw } = transformSvgToSvelteSource(
    contents,
    options,
    resourcePath,
  )

  // Compile Svelte component to JavaScript for bundled output
  const compiled = compile(svelteSource, {
    filename: resourcePath,
    generate: 'client',
    css: 'injected',
  })

  // Export compiled component + raw SVG
  const out = `${compiled.js.code}
export const raw = ${JSON.stringify(raw)};
`

  return out
})

/**
 * Rspack loader definition for Svelte SVG components
 * Exports default function
 */
export default function loader(contents) {
  // mark cacheable
  if (this?.cacheable) this.cacheable()

  const callback = this.async()
  const options = this.getOptions ? this.getOptions() : {}

  // Attempt to detect if file already contains an export (previous transform)
  const previousExport = (() => {
    if (String(contents).startsWith('export ')) return contents
    const exportMatches = String(contents).match(/^module\.exports\s*=\s*(.*)/)
    return exportMatches ? `export default ${exportMatches[1]}` : null
  })()

  const state = {
    caller: {
      name: '@avatune/plugin-svg-to-svelte',
      previousExport,
    },
    filePath: normalize(
      this.resourcePath ||
        (typeof __filename !== 'undefined' && __filename) ||
        '',
    ),
  }

  // If previousExport exists we should read original file content from fs and transform that
  if (!previousExport) {
    transformSvg(contents, options, state, callback)
    return
  }

  // else read original file from disk and transform
  this.fs.readFile(this.resourcePath, (err, result) => {
    if (err) {
      callback(err)
      return
    }
    transformSvg(String(result), options, state, (err2, content) => {
      if (err2) {
        callback(err2)
        return
      }
      callback(null, content)
    })
  })
}
