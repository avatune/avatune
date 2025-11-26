<script lang="ts">
import { createHairColorPredictor } from '@avatune/hair-color-predictor'
import { createHairLengthPredictor } from '@avatune/hair-length-predictor'
import theme from '@avatune/micah-theme/svelte'
import { createSkinTonePredictor } from '@avatune/skin-tone-predictor'
import { Avatar } from '@avatune/svelte'
import type { Predictions } from '@avatune/types'
import { onDestroy, onMount } from 'svelte'
import examplePhoto from '../../assets/prediction-1.jpg'

const examplePhotoNote =
  'Upload a centered, front-facing portrait shot, shoulders visible, neutral background, soft daylight, and no dramatic shadows.'

const STAGE_COUNT = 3
const CYCLE_DURATION = 12000
const STAGE_DURATION = CYCLE_DURATION / STAGE_COUNT

let stageIndex = $state(0)
let payloadKey = $state(0)
let intervalId: ReturnType<typeof setInterval> | null = null

let modelsLoading = $state(true)
let predictions = $state<Predictions | null>(null)
let predictionError = $state<string | null>(null)

const hairColorPredictor = createHairColorPredictor('/models/hair-color')
const hairLengthPredictor = createHairLengthPredictor('/models/hair-length')
const skinTonePredictor = createSkinTonePredictor('/models/skin-tone')

const advanceStage = () => {
  stageIndex = (stageIndex + 1) % STAGE_COUNT
  payloadKey += 1
}

const startStageCycle = () => {
  stopStageCycle()
  intervalId = setInterval(advanceStage, STAGE_DURATION)
}

const stopStageCycle = () => {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}

const getStageLabel = () => {
  if (predictions) {
    const labels = [
      `HAIR LENGTH: ${predictions.hairLength}`,
      `HAIR COLOR: ${predictions.hairColor}`,
      `SKIN TONE: ${predictions.skinTone}`,
    ]
    return labels[stageIndex] ?? labels[0]
  }
  return ['Hair length', 'Hair color', 'Skin tone'][stageIndex] ?? 'Hair length'
}

const imageToTensor = async (
  img: HTMLImageElement,
): Promise<import('@tensorflow/tfjs').Tensor3D> => {
  const tf = await import('@tensorflow/tfjs')
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(img)
    return tensor.toFloat().div(255) as import('@tensorflow/tfjs').Tensor3D
  })
}

const loadModelsAndPredict = async () => {
  try {
    await Promise.all([
      hairColorPredictor.loadModel(),
      hairLengthPredictor.loadModel(),
      skinTonePredictor.loadModel(),
    ])

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = examplePhoto.src

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load example image'))
    })

    const tensor = await imageToTensor(img)

    try {
      const [hairColorResult, hairLengthResult, skinToneResult] =
        await Promise.all([
          hairColorPredictor.predict(tensor),
          hairLengthPredictor.predictFromImage(img),
          skinTonePredictor.predictFromImage(img),
        ])

      predictions = {
        hairColor: hairColorResult.color,
        hairLength: hairLengthResult.length,
        skinTone: skinToneResult.tone,
      }
    } finally {
      tensor.dispose()
    }
  } catch (err) {
    console.error('Prediction error:', err)
    predictionError =
      err instanceof Error ? err.message : 'Failed to run predictions'
  } finally {
    modelsLoading = false
  }
}

onMount(() => {
  startStageCycle()
  loadModelsAndPredict()
})

onDestroy(() => {
  stopStageCycle()
})
</script>

<section class="space-y-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-xl shadow-pink-500/5 sm:p-12">
  <p class="text-xs font-semibold uppercase tracking-[0.35em] text-pink-200/80">Prediction Flow</p>
  <h3 class="text-3xl font-semibold text-white sm:text-4xl">Photo in, avatar out.</h3>
  <p class="mobile-hidden mx-auto max-w-3xl text-base text-slate-300">
    Drop a single portrait into <span class="font-semibold text-white">createHairLengthPredictor</span>, <span class="font-semibold text-white">createHairColorPredictor</span>, and
    <span class="font-semibold text-white">createSkinTonePredictor</span>. Pipe those results into the Avatar component and render an instant preview.
  </p>

  <div class="grid gap-6 lg:grid-cols-3">
    <div class="rounded-3xl border border-dashed border-white/30 bg-slate-900/70 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Upload photo</p>
      <div class="example-photo-frame h-92 mt-4 rounded-2xl border border-dashed border-white/20 bg-slate-950/70">
        <img
          class="example-photo"
          src={examplePhoto.src}
          alt={examplePhotoNote}
          loading="lazy"
          width={examplePhoto.width}
          height={examplePhoto.height}
        />
      </div>
    </div>

    <div class="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Predictors</p>
      <div class="relative mt-8 w-full max-w-xs">
        <div class="pipeline-track h-2"></div>
        {#key `${payloadKey}-${stageIndex}`}
          <div class="pipeline-payload" aria-live="polite">
            <span class="payload-dot" aria-hidden="true"></span>
            <span class="payload-label">{getStageLabel()}</span>
          </div>
        {/key}
      </div>
      <p class="mobile-hidden mt-8 text-sm text-slate-300">
        Structured data streams left to right, triggered by a single upload. No extra UI—just clean automation feeding the avatar layer.
      </p>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Avatar preview</p>
      <div class="relative mx-auto mt-6 flex h-64 w-64 items-center justify-center rounded-full bg-linear-to-br from-pink-500/10 to-slate-900/80">
        {#if modelsLoading}
          <div class="skeleton-avatar">
            <div class="skeleton-pulse"></div>
            <p class="skeleton-text">models loading...</p>
          </div>
        {:else if predictionError}
          <div class="error-state">
            <p class="text-sm text-red-400">Failed to load models</p>
          </div>
        {:else}
          <Avatar theme={theme} size={200} predictions={predictions} />
        {/if}
      </div>
      <p class="mobile-hidden mt-6 text-sm text-slate-300">
        {#if modelsLoading}
          Loading TensorFlow.js models for real-time prediction...
        {:else if predictions}
          Predictions applied: {predictions.hairLength} hair, {predictions.hairColor} color, {predictions.skinTone} skin tone.
        {:else}
          Waiting for predictions...
        {/if}
      </p>
    </div>
  </div>
</section>

<style>
  .pipeline-track {
    position: relative;
    width: 100%;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .pipeline-track::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(236, 72, 153, 0.4), rgba(14, 165, 233, 0.2));
    opacity: 0.3;
  }

  .pipeline-payload {
    position: absolute;
    top: -22px;
    left: 50%;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 1rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(15, 23, 42, 0.9);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.45);
    animation: travelCycle 4s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }

  .payload-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, #f472b6, #c084fc);
    display: inline-flex;
  }

  .payload-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: white;
  }

  @keyframes travelCycle {
    0% {
      transform: translateX(-150%) scale(0);
      opacity: 0;
    }
    15% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    85% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(50%) scale(0);
      opacity: 0;
    }
  }

  .example-photo-frame {
    overflow: hidden;
  }

  .example-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 640px) {
    .mobile-hidden {
      display: none !important;
    }
  }

  .skeleton-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .skeleton-pulse {
    width: 160px;
    height: 160px;
    border-radius: 9999px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .error-state {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    border-radius: 9999px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px dashed rgba(239, 68, 68, 0.3);
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>


