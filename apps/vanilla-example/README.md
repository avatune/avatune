# Vanilla Avatar Example

A vanilla JavaScript/TypeScript example demonstrating the use of Avatune avatar rendering without any framework.

## Features

- Pure vanilla JavaScript/TypeScript
- Direct DOM manipulation
- Smallest bundle size: **23.8 kB** (9.5 kB gzipped)
- No framework overhead

## Usage

The example demonstrates two avatars:

1. **Configured Avatar** - Using specific part selections
2. **Random Avatar** - Using seed-based generation

## How It Works

The vanilla implementation:

1. Uses `selectItemFromConfig()` from `@avatune/utils` to select avatar parts
2. Creates SVG elements using `document.createElementNS()`
3. Parses the raw SVG strings from theme components
4. Positions and scales parts using SVG transforms
5. Applies color customization via CSS custom properties

## Running

```bash
# Development
bun run dev

# Build
bun run build

# Preview
bun run preview
```

## Bundle Size Comparison

| Framework | Total Size | Gzipped |
|-----------|------------|---------|
| Vanilla   | 23.8 kB    | 9.5 kB  |
| Svelte    | 79.0 kB    | 29.3 kB |
| Vue       | 75.2 kB    | 29.7 kB |
| React     | 206.5 kB   | 67.1 kB |

Vanilla provides the smallest bundle size with no runtime overhead.
