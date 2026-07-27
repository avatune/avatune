---
name: generate-avatar-theme
description: Interview the user and generate or resume four high-end 3×3 raster source sheets for an Avatune theme: complete styled faces, hair overlays, clothing bodies, and simple neck connectors. Optionally anchors the whole theme to supplied reference images—a mascot or character illustration, or a photo of a person—used for style or likeness. Requires a concrete visible face-style signature, uses explicit user choices—not prompt enhancement—preserves completed sheets across interrupted runs, and outputs 1024×1024 PNGs for manual PerfectVector conversion. Use whenever the user asks to generate, continue, resume, or refine avatar theme artwork or consistent layered source assets, including from a supplied mascot, character, brand illustration, or personal photo.
---

# Generate Avatar Theme Images

Generate raster source sheets only. The user handles vectorization in [PerfectVector](https://perfectvector.com/) and creates the theme in Avatune Studio.

The scripts are the source of truth for the stable variant order, deterministic prompts, OpenAI image requests, checkpoints, and manifest. There is no prompt-enhancement model call and no automated image validation.

A run is either text-only or reference-anchored. A reference is one to four images the user supplies — a mascot or character illustration, or a photo of a person — attached to the sheets it guides.

## Output contract

Generate exactly four 1024×1024 PNG contact sheets:

- `faces.png` — nine complete front-facing heads that share one head silhouette and ear construction and differ only in eyes, eyebrows, nose, mouth, and expression; no hair or neck
- `hairs.png` — nine isolated hair overlays drawn from the theme's own world; short styles in row one, medium in row two, long in row three
- `bodies.png` — nine shoulder-and-torso clothing layers with an open standardized neckline socket; no neck or head
- `necks.png` — nine simple isolated neck connectors with shared top and bottom anchors

Each sheet is a clean 3×3 composition with exactly nine variants in stable row-major order. The output directory is:

```text
.preview/<name>-images/
├── .state/
│   └── generation.json
├── reference/                (only when the user supplies reference images)
├── faces.png
├── hairs.png
├── bodies.png
├── necks.png
├── theme-spec.json
└── manifest.json
```

`theme-spec.json` records the user's decisions. `.state/generation.json` is the resumable per-sheet checkpoint. `manifest.json` records the stable variants, exact prompts, palettes, image files, reference files, model, and 1024px sheet size.

## Layer contract

The four sheets exist so vectorized parts compose with minimal adjustment:

1. render `body`
2. place `neck` into the body's centered neckline socket
3. place `face` over the neck's hidden top overlap
4. place `hair` over the face

Faces own all facial anatomy and ears. Necks contain no anatomy detail. Bodies own clothing only. Hair remains a separate top overlay.

All nine faces share one head silhouette so any hair overlay fits any face and every face meets the same neck anchor. Facial variety lives in the features, not the skull.

That silhouette defaults to a portrait oval: roughly 1.3 times as tall as it is wide excluding ears, widest at the cheekbones, tapering to a rounded chin. A deliberately wider, boxier, or otherwise unusual head is only legitimate when the user asked for it in `faceStyleSignature` or `categoryNotes.faces`.

Use the first `skin` palette color as the sole raster source fill for faces and necks. The other skin colors remain available for recoloring after vectorization.

## Hard rules

- Ask for missing art-direction decisions; never replace the interview with prompt enhancement.
- Require a concrete `faceStyleSignature` before generating faces. “High-end,” “modern,” or a style name alone is insufficient; record 2–4 visible geometric traits.
- Give a themed world its own hairstyles through `hairVariants`. Shipping the default salon cuts to an orc, fantasy, retro, or otherwise specific theme is a defect, not a neutral fallback.
- Keep one shared head silhouette and ear construction across all nine faces. Never vary the head outline per cell, and never request or accept heart, diamond, triangle, pear, square, oblong, or other novelty head shapes.
- Open every reference image with the Read tool before writing the spec. Never derive art direction from a filename, a URL, or the user's description of an image you have not looked at.
- Treat reference-derived values as proposals the user confirms or overrides. A reference never replaces the interview or the face style signature.
- Use only reference images the user owns or has the rights to use; for a photo of a person, that means their own photo or one they have permission to use. Never source a reference image yourself.
- Keep the sheets original flat vector work. Do not trace, crop, collage, or restage the reference artwork, its background, its text, or its logos.
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

- If `theme-spec.json` exists, reuse its populated answers, including its `reference` block. Ask only for missing or explicitly changed decisions.
- If `reference/` exists, the run already has reference images. Reuse them unless the user supplies new ones; replacing a reference file invalidates the sheets that used it.
- If `.state/generation.json` exists, the four-sheet flow has started. Use `--resume`; compatible image files are reused without another OpenAI call.
- If `manifest.json` exists and all four images are present, use `--resume` to refresh the manifest, then continue at visual inspection.
- If only some current image files exist, resume from the checkpoint instead of restarting.
- Old eight-sheet artifacts are not compatible inputs for this four-sheet contract. Preserve them, but do not treat them as current completed sheets or include them in the handoff.

## Step 1: Intake the reference

Skip this step for text-only runs. Run it whenever the user supplies, attaches, or points at a mascot illustration, character art, brand artwork, or a photo of a person.

1. Copy each supplied file into `.preview/<name>-images/reference/` under a descriptive lowercase name. Keep at most four `.png`, `.jpg`, `.jpeg`, or `.webp` files, and record them in the spec as `reference/<file>`. The harness attaches files from disk: when the reference exists only as a chat attachment, ask for a path or ask the user to save it there; download a user-supplied URL with `curl -L -o` into that folder.
2. Open every copied file with the Read tool and look at it.
3. Write `reference.readout` from what you actually see: outline weight, shape vocabulary, proportion logic, feature construction, and dominant colors. Observed geometry only, no quality adjectives.
4. Derive proposals from the reference for `styleFamily`, `shapeLanguage`, `lineTreatment`, `mood`, `faceStyleSignature`, and exact six-digit hex values for each palette role, sampled from the reference rather than a preset.
5. Ask `kind`, `intent`, and the sheets the reference guides in the same Ask batch that confirms the derived proposals:
   - `kind` — `mascot` for illustration or character art, `photo` for a photograph of a person
   - `intent` — `style` borrows the look only and invents all nine designs; `likeness` makes row 1, column 1 a stylized translation of the reference subject while the other eight extend the same system
   - `categories` — default all four sheets; narrow to `faces` when the reference only settles facial style, or add `hairs` and `bodies` when it also settles hair and garment language
6. Record the user's corrections verbatim. A confirmed proposal is a user decision; an unconfirmed one is not.

A `photo` reference is a translation source, not a subject to reproduce: the sheets stay flat vector avatar layers in the theme palette, never a rendered portrait.

## Step 2: Interview the user

Extract answers already present in the request and from confirmed reference proposals. Ask only for missing fields with one compact Ask-tool batch:

1. `styleFamily` — geometric minimal, friendly mascot, editorial cut-paper, bold comic, or user-specified
2. `shapeLanguage` — soft rounded, crisp angular, organic asymmetry, or balanced mixed geometry
3. `lineTreatment` — no outlines, uniform dark outlines, palette-colored outlines, or user-specified
4. `mood` — playful, polished, bold, calm, or user-specified
5. `palette` — warm earth, cool pop, soft muted, bold vibrant, or custom
6. `representation` — broadly inclusive, feminine leaning, masculine leaning, androgynous, or user-specified
7. `faceStyleSignature` — 2–4 concrete traits that must visibly shape the shared head contour and the facial features, such as “a faceted tapered jaw, narrow offset eyes, single-arc noses, asymmetric editorial mouths”

If the user chooses a custom palette, ask for exact six-digit hex colors for `skin`, `hair`, `features`, `clothing`, and `outline`. Do not ask the user to name all 36 variants; the harness owns stable names and row-major order.
The face style signature is required even when `styleFamily` is already known, and even when a reference exists — derive it from the reference and confirm it. It must describe observable geometry rather than quality adjectives, and it describes the single head contour every face shares plus the feature language drawn on it. Preserve the user's wording exactly.

Then settle the theme's own vocabulary for the sheets whose content is cultural rather than anatomical:

- `hairVariants` — whenever the theme has a specific world, species, era, or subculture, propose nine hairstyles drawn from it and confirm them in the same Ask batch. Orcs get topknots, warrior braids, and shaved sides; a retro theme gets period cuts. Keep three short styles, then three medium, then three long, so the sheet still maps to short, medium, and long hair length. Omit the field only when the theme is genuinely generic; the default nine are contemporary salon cuts and will read as stock in any themed world.
- `categoryNotes.bodies` — the garment vocabulary, since body variant names only fix shoulders and the neckline socket.

## Step 3: Write the theme spec

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
  "hairVariants": [
    { "name": "<camelCase>", "description": "<concrete hair shape>" }
  ],
  "references": "<optional user-supplied direction>",
  "reference": {
    "kind": "mascot | photo",
    "intent": "style | likeness",
    "files": ["reference/<file>.png"],
    "readout": "<concrete traits observed in the reference images>",
    "categories": ["faces", "hairs", "bodies", "necks"],
    "notes": "<optional explicit reference instruction>"
  },
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

`references` is optional free-text direction; `reference` is the reference-image block. Omit `reference` entirely for text-only runs, and omit `reference.categories` to guide all four sheets. `readout` must contain at least 40 characters of observed traits, and every entry in `files` must resolve inside the output directory.

`hairVariants` replaces the default nine hairstyles with the theme's own. Supply exactly nine unique camelCase entries in row-major order — three short, three medium, three long — or omit the field to keep the defaults. The other three categories always use the harness variants.

With a reference, use the confirmed hex values sampled from it. Otherwise use one exact preset unless the user supplied custom colors:

| Preset | Skin | Hair | Features | Clothing | Outline |
| --- | --- | --- | --- | --- | --- |
| warm earth | `#F6D0B1`, `#DFA27C`, `#B96F50`, `#844934`, `#4E2D25` | `#2B1B18`, `#5A3327`, `#8A5738`, `#C4864F`, `#E7C08B` | `#FFF8EE`, `#4F7698`, `#B85065`, `#7F3048`, `#241A1B` | `#315C6B`, `#C26C4A`, `#D3A64A`, `#EEE2CC` | `#241A1B` |
| cool pop | `#F3CCB2`, `#D99A78`, `#AD684F`, `#754535`, `#422A28` | `#1D2433`, `#334D6E`, `#596080`, `#8C668A`, `#C8A6C9` | `#F8FBFF`, `#3D7EA6`, `#7656A8`, `#D65378`, `#20243A` | `#3569C8`, `#48A6A7`, `#7857C7`, `#F06C8C` | `#20243A` |
| soft muted | `#F1D2BD`, `#D5A188`, `#AD7663`, `#795247`, `#493633` | `#3A302D`, `#675149`, `#927466`, `#B79B89`, `#D8C4B2` | `#FBF7F1`, `#718C91`, `#A66F7C`, `#8B687E`, `#393638` | `#879B8A`, `#B58A78`, `#8A879F`, `#D1B98F` | `#393638` |
| bold vibrant | `#FFD0AF`, `#E79B70`, `#BB6449`, `#7A3F32`, `#3B2525` | `#201827`, `#5D2E7A`, `#A3405B`, `#E07836`, `#F2C14E` | `#FFF9EA`, `#167D9A`, `#6D3FC0`, `#E23D68`, `#21172A` | `#007F7B`, `#E34B3F`, `#7357D8`, `#F0B429` | `#21172A` |

Preserve the user's wording. Omit optional fields without corresponding user direction.

## Step 4: Configure the OpenAI key

Check without exposing the key:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts --check
```

If needed, run the secure masked-input setup:

```bash
bun .claude/skills/generate-avatar-theme/scripts/setup-openai-key.ts
```

Never ask the user to paste the key into chat or pass it as a command-line argument.

## Step 5: Generate or resume

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --spec-file .preview/<name>-images/theme-spec.json \
  --resume
```

The script makes at most four image calls. It writes each successful sheet and checkpoint immediately. If interrupted, rerun the same command. It does not inspect or reject image content.

Sheets covered by `reference.categories` are sent to the image edit endpoint with the reference files attached; every other sheet uses text-only generation. `--resume` also compares a fingerprint of the reference bytes, so swapping a reference file regenerates exactly the sheets that used it.

To intentionally replace visually rejected sheets, omit `--resume` and target them explicitly:

```bash
bun .claude/skills/generate-avatar-theme/scripts/generate-avatar-sheet.ts \
  <name> \
  --spec-file .preview/<name>-images/theme-spec.json \
  --only faces,necks \
  --feedback '<specific visual correction>'
```

Do not call `xd://generate_image`, the Responses API, an SDK, or a completion function directly.

## Step 6: Inspect the four images visually

Open `faces.png`, `hairs.png`, `bodies.png`, and `necks.png`. This human/agent inspection replaces harness validation.

Check:

- exactly nine visible designs in a clean 3×3 layout
- no labels, borders, grid lines, captions, or extra objects
- `faces`: each cell is a complete head with ears, eyes, brows, nose, and mouth; no hair or neck
  - all nine heads share one silhouette and one ear construction: same width, height, crown curve, cheek line, and chin
  - no cell uses a heart, diamond, triangle, pear, square, oblong, or other novelty head outline
  - the silhouette is a curved portrait oval, clearly taller than wide, tapering to a rounded chin — not a rounded rectangle, squared oval, circle, or a shape with straight vertical sides and a flat chin
  - the requested face style signature is immediately recognizable in the head, eyes, brows, nose, mouth, ears, spacing, and expressions
  - the sheet feels like one high-end authored character system, not generic avatar-builder output, emoji geometry, stock icons, or clip art
  - within the shared head shape the nine faces read as materially distinct characters through feature geometry, not as one default face with swapped mouths
- `hairs`: isolated hair only, with clear face openings and consistent overlay scale
  - the nine styles match the cell map and belong to this theme's world; a sheet that could drop into any other theme unchanged is a fail
  - row one still reads short, row two medium, row three long
- `bodies`: clothing and shoulders only, with the same centered open neckline socket
- `necks`: simple closed silhouettes only; shared top/bottom anchors, flat hidden overlap ends, no anatomy detail
- all four sheets share one silhouette language, outline treatment, and compatible anchors
- the canonical skin fill matches between faces and necks
- pure white backgrounds and vector-friendly closed shapes

With a reference, open it beside the generated sheets and also check:

- the referenced sheets read as the same hand as the reference in shape vocabulary, proportion logic, outline weight, and color relationships
- nothing is traced, cropped, or lifted from the reference: no reference background, framing, text, logo, or photographic shading survives
- `style` intent: the reference subject appears in no cell
- `likeness` intent: row 1, column 1 is a recognizable stylized translation of the subject, still fully flat vector, and the other eight designs are distinct from it while reusing the same head silhouette
- a `photo` reference produced avatar layers, not rendered portraits — no soft shading, skin texture, or photographic detail

If the face sheet misses any shared-head-shape, style-signature, reference-fidelity, or finish-bar check, regenerate only `faces` with feedback that names the exact offending geometry and the required replacement. Do not accept “close enough” because the remaining layers inherit their visual authority from the faces.

Regenerate only visually rejected sheets. Do not use file metadata or a pixel-analysis script as a substitute for looking at the images.

## Step 7: Handoff

Return the output directory and note the four-layer order: body → neck → face → hair. The manual next steps are:

1. recreate or upload each accepted design in [PerfectVector](https://perfectvector.com/)
2. export and organize the SVGs by `faces`, `hairs`, `bodies`, and `necks`
3. use consistent viewBoxes and anchors while assembling the layers
4. create and configure the theme in Avatune Studio

Do not perform those steps as part of this skill.

## Harness inventory

- `scripts/setup-openai-key.ts` — secure local API-key setup
- `scripts/generate-avatar-sheet.ts` — four image calls, deterministic prompts, reference attachment and fingerprinting, checkpoints, targeted regeneration, and manifest persistence
- `scripts/avatar-theme-manifest.ts` — four categories, stable variants, theme-spec and reference schema, checkpoint types, and manifest validation
