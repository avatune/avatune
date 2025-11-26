# @avatune/pacovqzz-assets

Kyute style SVG assets for avatar generation.

## Description

This package provides SVG assets in pacovqzz style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/kyute-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/kyute-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/kyute-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/kyute-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/kyute-assets/vue';
```

## Available Assets

### Body

| Preview                                      | Filename     |
| -------------------------------------------- | ------------ |
| ![casual](./src/svg/body/casual.svg)         | `casual`     |
| ![shirt](./src/svg/body/shirt.svg)           | `shirt`      |
| ![tshirt](./src/svg/body/tshirt.svg)         | `tshirt`     |
| ![turtleneck](./src/svg/body/turtleneck.svg) | `turtleneck` |

### Ears

| Preview                                  | Filename   |
| ---------------------------------------- | ---------- |
| ![standard](./src/svg/ears/standard.svg) | `standard` |

### Eyebrows

| Preview                                        | Filename    |
| ---------------------------------------------- | ----------- |
| ![thick1](./src/svg/eyebrows/thick1.svg)       | `thick1`    |
| ![thick2](./src/svg/eyebrows/thick2.svg)       | `thick2`    |
| ![thickSad](./src/svg/eyebrows/thickSad.svg)   | `thickSad`  |
| ![thin](./src/svg/eyebrows/thin.svg)           | `thin`      |
| ![thinCurly](./src/svg/eyebrows/thinCurly.svg) | `thinCurly` |
| ![thinWide](./src/svg/eyebrows/thinWide.svg)   | `thinWide`  |

### Eyes

| Preview                                  | Filename   |
| ---------------------------------------- | ---------- |
| ![big](./src/svg/eyes/big.svg)           | `big`      |
| ![huge](./src/svg/eyes/huge.svg)         | `huge`     |
| ![medium](./src/svg/eyes/medium.svg)     | `medium`   |
| ![oval](./src/svg/eyes/oval.svg)         | `oval`     |
| ![standard](./src/svg/eyes/standard.svg) | `standard` |

### FaceDetails

| Preview                                         | Filename   |
| ----------------------------------------------- | ---------- |
| ![blushes](./src/svg/faceDetails/blushes.svg)   | `blushes`  |
| ![freckles](./src/svg/faceDetails/freckles.svg) | `freckles` |

### FaceHair

| Preview                                      | Filename   |
| -------------------------------------------- | ---------- |
| ![beard](./src/svg/faceHair/beard.svg)       | `beard`    |
| ![bigBeard](./src/svg/faceHair/bigBeard.svg) | `bigBeard` |
| ![mustache](./src/svg/faceHair/mustache.svg) | `mustache` |

### Glasses

| Preview                                     | Filename   |
| ------------------------------------------- | ---------- |
| ![aviator](./src/svg/glasses/aviator.svg)   | `aviator`  |
| ![harry](./src/svg/glasses/harry.svg)       | `harry`    |
| ![round](./src/svg/glasses/round.svg)       | `round`    |
| ![standard](./src/svg/glasses/standard.svg) | `standard` |

### Hair

| Preview                                        | Filename      |
| ---------------------------------------------- | ------------- |
| ![bob](./src/svg/hair/bob.svg)                 | `bob`         |
| ![curly](./src/svg/hair/curly.svg)             | `curly`       |
| ![curlyMedium](./src/svg/hair/curlyMedium.svg) | `curlyMedium` |
| ![elvis](./src/svg/hair/elvis.svg)             | `elvis`       |
| ![long](./src/svg/hair/long.svg)               | `long`        |
| ![longThick](./src/svg/hair/longThick.svg)     | `longThick`   |
| ![longWavy](./src/svg/hair/longWavy.svg)       | `longWavy`    |
| ![ponyTail](./src/svg/hair/ponyTail.svg)       | `ponyTail`    |
| ![rapunzel](./src/svg/hair/rapunzel.svg)       | `rapunzel`    |
| ![short](./src/svg/hair/short.svg)             | `short`       |
| ![stylish](./src/svg/hair/stylish.svg)         | `stylish`     |
| ![thick](./src/svg/hair/thick.svg)             | `thick`       |
| ![topKnot](./src/svg/hair/topKnot.svg)         | `topKnot`     |

### Head

| Preview                                  | Filename   |
| ---------------------------------------- | ---------- |
| ![standard](./src/svg/head/standard.svg) | `standard` |

### Mouth

| Preview                                         | Filename      |
| ----------------------------------------------- | ------------- |
| ![lips1](./src/svg/mouth/lips1.svg)             | `lips1`       |
| ![lips2](./src/svg/mouth/lips2.svg)             | `lips2`       |
| ![lipsSmile](./src/svg/mouth/lipsSmile.svg)     | `lipsSmile`   |
| ![open](./src/svg/mouth/open.svg)               | `open`        |
| ![openDimples](./src/svg/mouth/openDimples.svg) | `openDimples` |
| ![smile1](./src/svg/mouth/smile1.svg)           | `smile1`      |
| ![smile2](./src/svg/mouth/smile2.svg)           | `smile2`      |
| ![smileOpen](./src/svg/mouth/smileOpen.svg)     | `smileOpen`   |
| ![smirk](./src/svg/mouth/smirk.svg)             | `smirk`       |
| ![wideOpen](./src/svg/mouth/wideOpen.svg)       | `wideOpen`    |

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
