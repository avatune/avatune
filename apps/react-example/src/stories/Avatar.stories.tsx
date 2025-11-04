import { Avatar } from '@avatune/react'
import sketchTheme from '@avatune/sketch-black-white-theme/react'
import flatTheme from '@avatune/flat-design-theme/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const meta = {
  title: 'Avatar/Configurator',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// Story 1: Interactive configurator with Sketch theme
export const SketchTheme: Story = {
  args: { theme: sketchTheme },
  render: () => {
    const [config, setConfig] = useState({
      ears: 'round' as const,
      eyebrows: 'bold' as const,
      eyes: 'standard' as const,
      hair: 'star' as const,
      head: 'oval' as const,
      mouth: 'smile' as const,
      noses: 'standard' as const,
    })

    const options = {
      ears: ['round', 'standard'],
      eyebrows: ['bold', 'raised', 'sharp'],
      eyes: ['arrows', 'cute', 'sharp', 'standard'],
      hair: ['boom', 'bundle', 'cute', 'rocket', 'star'],
      head: ['oval'],
      mouth: ['lips', 'smile', 'smirk'],
      noses: ['sharp', 'standard', 'wide'],
    }

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Avatar theme={sketchTheme} {...config} width={300} height={300} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {Object.entries(options).map(([category, items]) => (
            <div
              key={category}
              style={{
                display: 'contents',
              }}
            >
              <label
                htmlFor={category}
                style={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  alignSelf: 'center',
                }}
              >
                {category}:
              </label>
              <select
                id={category}
                value={config[category as keyof typeof config]}
                onChange={(e) =>
                  setConfig({ ...config, [category]: e.target.value })
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// Story 2: Flat Design theme
export const FlatDesignTheme: Story = {
  args: { theme: flatTheme },
  render: () => {
    const [config, setConfig] = useState({
      body: 'sweater' as const,
      ears: 'standard' as const,
      eyebrows: 'standard' as const,
      eyes: 'dots' as const,
      hair: 'short' as const,
      head: 'oval' as const,
      mouth: 'smile' as const,
      noses: 'curve' as const,
    })

    const options = {
      body: ['sweater'],
      ears: ['standard'],
      eyebrows: ['standard'],
      eyes: ['boring', 'dots'],
      hair: ['short', 'long', 'medium'],
      head: ['oval'],
      mouth: ['laugh', 'smile', 'nervous'],
      noses: ['curve', 'dots'],
    }

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Avatar theme={flatTheme} {...config} width={300} height={300} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {Object.entries(options).map(([category, items]) => (
            <div
              key={category}
              style={{
                display: 'contents',
              }}
            >
              <label
                htmlFor={category}
                style={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  alignSelf: 'center',
                }}
              >
                {category}:
              </label>
              <select
                id={category}
                value={config[category as keyof typeof config]}
                onChange={(e) =>
                  setConfig({ ...config, [category]: e.target.value })
                }
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// Story 3: Seed-based generator
export const SeedGenerator: Story = {
  args: { theme: sketchTheme },
  render: () => {
    const [seed, setSeed] = useState('hello-world')
    const [selectedTheme, setSelectedTheme] = useState<'sketch' | 'flat'>(
      'sketch',
    )

    const currentTheme = selectedTheme === 'sketch' ? sketchTheme : flatTheme

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Avatar theme={currentTheme} seed={seed} width={300} height={300} />
        </div>

        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <label
            htmlFor="theme"
            style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Theme:
          </label>
          <select
            id="theme"
            value={selectedTheme}
            onChange={(e) =>
              setSelectedTheme(e.target.value as 'sketch' | 'flat')
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
            }}
          >
            <option value="sketch">Sketch Black & White</option>
            <option value="flat">Flat Design</option>
          </select>

          <label
            htmlFor="seed"
            style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Seed Phrase:
          </label>
          <input
            id="seed"
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter a seed phrase..."
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'monospace',
            }}
          />
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            Try different phrases to generate unique avatars deterministically!
          </p>
        </div>
      </div>
    )
  },
}
