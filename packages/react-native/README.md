# @avatune/react-native

React Native component for rendering avatars from themes.

## Installation

```bash
npm install @avatune/react-native react-native-svg
```

**Note:** This package requires `react-native-svg` as a peer dependency. Make sure to install it in your React Native project.

## Usage

```tsx
import { Avatar } from '@avatune/react-native'
import { nevmstasTheme } from '@avatune/nevmstas-theme/react-native'

function App() {
  return (
    <Avatar
      theme={nevmstasTheme}
      seed="user@example.com"
      size={200}
    />
  )
}
```

## Props

```ts
{
  theme: ReactNativeTheme    // Theme to use for rendering (required)
  seed?: string              // Random seed for avatar generation
  size?: number              // Avatar size in pixels (default: theme size)
  style?: ViewStyle          // Inline styles for SVG container

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
<Avatar theme={nevmstasTheme} seed="521411f1-fab6-4ed5-90bf-2863028bcae6" />
```

Specific parts with custom colors:
```tsx
<Avatar
  theme={nevmstasTheme}
  hair="long"
  hairColor="#ff6b6b"
  eyes="happy"
  eyesColor="#4ecdc4"
/>
```

## Requirements

- React Native >= 0.70.0
- React >= 18.0.0
- react-native-svg >= 13.0.0

## License

MIT

