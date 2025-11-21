# @avatune/micah-assets

Micah style SVG assets for avatar generation.

## Description

This package provides SVG assets in Micah style for creating customizable avatars. Assets include various options for hair, eyes, eyebrows, mouth, nose, ears, head shape, and body/clothing.

## Installation

```bash
npm install @avatune/micah-assets
```

## Usage

### SVG Paths

```typescript
import { hair, eyes, mouth } from '@avatune/micah-assets';
```

### React Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/micah-assets/react';
```

### Svelte Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/micah-assets/svelte';
```

### Vue Components

```typescript
import { HairShort, EyesBoring, MouthSmile } from '@avatune/micah-assets/vue';
```

## Available Assets

### Accessories

| Preview | Filename |
|---------|----------|
| ![hoop-ear-ring](./src/svg/accessories/hoop-ear-ring.svg) | `hoop-ear-ring` |
| ![stud-ear-ring](./src/svg/accessories/stud-ear-ring.svg) | `stud-ear-ring` |

### Body

| Preview | Filename |
|---------|----------|
| ![collared-shirt](./src/svg/body/collared-shirt.svg) | `collared-shirt` |
| ![crew-shirt](./src/svg/body/crew-shirt.svg) | `crew-shirt` |
| ![open-shirt](./src/svg/body/open-shirt.svg) | `open-shirt` |

### Ears

| Preview | Filename |
|---------|----------|
| ![medium](./src/svg/ears/medium.svg) | `medium` |
| ![small](./src/svg/ears/small.svg) | `small` |

### Eyebrows

| Preview | Filename |
|---------|----------|
| ![down](./src/svg/eyebrows/down.svg) | `down` |
| ![eyelashes-down](./src/svg/eyebrows/eyelashes-down.svg) | `eyelashes-down` |
| ![eyelashes-up](./src/svg/eyebrows/eyelashes-up.svg) | `eyelashes-up` |
| ![up](./src/svg/eyebrows/up.svg) | `up` |

### Eyes

| Preview | Filename |
|---------|----------|
| ![eyeshadow](./src/svg/eyes/eyeshadow.svg) | `eyeshadow` |
| ![round](./src/svg/eyes/round.svg) | `round` |
| ![smiling](./src/svg/eyes/smiling.svg) | `smiling` |
| ![standard](./src/svg/eyes/standard.svg) | `standard` |

### Face-hair

| Preview | Filename |
|---------|----------|
| ![beard](./src/svg/face-hair/beard.svg) | `beard` |
| ![scruff](./src/svg/face-hair/scruff.svg) | `scruff` |

### Glasses

| Preview | Filename |
|---------|----------|
| ![round](./src/svg/glasses/round.svg) | `round` |
| ![square](./src/svg/glasses/square.svg) | `square` |

### Hair

| Preview | Filename |
|---------|----------|
| ![danny-phantom](./src/svg/hair/danny-phantom.svg) | `danny-phantom` |
| ![doug-funny](./src/svg/hair/doug-funny.svg) | `doug-funny` |
| ![fonze](./src/svg/hair/fonze.svg) | `fonze` |
| ![full](./src/svg/hair/full.svg) | `full` |
| ![mr-t](./src/svg/hair/mr-t.svg) | `mr-t` |
| ![pixie](./src/svg/hair/pixie.svg) | `pixie` |
| ![turban](./src/svg/hair/turban.svg) | `turban` |

### Head

| Preview | Filename |
|---------|----------|
| ![standard](./src/svg/head/standard.svg) | `standard` |

### Mouth

| Preview | Filename |
|---------|----------|
| ![frown](./src/svg/mouth/frown.svg) | `frown` |
| ![laughing](./src/svg/mouth/laughing.svg) | `laughing` |
| ![nervous](./src/svg/mouth/nervous.svg) | `nervous` |
| ![pucker](./src/svg/mouth/pucker.svg) | `pucker` |
| ![sad](./src/svg/mouth/sad.svg) | `sad` |
| ![smile](./src/svg/mouth/smile.svg) | `smile` |
| ![smirk](./src/svg/mouth/smirk.svg) | `smirk` |
| ![surprised](./src/svg/mouth/surprised.svg) | `surprised` |

### Noses

| Preview | Filename |
|---------|----------|
| ![curve](./src/svg/noses/curve.svg) | `curve` |
| ![pointed](./src/svg/noses/pointed.svg) | `pointed` |
| ![round](./src/svg/noses/round.svg) | `round` |

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
