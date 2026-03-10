# @avatune/ashleyy-assets

[![npm version](https://img.shields.io/npm/v/@avatune/ashleyy-assets)](https://www.npmjs.com/package/@avatune/ashleyy-assets)
[![npm bundle size](https://img.shields.io/npm/unpacked-size/@avatune/ashleyy-assets)](https://www.npmjs.com/package/@avatune/ashleyy-assets)

Ashleyy style SVG assets for avatar generation.

## Description

This package provides SVG assets in ashleyy style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/ashleyy-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/ashleyy-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/ashleyy-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/ashleyy-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/ashleyy-assets/vue';
```

## Available Assets

### Accessories

| Preview | Filename |
|---------|----------|
| ![earrings](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/accessories/earrings.svg) | `earrings` |
| ![mask](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/accessories/mask.svg) | `mask` |

### Body

| Preview | Filename |
|---------|----------|
| ![buttonShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/buttonShirt.svg) | `buttonShirt` |
| ![doubleCollarShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/doubleCollarShirt.svg) | `doubleCollarShirt` |
| ![knitSweater](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/knitSweater.svg) | `knitSweater` |
| ![peterPanCollarShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/peterPanCollarShirt.svg) | `peterPanCollarShirt` |
| ![polkaDotShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/polkaDotShirt.svg) | `polkaDotShirt` |
| ![tieShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/tieShirt.svg) | `tieShirt` |
| ![turtleneckShirt](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/body/turtleneckShirt.svg) | `turtleneckShirt` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/eyes/standard.svg) | `standard` |

### Glasses

| Preview | Filename |
|---------|----------|
| ![glasses](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/glasses/glasses.svg) | `glasses` |

### Hair

| Preview | Filename |
|---------|----------|
| ![afro](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/afro.svg) | `afro` |
| ![curlyBun](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/curlyBun.svg) | `curlyBun` |
| ![longWavy](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/longWavy.svg) | `longWavy` |
| ![mediumStraigh](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/mediumStraigh.svg) | `mediumStraigh` |
| ![ponyTail](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/ponyTail.svg) | `ponyTail` |
| ![short](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/short.svg) | `short` |
| ![shortCurly](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/shortCurly.svg) | `shortCurly` |
| ![sideSwept](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/hair/sideSwept.svg) | `sideSwept` |

### Head

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/head/standard.svg) | `standard` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![smile](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/mouth/smile.svg) | `smile` |
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/mouth/standard.svg) | `standard` |

### Nose

| Preview | Filename |
|---------|----------|
| ![standard](https://raw.githubusercontent.com/avatune/avatune/main/packages/assets/ashleyy-assets/src/svg/nose/standard.svg) | `standard` |

## Development

Build the library:

```bash
bun run build
```

Build in watch mode:

```bash
bun dev
```
