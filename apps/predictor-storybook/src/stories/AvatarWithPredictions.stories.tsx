import flatTheme from '@avatune/flat-design-theme/react'
import { Avatar } from '@avatune/react'
import type { Predictions } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PredictionFileInput } from '../components/PredictionFileInput'

function AvatarWithPredictions() {
  const [predictions, setPredictions] = useState<Predictions | null>(null)

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <PredictionFileInput
        onPredictSuccess={(results) => setPredictions(results)}
      />

      {predictions && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3>Generated Avatar</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <Avatar theme={flatTheme} predictions={predictions} size={300} />
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
} satisfies Meta<typeof AvatarWithPredictions>

export default meta
type Story = StoryObj<typeof meta>

export const FlatDesign: Story = {}
