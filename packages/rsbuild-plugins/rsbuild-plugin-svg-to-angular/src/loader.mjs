import { normalize } from 'node:path'
import { callbackify } from 'node:util'
import { optimize as optimizeSvg } from 'svgo'

const applyReplacements = (svg, replacements = {}) => {
  let result = svg

  const sortedKeys = Object.keys(replacements).sort(
    (a, b) => b.length - a.length,
  )

  for (const key of sortedKeys) {
    const value = replacements[key]
    const escapedKey = key.replace(/[()]/g, '\\$&')

    if (value.startsWith('{') && value.endsWith('}')) {
      const expression = value.slice(1, -1)
      result = result.replace(
        new RegExp(escapedKey, 'g'),
        `" + ${expression} + "`,
      )
    } else {
      result = result.replace(new RegExp(escapedKey, 'g'), value)
    }
  }

  return result
}

const transformSvg = callbackify(async (contents, options = {}, state = {}) => {
  let svg = String(contents)
  const resourcePath = state.filePath || state.filename || ''

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
      // ignore svgo errors
    }
  }

  if (options.replaceAttrValues) {
    svg = applyReplacements(svg, options.replaceAttrValues)
  }

  svg = svg.replace(/\{color\}/g, '" + color + "')
  svg = svg.replace(/\{uid\}/g, '" + uid + "')

  const escapedSvg = JSON.stringify(svg)

  const out = `export const template = ${escapedSvg};
export const color = 'currentColor';
export const uid = '';
export const props = {
  color: { type: String, default: 'currentColor' },
  uid: { type: String, default: '' }
};

export default {
  template,
  props
};
`

  return out
})

export default function loader(contents) {
  if (this?.cacheable) this.cacheable()

  const callback = this.async()

  const options = this.getOptions ? this.getOptions() : {}

  const previousExport = (() => {
    if (String(contents).startsWith('export ')) return contents
    const exportMatches = String(contents).match(/^module\.exports\s*=\s*(.*)/)
    return exportMatches ? `export default ${exportMatches[1]}` : null
  })()

  const state = {
    caller: {
      name: '@avatune/plugin-svg-to-angular',
      previousExport,
    },
    filePath: normalize(
      this.resourcePath ||
        (typeof __filename !== 'undefined' && __filename) ||
        '',
    ),
  }

  if (!previousExport) {
    transformSvg(contents, options, state, callback)
    return
  }

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
