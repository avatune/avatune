---
name: generate-avatar-theme
description: Interview the user and generate or resume four high-end 3×3 raster source sheets for an Avatune theme: complete styled faces, hair overlays, clothing bodies, and simple neck connectors. Requires a concrete visible face-style signature, uses explicit user choices—not prompt enhancement—preserves completed sheets across interrupted runs, and outputs 1024×1024 PNGs for manual PerfectVector conversion. Use whenever the user asks to generate, continue, resume, or refine avatar theme artwork or consistent layered source assets.
---

# Generate Avatar Theme Images

Generate raster source sheets only. The user handles vectorization in [PerfectVector](https://perfectvector.com/) and creates the theme in Avatune Studio.

The scripts are the source of truth for the stable variant order, deterministic prompts, OpenAI image requests, checkpoints, and manifest. There is no prompt-enhancement model call and no automated image validation.

## Output contract

Generate exactly four 1024×1024 PNG contact sheets:

- `faces.png` — nine complete front-facing heads containing head shape, ears, eyes, eyebrows, nose, and mouth; no hair or neck
- `hairs.png` — nine isolated hair overlays; short styles in row one, medium in row two, long in row three
- `bodies.png` — nine shoulder-and-torso clothing layers with an open standardized neckline socket; no neck or head
- `necks.png` — nine simple isolated neck connectors with shared top and bottom anchors

Each sheet is a clean 3×3 composition with exactly nine variants in stable row-major order. The output directory is:

```text
.preview/<name>-images/
├── .state/
│   └── generation.json
├── faces.png
├── hairs.png
├── bodies.png
├── necks.png
├── theme-spec.json
└── manifest.json
```

`theme-spec.json` records the user's decisions. `.state/generation.json` is the resumable per-sheet checkpoint. `manifest.json` records the stable variants, exact prompts, palettes, image files, model, and 1024px sheet size.

## Layer contract

The four sheets exist so vectorized parts compose with minimal adjustment:

1. render `body`
2. place `neck` into the body's centered neckline socket
3. place `face` over the neck's hidden top overlap
4. place `hair` over the face

Faces own all facial anatomy and ears. Necks contain no anatomy detail. Bodies own clothing only. Hair remains a separate top overlay.

Use the first `skin` palette color as the sole raster source fill for faces and necks. The other skin colors remain available for recoloring after vectorization.

## Hard rules

- Ask for missing art-direction decisions; never replace the interview with prompt enhancement.
- Require a concrete `faceStyleSignature` before generating faces. “High-end,” “modern,” or a style name alone is insufficient; record 2–4 visible geometric traits.
- Make every image model call through `scripts/generate-avatar-sheet.ts`.
- Generate only the four named sheets. Do not generate separate eyes, eyebrows, noses, mouths, ears, heads, or individual PNG assets.
- Request 1024×1024 images, approximately 33% smaller per edge than the previous 1536×1536 sheets.
- Do not split, crop, normalize, measure, score, reject, or otherwise validate generated pixels in the harness.
- Do not create an automated connector preview. Inspect the four source sheets visually instead.
- Preserve compatible completed sheets when continuing a run.
- Use large closed shapes, flat fills, crisp edges, and a limited palette.
- Do not use gradients, lighting, blur, textures, noise, glow, transparency, shadows, thin decorative strokes, or micro-details.
- Use a pure white background.
- Do not create SVGs, asset packages, theme packages, framework bindings, previews, or Studio configuration.
- Do not run VTracer or any vectorizer.
- Stop after all four PNGs and the manifest have been visually inspected.

## Step 0: Detect existing work

Convert the theme name to lowercase kebab-case and inspect `.preview/<name>-images/` before asking questions.

- If `theme-spec.json` exists, reuse its populated answers. Ask only for missing or explicitly changed decisions.
- If `.state/generation.json` exists, the four-sheet flow has started. Use `--resume`; compatible image files are reused without another OpenAI call.
- If `manifest.json` exists and all four images are present, use `--resume` to refresh the manifest, then continue at visual inspection.
- If only some current image files exist, resume from the checkpoint instead of restarting.
- Old eight-sheet artifacts are not compatible inputs for this four-sheet contract. Preserve them, but do not treat them as current completed sheets or include them in the handoff.

## Step 1: Interview the user

Extract answers already present in the request. Ask only for missing fields with one compact Ask-tool batch:

1. `styleFamily` — geometric minimal, friendly mascot, editorial cut-paper, bold comic, or user-specified
2. `shapeLanguage` — soft rounded, crisp angular, organic asymmetry, or balanced mixed geometry
3. `lineTreatment` — no outlines, uniform dark outlines, palette-colored outlines, or user-specified
4. `mood` — playful, polished, bold, calm, or user-specified
5. `palette` — warm earth, cool pop, soft muted, bold vibrant, or custom
6. `representation` — broadly inclusive, feminine leaning, masculine leaning, androgynous, or user-specified
7. `faceStyleSignature` — 2–4 concrete traits that must visibly shape the head contour and facial features, such as “faceted tapered jaws, narrow offset eyes, single-arc noses, asymmetric editorial mouths”

If the user chooses a custom palette, ask for exact six-digit hex colors for `skin`, `hair`, `features`, `clothing`, and `outline`. Do not ask the user to name all 36 variants; the harness owns stable names and row-major order.
The face style signature is required even when `styleFamily` is already known. It must describe observable geometry rather than quality adjectives. Preserve the user's wording exactly.

## Step 2: Write the theme spec

Create `.preview/<name>-images/theme-spec.json`:

```json
{
  "version": 1,
  "name": "<name>",
  "styleFamily": "<user answer>",
  "shapeLanguage": "<user answer>",
  "lineTreatment": "<user answer>",
  "mood": "<user answer>",
  "representation": "<user answer>",
  "faceStyleSignature": "<2–4 concrete visible face traits>",
  "references": "<optional user-supplied direction>",
  "palette": {
    "skin": ["#......", "#......", "#......"],
    "hair": ["#......", "#......", "#......"],
    "features": ["#......", "#......", "#......"],
    "clothing": ["#......", "#......", "#......"],
    "outline": "#......"
  },
  "categoryNotes": {
    "faces": "<optional explicit requirement>",
    "hairs": "<optional explicit requirement>",
    "bodies": "<optional explicit requirement>",
    "necks": "<optional explicit requirement>"
  },
  "avoid": ["<explicit user constraint>"]
}
```

Use one exact preset unless the user supplied custom colors:

| Preset | Skin | Hair | Features | Clothing | Outline |
| --- | --- | --- | --- | --- | --- |
| warm earth | `#F6D0B1`, `#DFA27C`, `#B96F50`, `#844934`, `#4E2D25` | `#2B1B18`, `#5A3327`, `#8A5738`, `#C4864F`, `#E7C08B` | `#FFF8EE`, `#4F7698`, `#B85065`, `#7F3048`, `#241A1B` | `#315C6B`, `#C26C4A`, `#D3A64A`, `#EEE2CC` | `#241A1B` |
| cool pop | `#F3CCB2`, `#D99A78`, `#AD684F`, `#754535`, `#422A28` | `#1D2433`, `#334D6E`, `#596080`, `#8C668A`, `#C8A6C9` | `#F8FBFF`, `#3D7EA6`, `#7656A8`, `#D65378`, `#20243A` | `#3569C8`, `#48A6A7`, `#7857C7`, `#F06C8C` | `#20243A` |
| soft muted | `#F1D2BD`, `#D5A188`, `#AD7663`, `#795247`, `#493633` | `#3A302D`, `#675149`, `#927466`, `#B79B89`, `#D8C4B2` | `#FBF7F1`, `#718C91`, `#A66F7C`, `#8B687E`, `#393638` | `#879B8A`, `#B58A78`, `#8A879F`, `#D1B98F` | `#393638` |
| bold vibrant | `#FFD0AF`, `#E79B70`, `#BB6449`, `#7A3F32`, `#3B2525` | `#201827`, `#5D2E7A`, `#A3405B`, `#E07836`, `#F2C14E` | `#FFF9EA`, `#167D9A`, `#6D3FC0`, `#E23D68`, `#21172A` | `#007F7B`, `#E34B3F`, `#7357D8`, `#F0B429` | `#21172A` |

Preserve the user's wording. Omit optional fields without corresponding user direction.

## Step 3: Configure the OpenAI key

Check without exposing the key:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts --check
```

If needed, run the secure masked-input setup:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts
```

Never ask the user to paste the key into chat or pass it as a command-line argument.

## Step 4: Generate or resume

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --spec-file .preview/<name>-images/theme-spec.json \
  --resume
```

The script makes at most four image calls. It writes each successful sheet and checkpoint immediately. If interrupted, rerun the same command. It does not inspect or reject image content.

To intentionally replace visually rejected sheets, omit `--resume` and target them explicitly:

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --spec-file .preview/<name>-images/theme-spec.json \
  --only faces,necks \
  --feedback '<specific visual correction>'
```

Do not call `xd://generate_image`, the Responses API, an SDK, or a completion function directly.

## Step 5: Inspect the four images visually

Open `faces.png`, `hairs.png`, `bodies.png`, and `necks.png`. This human/agent inspection replaces harness validation.

Check:

- exactly nine visible designs in a clean 3×3 layout
- no labels, borders, grid lines, captions, or extra objects
- `faces`: each cell is a complete head with ears, eyes, brows, nose, and mouth; no hair or neck
  - the requested face style signature is immediately recognizable in the head, eyes, brows, nose, mouth, ears, spacing, and expressions
  - the sheet feels like one high-end authored character system, not generic avatar-builder output, emoji geometry, stock icons, or clip art
  - all nine faces share the style while remaining materially distinct; they are not one default face with expression swaps
- `hairs`: isolated hair only, with clear face openings and consistent overlay scale
- `bodies`: clothing and shoulders only, with the same centered open neckline socket
- `necks`: simple closed silhouettes only; shared top/bottom anchors, flat hidden overlap ends, no anatomy detail
- all four sheets share one silhouette language, outline treatment, and compatible anchors
- the canonical skin fill matches between faces and necks
- pure white backgrounds and vector-friendly closed shapes

If the face sheet misses any style-signature or finish-bar check, regenerate only `faces` with feedback that names the exact generic geometry and the required replacement. Do not accept “close enough” because the remaining layers inherit their visual authority from the faces.

Regenerate only visually rejected sheets. Do not use file metadata or a pixel-analysis script as a substitute for looking at the images.

## Step 6: Handoff

Return the output directory and note the four-layer order: body → neck → face → hair. The manual next steps are:

1. recreate or upload each accepted design in [PerfectVector](https://perfectvector.com/)
2. export and organize the SVGs by `faces`, `hairs`, `bodies`, and `necks`
3. use consistent viewBoxes and anchors while assembling the layers
4. create and configure the theme in Avatune Studio

Do not perform those steps as part of this skill.

## Harness inventory

- `scripts/setup-openai-key.ts` — secure local API-key setup
- `scripts/generate-avatar-sheet.ts` — four image calls, deterministic prompts, checkpoints, targeted regeneration, and manifest persistence
- `scripts/avatar-theme-manifest.ts` — four categories, stable variants, theme-spec schema, checkpoint types, and manifest validation
