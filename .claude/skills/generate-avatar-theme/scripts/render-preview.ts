#!/usr/bin/env bun
/**
 * Render a visual preview of a built avatune theme.
 *
 * Usage: bun render-preview.ts <theme-package-short-name> [seedCount]
 * Example: bun render-preview.ts cyberpunk-theme 24
 *
 * Requires the theme (and its assets) to be built first.
 * Writes .preview/<name>/preview.html with a seeded grid + per-item showcase.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { avatar } from '@avatune/vanilla'

const themeName = process.argv[2]
if (!themeName) {
  console.error('Usage: bun render-preview.ts <theme-package-short-name> [seedCount]')
  process.exit(1)
}
const seedCount = Number(process.argv[3] ?? 24)

const mod = await import(`@avatune/${themeName}/vanilla`)
const theme = mod.default

const cell = (svg: string, label: string) =>
  `<div class="cell">${svg}<span>${label}</span></div>`

const seedCells: string[] = []
for (let i = 0; i < seedCount; i++) {
  const seed = `preview-${i}`
  seedCells.push(cell(avatar({ theme, seed, size: 160 }), seed))
}

const itemCells: string[] = []
const CATEGORIES = ['head', 'hair', 'eyes', 'mouth', 'body', 'glasses', 'faceHair', 'faceDetails', 'accessories', 'hats']
const optionalCategories: string[] = Array.isArray(theme.optionalCategories)
  ? theme.optionalCategories
  : ['glasses', 'faceHair', 'faceDetails']
for (const category of CATEGORIES) {
  const value = theme[category]
  if (typeof value !== 'object' || value === null) continue
  for (const itemName of Object.keys(value)) {
    // hide optional extras (visors etc.) so they don't cover the showcased item
    const noneOverrides = Object.fromEntries(
      optionalCategories.filter((c) => c !== category).map((c) => [c, 'none']),
    )
    try {
      const svg = avatar({ theme, seed: 'showcase', size: 160, ...noneOverrides, [category]: itemName })
      itemCells.push(cell(svg, `${category}/${itemName}`))
    } catch {
      itemCells.push(`<div class="cell error">${category}/${itemName} failed</div>`)
    }
  }
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${themeName} preview</title>
<style>
  body { background: #15151f; color: #ddd; font: 12px monospace; margin: 24px; }
  h2 { font-size: 14px; margin: 24px 0 12px; }
  .grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .cell { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .cell.error { color: #f66; }
</style></head><body>
<h2>${themeName} — seeded combinations</h2>
<div class="grid">${seedCells.join('')}</div>
<h2>item showcase (seed fixed, one item forced per cell)</h2>
<div class="grid">${itemCells.join('')}</div>
</body></html>`

const outDir = join(process.cwd(), '.preview', themeName)
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'preview.html')
writeFileSync(outPath, html)
console.log(outPath)
