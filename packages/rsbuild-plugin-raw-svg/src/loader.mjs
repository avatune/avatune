/**
 * Loader for raw SVG files that transforms placeholders at build time
 * Converts {expression} syntax to ${expression} for template literal evaluation
 */
export default function loader(source) {
  // Mark as cacheable
  if (this?.cacheable) this.cacheable()

  const options = this.getOptions ? this.getOptions() : {}

  // Get the placeholder mappings
  const replacements = options.replaceAttrValues || {}

  // Sort keys by length (longest first) to prevent premature replacements
  const sortedKeys = Object.keys(replacements).sort(
    (a, b) => b.length - a.length,
  )

  let result = source

  for (const key of sortedKeys) {
    const value = replacements[key]
    result = result.replace(
      new RegExp(key.replace(/[()]/g, '\\$&'), 'g'),
      value,
    )
  }

  const imports = options.imports || ''

  // Escape backticks in the SVG, but keep ${...} expressions for template evaluation
  // Convert {expression} to ${expression} for template literal evaluation
  const escapedSvg = result
    .replace(/`/g, '\\`')
    .replace(/\{([^}]+)\}/g, (_match, expr) => `\${${expr}}`)

  // Extract variable names from replacement values to know what props to destructure
  // Match all identifiers in expressions and collect unique ones
  const propsToExtract = new Set()
  const functionNames = new Set()

  // First pass: identify function calls to exclude them from props
  for (const value of Object.values(replacements)) {
    const functionMatches = value.matchAll(/\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g)
    for (const match of functionMatches) {
      functionNames.add(match[1])
    }
  }

  // Second pass: collect all identifiers that aren't function names
  for (const value of Object.values(replacements)) {
    const matches = value.matchAll(/\{([a-zA-Z_$][a-zA-Z0-9_$]*)/g)
    for (const match of matches) {
      const varName = match[1]
      // Only add to props if it's not a function name
      if (!functionNames.has(varName)) {
        propsToExtract.add(varName)
      }
    }
  }

  // Generate destructuring or use props directly
  const propsArray = Array.from(propsToExtract)
  const destructuring =
    propsArray.length > 0 ? `const { ${propsArray.join(', ')} } = props;` : ''

  return `
${imports}

export default function(props) {
  ${destructuring}
  return \`${escapedSvg}\`;
}
`
}
