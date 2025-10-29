// Escape XML entities
export const escapeXml = (str: string | number): string => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Create SVG element as string
export const createSvgElement = (
  tag: string,
  attrs: Record<string, string | number | undefined> = {},
  content?: string,
): string => {
  const attributes = Object.entries(attrs)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${escapeXml(v!)}"`)
    .join(' ')

  if (content !== undefined) {
    return `<${tag} ${attributes}>${content}</${tag}>`
  }
  return `<${tag} ${attributes} />`
}

// Parse SVG string and extract the inner content
export const parseSvgContent = (raw: string): string => {
  const match = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  if (match) {
    return match[1]
  }
  // If no match, return raw content
  return raw
}
