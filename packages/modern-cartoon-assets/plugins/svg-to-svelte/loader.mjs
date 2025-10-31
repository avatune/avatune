// loader.mjs
import { normalize } from 'node:path'
import { callbackify } from 'node:util'
import { compile } from 'svelte/compiler'
import { optimize as optimizeSvg } from 'svgo'

const transformSvg = callbackify(async (contents, options = {}, state = {}) => {
  let svg = String(contents)
  const resourcePath = state.filePath || state.filename || ''

  if (options.svgo !== false) {
    try {
      const res = optimizeSvg(svg, {
        ...(options.svgoConfig || {}),
        path: resourcePath,
      })
      if (res?.data) svg = res.data
    } catch (e) {
      // ignore svgo errors (loader should not crash build by default)
      // but preserve original svg
    }
  }

  // Clean the SVG markup for Svelte component
  const cleanSvg = svg
    .replace(/^<\?xml.*?\?>/, '') // Remove XML declaration
    .replace(/<!DOCTYPE[^>]*>/, '') // Remove DOCTYPE
    .trim()

  // Generate Svelte component source
  const svelteSource = `<script>
  export let className = '';
  export let style = '';
</script>

${cleanSvg.replace(/class="([^"]*)"/, 'class="{className || \'$1\'}"').replace(/style="([^"]*)"/, 'style="{style || \'$1\'}"')}
`

  // Compile Svelte component to JavaScript
  const compiled = compile(svelteSource, {
    filename: resourcePath,
    generate: 'dom',
    hydratable: false,
    css: 'injected',
  })

  // Export compiled component + raw SVG
  const out = `${compiled.js.code}
export const raw = ${JSON.stringify(svg)};
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
