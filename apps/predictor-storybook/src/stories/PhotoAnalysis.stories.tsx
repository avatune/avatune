import type { Predictions } from '@avatune/types'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PredictionFileInput } from '../components/PredictionFileInput'

function PhotoAnalysis() {
  const [predictions, setPredictions] = useState<Predictions | null>(null)

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <PredictionFileInput
        onPredictSuccess={(results) => setPredictions(results)}
      />

      {predictions && (
        <pre style={{ marginTop: '20px' }}>
          {JSON.stringify(predictions, null, 2)}
        </pre>
      )}
    </div>
  )
}

const meta = {
  title: 'Photo Analysis',
  component: PhotoAnalysis,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PhotoAnalysis>

export default meta
type Story = StoryObj<typeof meta>

export const Predictor: Story = {}
