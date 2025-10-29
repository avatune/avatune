// Apply color to SVG string content (only in path tags)
export const applyColorToSvgString = (
  svgContent: string,
  color: string,
): string => {
  // Replace fill color values only in <path tags
  return svgContent.replace(/<path\s+[^>]*>/g, (match) => {
    // Replace fill="..." color
    let result = match.replace(/fill="([^"]*)"/g, `fill="${color}"`)
    // Replace fill='...' color
    result = result.replace(/fill='([^']*)'/g, `fill='${color}'`)
    return result
  })
}
