# @avatune/sketch-black-white-assets

Sketch black and white style SVG assets for avatar generation.

## Description

This package provides SVG assets in sketch/hand-drawn black and white style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, and head shape.

## Installation

```bash
npm install @avatune/sketch-black-white-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/sketch-black-white-assets';
```

### React Components

```typescript
import { HairBoom, EyesCute, MouthSmile } from '@avatune/sketch-black-white-assets/react';
```

### Svelte Components

```typescript
import { HairBoom, EyesCute, MouthSmile } from '@avatune/sketch-black-white-assets/svelte';
```

### Vue Components

```typescript
import { HairBoom, EyesCute, MouthSmile } from '@avatune/sketch-black-white-assets/vue';
```

## Available Assets

- Ears: round, standard
- Eyebrows: bold, raised, sharp
- Eyes: arrows, cute, sharp, standard
- Hair: boom, bundle, cute, rocket, star
- Head: oval
- Mouth: lips, smile, smirk
- Noses: sharp, standard, wide

## Development

Build the library:

```bash
pnpm build
```

Build in watch mode:

```bash
pnpm dev
```

