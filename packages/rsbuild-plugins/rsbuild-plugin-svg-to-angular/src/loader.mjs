import { normalize } from 'node:path'
import { callbackify } from 'node:util'
import { optimize as optimizeSvg } from 'svgo'

const PLACEHOLDER_PREFIX = '__ANGULAR_EXPR_'
const PLACEHOLDER_SUFFIX = '__'

const applyReplacements = (svg, replacements = {}) => {
  let result = svg
  const expressions = []

  const sortedKeys = Object.keys(replacements).sort(
    (a, b) => b.length - a.length,
  )

  for (const key of sortedKeys) {
    const value = replacements[key]
    const escapedKey = key.replace(/[()]/g, '\\$&')

    if (value.startsWith('{') && value.endsWith('}')) {
      const expression = value.slice(1, -1)
      const idx = expressions.length
      expressions.push(expression)
      result = result.replace(
        new RegExp(escapedKey, 'g'),
        () => `${PLACEHOLDER_PREFIX}${idx}${PLACEHOLDER_SUFFIX}`,
      )
    } else {
      result = result.replace(new RegExp(escapedKey, 'g'), () => value)
    }
  }

  return { result, expressions }
}

const buildConcatExpression = (svg, expressions) => {
  // Replace {color} and {uid} with placeholders too
  const colorIdx = expressions.length
  expressions.push('color')
  svg = svg.replace(
    /\{color\}/g,
    `${PLACEHOLDER_PREFIX}${colorIdx}${PLACEHOLDER_SUFFIX}`,
  )

  const uidIdx = expressions.length
  expressions.push('uid')
  svg = svg.replace(
    /\{uid\}/g,
    `${PLACEHOLDER_PREFIX}${uidIdx}${PLACEHOLDER_SUFFIX}`,
  )

  // Split by placeholders and build string concatenation
  const placeholderRegex = new RegExp(
    `${PLACEHOLDER_PREFIX}(\\d+)${PLACEHOLDER_SUFFIX}`,
    'g',
  )

  const parts = []
  let lastIndex = 0
  let match = placeholderRegex.exec(svg)

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(JSON.stringify(svg.slice(lastIndex, match.index)))
    }
    parts.push(expressions[parseInt(match[1], 10)])
    lastIndex = match.index + match[0].length

    match = placeholderRegex.exec(svg)
  }

  if (lastIndex < svg.length) {
    parts.push(JSON.stringify(svg.slice(lastIndex)))
  }

  return parts.join(' + ')
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

  let expressions = []
  if (options.replaceAttrValues) {
    const replaced = applyReplacements(svg, options.replaceAttrValues)
    svg = replaced.result
    expressions = replaced.expressions
  }

  const concatExpr = buildConcatExpression(svg, expressions)

  const imports = options.imports || ''

  const lines = [
    imports,
    'export var template = function(color, uid) {',
    '  color = color || "currentColor";',
    '  uid = uid || "";',
    '  return ' + concatExpr + ';',
    '};',
    'export var color = "currentColor";',
    'export var uid = "";',
    'export var props = {',
    '  color: { type: String, default: "currentColor" },',
    '  uid: { type: String, default: "" }',
    '};',
    '',
    'export default {',
    '  template: template,',
    '  props: props',
    '};',
  ]

  const out = lines.join('\n')

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
