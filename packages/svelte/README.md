# @avatune/svelte

Svelte component for rendering avatars from themes.

## Installation

```bash
npm install @avatune/svelte
```

## Usage

```svelte
<script>
  import { Avatar } from '@avatune/svelte'
  import { flatDesignTheme } from '@avatune/flat-design-theme/svelte'
</script>

<Avatar
  theme={flatDesignTheme}
  seed="user@example.com"
  size={200}
/>
```

## Props

```ts
{
  theme: SvelteTheme         // Theme to use for rendering (required)
  seed?: string              // Random seed for avatar generation
  size?: number              // Avatar size in pixels (default: theme size)
  class?: string             // CSS class for SVG container
  style?: string             // Inline styles for SVG container

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

## Examples

Random avatar with seed:
```svelte
<Avatar theme={flatDesignTheme} seed="521411f1-fab6-4ed5-90bf-2863028bcae6" />
```

Specific parts with custom colors:
```svelte
<Avatar
  theme={flatDesignTheme}
  hair="long"
  hairColor="#ff6b6b"
  eyes="happy"
  eyesColor="#4ecdc4"
/>
```
