# @avatune/nevmstas-assets

Nevmstas style SVG assets for avatar generation.

## Description

This package provides SVG assets in nevmstas style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

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
| ![shirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/body/shirt.svg) | `shirt` |
| ![sweater](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/body/sweater.svg) | `sweater` |
| ![tshirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/body/tshirt.svg) | `tshirt` |
| ![turtleneck](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/body/turtleneck.svg) | `turtleneck` |

### Ears

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/ears/standard.svg) | `standard` |

### Eyebrows

| Preview | Filename |
|---------|----------|
| ![angry](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyebrows/angry.svg) | `angry` |
| ![small](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyebrows/small.svg) | `small` |
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyebrows/standard.svg) | `standard` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![boring](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyes/boring.svg) | `boring` |
| ![dots](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyes/dots.svg) | `dots` |
| ![openCircle](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyes/openCircle.svg) | `openCircle` |
| ![openRounded](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/eyes/openRounded.svg) | `openRounded` |

### Hair

| Preview | Filename |
|---------|----------|
| ![bobRounded](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/bobRounded.svg) | `bobRounded` |
| ![bobStraight](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/bobStraight.svg) | `bobStraight` |
| ![cupCurly](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/cupCurly.svg) | `cupCurly` |
| ![long](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/long.svg) | `long` |
| ![medium](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/medium.svg) | `medium` |
| ![short](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/hair/short.svg) | `short` |

### Head

| Preview | Filename |
|---------|----------|
| ![oval](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/head/oval.svg) | `oval` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![bigSmile](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/bigSmile.svg) | `bigSmile` |
| ![flat](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/flat.svg) | `flat` |
| ![frown](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/frown.svg) | `frown` |
| ![halfOpen](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/halfOpen.svg) | `halfOpen` |
| ![laugh](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/laugh.svg) | `laugh` |
| ![nervous](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/nervous.svg) | `nervous` |
| ![smile](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/mouth/smile.svg) | `smile` |

### Noses

| Preview | Filename |
|---------|----------|
| ![big](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/noses/big.svg) | `big` |
| ![curve](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/noses/curve.svg) | `curve` |
| ![dots](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/noses/dots.svg) | `dots` |
| ![halfOval](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/nevmstas-assets/src/svg/noses/halfOval.svg) | `halfOval` |

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
