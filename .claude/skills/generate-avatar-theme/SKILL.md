---
name: generate-avatar-theme
description: Generate a complete new avatar theme for the avatune monorepo — an assets package with original SVG art plus a theme package (colors, layout, prediction mappings, framework bindings) — from a style brief like "cyberpunk", "kawaii", "pixel", "corporate". Use this whenever the user asks to create, add, generate, or design a new theme, avatar style, or assets package, says the existing themes aren't enough, or names a visual style they want avatars in — even if they never say the word "theme".
---

# Generate Avatar Theme

A theme is two workspace packages working together:

1. `packages/assets/<name>-assets` — raw SVGs in `src/svg/<category>/<item>.svg`, compiled by rslib plugins into framework components. Recoloring works via **sentinel hex colors** replaced at build time.
2. `packages/themes/<name>-theme` — color palettes, item positions/layers, ML prediction mappings, and per-framework bindings built with `@avatune/theme-builder`.

There are no scaffolding scripts for these packages — copy from a reference theme. `@avatune/miniavs-assets` + `@avatune/miniavs-theme` are the cleanest templates (flat style, 64×64 canvas, 0-offset positions). Only `scripts/generate-assets.ts` (entrypoint generation) is automated.

## Step 1: Art direction first

Before touching files, write down a brief: 4-6 visual motifs (e.g. for cyberpunk: neon glow, visors, asymmetric undercuts, high collars), a palette (which colors are *user-configurable* per category vs. *fixed accents* baked into the art), and the silhouette language (round vs. angular). Every SVG you draw must obey this brief — that consistency is what separates a top-notch theme from clip-art.

Read 2-3 SVGs from an existing assets package first to absorb the conventions (path style, how shading is layered, how parts align).

## Step 2: Scaffold the assets package

```bash
# copy everything except art, generated entrypoints, and build output
mkdir -p packages/assets/<name>-assets/src/svg
cp packages/assets/miniavs-assets/{package.json,rslib.config.ts,rslib.native.config.ts,rslib.shared.ts,tsconfig.json} packages/assets/<name>-assets/
cp packages/assets/miniavs-assets/src/global.d.ts packages/assets/<name>-assets/src/
```

Then edit `package.json`: change `name` to `@avatune/<name>-assets`, reset `version` to `0.1.0`, update `keywords`. Everything else (exports map, scripts, deps) stays identical.

## Step 3: Define the sentinel color map (`rslib.shared.ts`)

This is the heart of the recoloring system. `getReplaceAttrValues()` maps hex strings found in your SVGs to `{color}` template expressions; the build replaces them, and at render time `color` is whatever the theme/user picked for that item's category.

Rules that follow from how the loader works (`rsbuild-plugin-raw-svg/src/loader.mjs`):

- Replacement is **global across the whole package**, not per-category. The same `{color}` works everywhere because each item only ever receives its own category's color — but a sentinel hex must mean ONE role. Never reuse the skin sentinel inside a jacket, or the jacket will turn skin-colored.
- Derived shades use **different sentinel hexes** mapped to `colord` expressions, e.g. `'#D9A06B': '{colord(color).darken(0.08).toHex()}'`. This gives 2-3 tone shading that follows any user-picked color.
- Hexes NOT in the map pass through untouched — use those for **fixed accents** that should not change with user colors (e.g. a neon trim that defines the theme's identity).
- Avoid literal `{` `}` anywhere in SVGs (the loader turns `{expr}` into a template expression) and avoid `id`/`url(#...)`/`<defs>` (multiple avatars on one page collide; `cleanupIds` is disabled). Flat fills + `fill-opacity` instead of gradients.
- Pick sentinel hexes that won't collide with fixed colors, and don't map `#000000` if you also want fixed black linework — use e.g. `#0A0A14` for fixed dark lines instead.

Document each sentinel with a comment: `// skin base`, `// skin shadow (derived)`, etc.

## Step 4: Draw the SVGs

Categories (each is a directory under `src/svg/`): `head`, `hair`, `eyes`, `mouth`, `body` are the core; `glasses`, `faceHair`, `faceDetails`, `accessories`, `hats` are optional extras. A solid theme ships ~20-30 items: 2-3 heads, 6-8 hair, 3-4 eyes, 3 mouths, 2-3 bodies, plus 1-2 in each optional category.

Geometry conventions:

- All parts share ONE full-size canvas (`viewBox="0 0 <size> <size>"`, miniavs uses 64) and are drawn **in place**, pre-aligned to the head. The theme then uses `0%` offsets for every item — far easier to keep consistent than per-part offsets.
- Fix the head anchor before drawing anything: head centered horizontally (~x=32 on a 64 canvas), top of skull ~y=13, chin ~y=56, neck running below into the body area; the avatar is clipped to the canvas, so bodies can overflow the bottom edge.
- Hair must hug the same skull. Draw the head in the background of your mental canvas when drafting every hair/eyes/mouth path. Overlap adjacent parts by 1-2 units so scaling never shows gaps.
- Detail must read at 64 CSS pixels. Test small: a 1-unit-wide circuit line is invisible; a 2-3 unit neon stripe reads fine.
- Err on the side of volume for hair. Skull-hugging caps all look bald in a grid; the first visual pass reliably shows hair drawn too timidly. Give each style a silhouette you could identify from the outline alone (fringe edge, sweep, crest, curtain).
- Use the sentinel hexes from Step 3 for everything recolorable; fixed accent hexes for the theme's signature details.

## Step 5: Generate entrypoints

```bash
bun scripts/generate-assets.ts <name>-assets
```

This regenerates `src/{react,vue,svelte,solid,angular,svg,react-native}.ts` from whatever SVGs exist. Re-run after adding/renaming any SVG.

## Step 6: Scaffold the theme package

Copy `packages/themes/miniavs-theme/` (`package.json`, `rslib.config.ts`, `tsconfig.json`, `src/`), rename to `@avatune/<name>-theme`, point deps at `@avatune/<name>-assets`. Then:

- `src/colors.ts` — export `SkinTones`, `HairColors`, `ClothingColors`, `BackgroundColors`, `AccentColors` const objects. These are the actual hexes users get; they're injected into the sentinel slots at render time, so shades derive from them via `colord`.
- `src/shared.ts` — the builder chain. Required pieces:
  - `.withStyle({ size: <canvas>, borderRadius: '100%' })` — `size` must equal your SVG canvas.
  - `.addColors(category, [...])` for every category incl. `background`.
  - `.addItem(category, '<svgFileName>', { position: fromHeadOffset(percentage('0%'), percentage('0%')), layer })` for every SVG. Layer order (low renders first/behind): head 1, hair 5, body 10, mouth 15, eyes 20, faceDetails 25, faceHair 30, glasses 35. Hair that should sit *behind* the head (long hair backdrop) goes below 1.
  - `.setOptional(category)` for glasses/faceHair/faceDetails so "none" is a valid roll.
  - `.connectColors(source, [targets])` when parts must share a color (e.g. faceHair follows hair).
  - **Prediction mappings** — required for the ML predictor integration to work: `hair` → `short|medium|long` item lists, `hairColor` → `black|brown|blond|gray` color lists, `skinTone` → `dark|medium|light`, `faceHair` → `none|facial_hair`. Map every class; an unmapped class silently falls back to random.
- `src/{vanilla,react,vue,svelte,solidjs,react-native,angular}.ts` — these 7 files are mechanical; generate them from the SVG directory structure:

  ```bash
  bun .claude/skills/generate-avatar-theme/scripts/gen-bindings.ts <name>
  bunx biome check --write packages/themes/<name>-theme/src packages/assets/<name>-assets/src
  ```

Every `addItem` name must exactly match an SVG filename and a `withComponents` key in every binding — a mismatch builds fine but renders a missing part.

## Step 7: Build

```bash
bun install                                # link the new workspaces
bunx turbo build --filter=@avatune/<name>-assets --filter=@avatune/<name>-theme
```

## Step 8: Visual verification loop (do not skip)

You cannot judge SVG art from path data. Render it, look at it, fix it, repeat — expect 2-4 rounds.

```bash
bun .claude/skills/generate-avatar-theme/scripts/render-preview.ts <name>-theme
```

This writes `.preview/<name>-theme/preview.html` (gitignored): a seeded grid (random combinations) plus an item showcase (every item rendered once, labeled, with optional categories suppressed so visors don't cover the eyes you're inspecting). Screenshot it and actually look at the image. Playwright MCP blocks `file://` URLs — serve the directory first (`python3 -m http.server 8741` in `.preview/<name>-theme/`, run in background), then `browser_navigate` to `http://localhost:8741/preview.html` and `browser_take_screenshot` with `fullPage: true` and no `filename` (relative filenames land outside the workspace). Kill the server when done. Check: parts aligned to the head, no gaps/overlap artifacts, silhouettes distinct between items, colors derive correctly (shadows follow base), every item present, style brief respected. Fix SVGs → rebuild assets+theme → re-render.

## Step 9: Optional wiring (ask or note as follow-ups)

- Storybook demos: register the theme in `apps/*-storybook` story files (see how existing themes are imported in `apps/react-storybook/src/stories/Avatar.stories.tsx`).
- Website docs: `apps/website/src/content/docs/packages/` + the `scripts/generate-*-readme.ts` / `generate-themes-mdx.ts` generators.
- Publishing: this repo uses changesets; add one if the packages should be released.
