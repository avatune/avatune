---
name: generate-avatar-theme
description: Generate image sheets for a future Avatune avatar theme from a visual brief. Uses a scripted prompt-enhancement call and GPT Image 2 to create separate strict 3x3 PNG sheets for head, hair, eyes, eyebrows, nose, mouth, ears, and body. Stops after image generation so the user can vectorize with PerfectVector and assemble the theme in Avatune Studio. Use whenever the user asks to generate theme artwork, avatar-part images, or a visual starting point for a new avatar theme.
---

# Generate Avatar Theme Images

Generate raster source images only. The user handles vectorization in [PerfectVector](https://perfectvector.com/) and creates the theme in Avatune Studio.

The scripts are the source of truth. Do not reproduce their prompts, schemas, OpenAI requests, image decoding, or manifest generation manually.

## Output contract

Generate one strict 3×3 PNG sheet for each category:

- `head` — blank head, jaw, and neck silhouettes
- `hair` — isolated hair silhouettes
- `eyes` — isolated left/right eye pairs
- `eyebrows` — isolated eyebrow pairs
- `nose` — isolated noses
- `mouth` — isolated mouths
- `ears` — isolated ear pairs
- `body` — isolated shoulder and torso shapes

Each sheet contains exactly nine distinct variants in row-major order. Hair is ordered as short styles in row one, medium styles in row two, and long styles in row three.

The output directory contains:

```text
.preview/<name>-images/
├── body.png
├── ears.png
├── head.png
├── hair.png
├── eyes.png
├── eyebrows.png
├── nose.png
├── mouth.png
└── manifest.json
```

`manifest.json` records the enhanced art direction, row-major item names, exact image prompts, palettes, and model metadata.

## Hard rules

- Every text or image model call must be made by `scripts/generate-avatar-sheet.ts`.
- Generate one isolated category per sheet; never generate complete avatars.
- Every sheet must be a strict 3×3 composition with no borders, dividers, labels, numbers, or guides.
- Keep all nine designs at a consistent scale and center each within its cell.
- Use large closed shapes, clean silhouettes, flat fills, crisp edges, and a limited palette.
- Do not use gradients, lighting, blur, textures, noise, glow, transparency, shadows, thin strokes, or micro-details.
- Use a pure white background.
- Do not create SVGs, asset packages, theme packages, framework bindings, previews, or Studio configuration.
- Do not run VTracer or any other vectorizer.
- Stop after the PNG sheets and manifest pass visual inspection.

## Step 1: Configure the OpenAI key

Check configuration without exposing the key:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts --check
```

If the check fails, run:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts
```

The setup script reads masked terminal input and stores `OPENAI_API_KEY` in the ignored repository-root `.env.local`. Never ask the user to paste the key into chat or pass it as a command-line argument.

## Step 2: Generate the image sheets

Convert the requested name to lowercase kebab-case and pass the user's complete visual brief unchanged:

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --brief '<user style brief>'
```

The harness:

1. enhances the brief into a coherent cross-category art direction with structured output
2. assigns nine row-major variant names per category
3. creates an exact vector-friendly prompt per category
4. calls GPT Image 2 once for each category at 1024×1024 high quality
5. validates that every returned image is square
6. writes the eight PNG sheets and `manifest.json`

Do not call `xd://generate_image`, the OpenAI API, an SDK, or a completion function directly from the skill.

## Step 3: Inspect every sheet

Open all eight PNGs as images. Verify:

- exactly nine visible designs arranged in three rows and three columns
- only the named category appears
- no complete heads or faces leak into feature sheets
- no labels, grid lines, borders, captions, or extra objects
- all designs are fully inside their cells and easy to distinguish
- eyes, eyebrows, noses, mouths, and ears are large enough to vectorize cleanly
- the art style, stroke weight, and palette remain coherent across sheets
- the background is uniformly white

Do not judge image quality from file metadata alone.

## Step 4: Regenerate rejected categories

Give the observed visual defect back to the harness and regenerate only affected categories in the existing output directory:

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --brief '<original user style brief>' \
  --only eyes,mouth \
  --feedback '<specific observed defects and required corrections>'
```

Use concrete feedback such as “eyes are too small and two cells contain eyebrows; enlarge each eye pair and remove all surrounding anatomy.” Reinspect every regenerated image. Repeat until all sheets satisfy the output contract.

## Step 5: Handoff

Return the output directory and list any deliberate naming or palette decisions. The next manual steps are:

1. upload or recreate each accepted design in [PerfectVector](https://perfectvector.com/)
2. export and organize the resulting SVG assets
3. create and configure the theme in Avatune Studio

Do not perform those steps as part of this skill.

## Harness inventory

- `scripts/setup-openai-key.ts` — secure local API-key setup
- `scripts/generate-avatar-sheet.ts` — prompt enhancement, GPT Image 2 calls, image validation, regeneration, and manifest persistence
- `scripts/avatar-theme-manifest.ts` — image categories, palettes, manifest types, and runtime validation
