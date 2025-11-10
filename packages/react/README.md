# @avatune/react

React component for rendering avatars from themes.

## Installation

```bash
npm install @avatune/react
```

## Usage

```tsx
import { Avatar } from '@avatune/react'
import { flatDesignTheme } from '@avatune/flat-design-theme/react'

function App() {
  return (
    <Avatar
      theme={flatDesignTheme}
      seed="user@example.com"
      size={200}
    />
  )
}
```

## Props

```ts
{
  theme: ReactTheme          // Theme to use for rendering (required)
  seed?: string              // Random seed for avatar generation
  size?: number              // Avatar size in pixels (default: theme size)
  className?: string         // CSS class for SVG container
  style?: CSSProperties      // Inline styles for SVG container

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
```tsx
<Avatar theme={flatDesignTheme} seed="521411f1-fab6-4ed5-90bf-2863028bcae6" />
```

Specific parts with custom colors:
```tsx
<Avatar
  theme={flatDesignTheme}
  hair="long"
  hairColor="#ff6b6b"
  eyes="happy"
  eyesColor="#4ecdc4"
/>
```

