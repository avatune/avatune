# @avatune/vanilla

Vanilla JavaScript function for rendering avatars from themes.

## Installation

```bash
npm install @avatune/vanilla
```

## Usage

```ts
import { avatar } from '@avatune/vanilla'
import { flatDesignTheme } from '@avatune/flat-design-theme/vanilla'

const svgString = avatar({
  theme: flatDesignTheme,
  seed: 'user@example.com',
  size: 200
})

document.getElementById('avatar-container').innerHTML = svgString
```

## API

```ts
function avatar(args: AvatarArgs): string
```

**Parameters:**
```ts
{
  theme: VanillaTheme        // Theme to use for rendering (required)
  seed?: string              // Random seed for avatar generation
  size?: number              // Avatar size in pixels (default: theme size)

  // Part selection (string identifier)
  body?: string
  ears?: string
  eyebrows?: string
  eyes?: string
  hair?: string
  head?: string
  mouth?: string
  noses?: string

  // Part colors (CSS color values)
  bodyColor?: string
  earsColor?: string
  eyebrowsColor?: string
  eyesColor?: string
  hairColor?: string
  headColor?: string
  mouthColor?: string
  nosesColor?: string
}
```

**Returns:** SVG string ready for insertion into DOM

## Examples

Random avatar with seed:
```ts
const svg = avatar({
  theme: flatDesignTheme,
  seed: '521411f1-fab6-4ed5-90bf-2863028bcae6'
})
```

Specific parts with custom colors:
```ts
const svg = avatar({
  theme: flatDesignTheme,
  hair: 'long',
  hairColor: '#ff6b6b',
  eyes: 'happy',
  eyesColor: '#4ecdc4'
})
```
