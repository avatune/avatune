# @avatune/yanliu-assets

Yanliu style SVG assets for avatar generation.

## Description

This package provides SVG assets in Yanliu style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/yanliu-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/yanliu-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/yanliu-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/yanliu-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/yanliu-assets/vue';
```

## Available Assets

### Body

| Preview | Filename |
|---------|----------|
| ![blouse](./src/svg/body/blouse.svg) | `blouse` |
| ![flowerCardigan](./src/svg/body/flowerCardigan.svg) | `flowerCardigan` |
| ![simpleCardigan](./src/svg/body/simpleCardigan.svg) | `simpleCardigan` |
| ![simpleOverall](./src/svg/body/simpleOverall.svg) | `simpleOverall` |
| ![striped](./src/svg/body/striped.svg) | `striped` |
| ![sweaterVest](./src/svg/body/sweaterVest.svg) | `sweaterVest` |
| ![sweaterWavy](./src/svg/body/sweaterWavy.svg) | `sweaterWavy` |
| ![teeBasic](./src/svg/body/teeBasic.svg) | `teeBasic` |
| ![teeButtoned](./src/svg/body/teeButtoned.svg) | `teeButtoned` |
| ![teePocket](./src/svg/body/teePocket.svg) | `teePocket` |
| ![teeRound](./src/svg/body/teeRound.svg) | `teeRound` |

### Ears

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/ears/standard.svg) | `standard` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/eyes/standard.svg) | `standard` |

### FaceDetails

| Preview | Filename |
|---------|----------|
| ![blushes](./src/svg/faceDetails/blushes.svg) | `blushes` |

### FaceHair

| Preview | Filename |
|---------|----------|
| ![bigBeard](./src/svg/faceHair/bigBeard.svg) | `bigBeard` |
| ![chevronMustache](./src/svg/faceHair/chevronMustache.svg) | `chevronMustache` |
| ![mustache](./src/svg/faceHair/mustache.svg) | `mustache` |

### Forelock

| Preview | Filename |
|---------|----------|
| ![bubble](./src/svg/forelock/bubble.svg) | `bubble` |
| ![curve](./src/svg/forelock/curve.svg) | `curve` |
| ![short](./src/svg/forelock/short.svg) | `short` |
| ![split](./src/svg/forelock/split.svg) | `split` |
| ![straight](./src/svg/forelock/straight.svg) | `straight` |
| ![underCut](./src/svg/forelock/underCut.svg) | `underCut` |

### Glasses

| Preview | Filename |
|---------|----------|
| ![glass](./src/svg/glasses/glass.svg) | `glass` |

### Hair

| Preview | Filename |
|---------|----------|
| ![braids](./src/svg/hair/braids.svg) | `braids` |
| ![hijab](./src/svg/hair/hijab.svg) | `hijab` |
| ![medium](./src/svg/hair/medium.svg) | `medium` |
| ![puff](./src/svg/hair/puff.svg) | `puff` |
| ![straightLong](./src/svg/hair/straightLong.svg) | `straightLong` |
| ![straightMedium](./src/svg/hair/straightMedium.svg) | `straightMedium` |

### Hats

| Preview | Filename |
|---------|----------|
| ![beanie](./src/svg/hats/beanie.svg) | `beanie` |
| ![hat](./src/svg/hats/hat.svg) | `hat` |

### Head

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/head/standard.svg) | `standard` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![smile](./src/svg/mouth/smile.svg) | `smile` |

### Neck

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/neck/standard.svg) | `standard` |

### Noses

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/noses/standard.svg) | `standard` |

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
