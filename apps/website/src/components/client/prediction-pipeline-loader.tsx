'use client'

import dynamic from 'next/dynamic'

const PredictionPipeline = dynamic(
  () =>
    import('./prediction-pipeline').then((module) => module.PredictionPipeline),
  { ssr: false },
)

export function PredictionPipelineLoader() {
  return <PredictionPipeline />
}
