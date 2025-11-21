# @avatune/nevmstas-assets

Nevmstas style SVG assets for avatar generation.

## Description

This package provides SVG assets in Nevmstas style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/nevmstas-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/nevmstas-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/nevmstas-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/nevmstas-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/nevmstas-assets/vue';
```

## Available Assets

### Body

| Preview | Filename |
|---------|----------|
| ![shirt](./src/svg/body/shirt.svg) | `shirt` |
| ![sweater](./src/svg/body/sweater.svg) | `sweater` |
| ![tshirt](./src/svg/body/tshirt.svg) | `tshirt` |
| ![turtleneck](./src/svg/body/turtleneck.svg) | `turtleneck` |

### Ears

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/ears/standard.svg) | `standard` |

### Eyebrows

| Preview | Filename |
|---------|----------|
| ![angry](./src/svg/eyebrows/angry.svg) | `angry` |
| ![small](./src/svg/eyebrows/small.svg) | `small` |
| ![standard](./src/svg/eyebrows/standard.svg) | `standard` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![boring](./src/svg/eyes/boring.svg) | `boring` |
| ![dots](./src/svg/eyes/dots.svg) | `dots` |
| ![openCircle](./src/svg/eyes/openCircle.svg) | `openCircle` |
| ![openRounded](./src/svg/eyes/openRounded.svg) | `openRounded` |

### Hair

| Preview | Filename |
|---------|----------|
| ![bobRounded](./src/svg/hair/bobRounded.svg) | `bobRounded` |
| ![bobStraight](./src/svg/hair/bobStraight.svg) | `bobStraight` |
| ![cupCurly](./src/svg/hair/cupCurly.svg) | `cupCurly` |
| ![long](./src/svg/hair/long.svg) | `long` |
| ![medium](./src/svg/hair/medium.svg) | `medium` |
| ![short](./src/svg/hair/short.svg) | `short` |

### Head

| Preview | Filename |
|---------|----------|
| ![oval](./src/svg/head/oval.svg) | `oval` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![bigSmile](./src/svg/mouth/bigSmile.svg) | `bigSmile` |
| ![flat](./src/svg/mouth/flat.svg) | `flat` |
| ![frown](./src/svg/mouth/frown.svg) | `frown` |
| ![halfOpen](./src/svg/mouth/halfOpen.svg) | `halfOpen` |
| ![laugh](./src/svg/mouth/laugh.svg) | `laugh` |
| ![nervous](./src/svg/mouth/nervous.svg) | `nervous` |
| ![smile](./src/svg/mouth/smile.svg) | `smile` |

### Noses

| Preview | Filename |
|---------|----------|
| ![big](./src/svg/noses/big.svg) | `big` |
| ![curve](./src/svg/noses/curve.svg) | `curve` |
| ![dots](./src/svg/noses/dots.svg) | `dots` |
| ![halfOval](./src/svg/noses/halfOval.svg) | `halfOval` |

## License & Credits

See [LICENSE.md](LICENSE.md) for license information.

## Development

Build the library:

```bash
bun run build
```

Build in watch mode:

```bash
bun dev
```
