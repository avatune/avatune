import fatinVerseTheme from '@avatune/fatin-verse-theme/react'
import kyuteTheme from '@avatune/kyute-theme/react'
import micahTheme from '@avatune/micah-theme/react'
import miniavsTheme from '@avatune/miniavs-theme/react'
import nevmstasTheme from '@avatune/nevmstas-theme/react'
import yanliuTheme from '@avatune/yanliu-theme/react'
import { Avatar } from '@avatune/react'
import type { Predictions, ReactTheme } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PredictionFileInput } from '../components/PredictionFileInput'

const themes = {
  FatinVerse: fatinVerseTheme,
  Kyute: kyuteTheme,
  Micah: micahTheme,
  Miniavs: miniavsTheme,
  Nevmstas: nevmstasTheme,
  Yanliu: yanliuTheme,
} as const

type ThemeName = keyof typeof themes

interface AvatarWithPredictionsProps {
  themeName: ThemeName
}

function AvatarWithPredictions({ themeName }: AvatarWithPredictionsProps) {
  const [predictions, setPredictions] = useState<Predictions | null>(null)
  const theme = themes[themeName] as ReactTheme

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <PredictionFileInput
        onPredictSuccess={(results) => setPredictions(results)}
      />

      {predictions && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3>Generated Avatar ({themeName})</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <Avatar theme={theme} predictions={predictions} size={300} />
          </div>
          <pre style={{ marginTop: '20px', textAlign: 'left' }}>
            {JSON.stringify(predictions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

const meta = {
  title: 'Avatar with Predictions',
  component: AvatarWithPredictions,
  parameters: { layout: 'centered' },
  argTypes: {
    themeName: {
      control: { type: 'select' },
      options: Object.keys(themes),
      description: 'Select avatar theme',
    },
  },
  args: {
    themeName: 'Nevmstas',
  },
} satisfies Meta<typeof AvatarWithPredictions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
