# @avatune/flat-design-assets

Flat design style SVG assets for avatar generation.

## Description

This package provides SVG assets in flat design style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/flat-design-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/flat-design-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/flat-design-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/flat-design-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/flat-design-assets/vue';
```

## Available Assets

- Body: shirt, sweater, tshirt, turtleneck
- Ears: standard
- Eyebrows: angry, small, standard
- Eyes: boring, dots, openCircle, openRounded
- Hair: bobRounded, bobStraight, cupCurly, long, medium, short
- Head: oval
- Mouth: bigSmile, flat, frown, halfOpen, laugh, nervous, smile
- Noses: big, curve, dots, halfOval

## Development

Build the library:

```bash
pnpm build
```

Build in watch mode:

```bash
pnpm dev
```
