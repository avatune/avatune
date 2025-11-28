# @avatune/miniavs-assets

Miniavs style SVG assets for avatar generation.

## Description

This package provides SVG assets in miniavs style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/miniavs-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/miniavs-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/miniavs-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/miniavs-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/miniavs-assets/vue';
```

## Available Assets

### Body

| Preview | Filename |
|---------|----------|
| ![golf](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/body/golf.svg) | `golf` |
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/body/standard.svg) | `standard` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![confident](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/eyes/confident.svg) | `confident` |
| ![happy](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/eyes/happy.svg) | `happy` |
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/eyes/standard.svg) | `standard` |

### FaceDetails

| Preview | Filename |
|---------|----------|
| ![blushes](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/faceDetails/blushes.svg) | `blushes` |

### FaceHair

| Preview | Filename |
|---------|----------|
| ![freddy](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/faceHair/freddy.svg) | `freddy` |
| ![horshoe](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/faceHair/horshoe.svg) | `horshoe` |
| ![pencilThin](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/faceHair/pencilThin.svg) | `pencilThin` |
| ![pencilThinBeard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/faceHair/pencilThinBeard.svg) | `pencilThinBeard` |

### Glasses

| Preview | Filename |
|---------|----------|
| ![glasses](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/glasses/glasses.svg) | `glasses` |

### Hair

| Preview | Filename |
|---------|----------|
| ![baldness](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/baldness.svg) | `baldness` |
| ![classic1](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/classic1.svg) | `classic1` |
| ![classic2](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/classic2.svg) | `classic2` |
| ![curly](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/curly.svg) | `curly` |
| ![elvis](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/elvis.svg) | `elvis` |
| ![long](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/long.svg) | `long` |
| ![ponyTail](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/ponyTail.svg) | `ponyTail` |
| ![slaughter](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/slaughter.svg) | `slaughter` |
| ![stylish](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/hair/stylish.svg) | `stylish` |

### Head

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/head/standard.svg) | `standard` |
| ![thin](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/head/thin.svg) | `thin` |
| ![wide](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/head/wide.svg) | `wide` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/mouth/standard.svg) | `standard` |
| ![toothless](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/miniavs-assets/src/svg/mouth/toothless.svg) | `toothless` |

## License & Credits

See [LICENSE.md](LICENSE.md) for license information.

See [CREDITS.md](CREDITS.md) for attribution and credits.

## Development

Build the library:

```bash
bun run build
```

Build in watch mode:

```bash
bun dev
```
