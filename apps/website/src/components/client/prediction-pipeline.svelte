<script lang="ts">
import theme from '@avatune/nevmstas-theme/svelte'
import { Avatar } from '@avatune/svelte'
import { onDestroy, onMount } from 'svelte'
import examplePhoto from '../../assets/photo.jpg'

const examplePhotoNote =
  'Upload a centered, front-facing portrait shot, shoulders visible, neutral background, soft daylight, and no dramatic shadows.'

const labelStages = ['Hair length', 'Hair color', 'Skin tone']
const CYCLE_DURATION = 7500
const STAGE_COUNT = labelStages.length
const STAGE_DURATION =
  STAGE_COUNT > 0 ? CYCLE_DURATION / STAGE_COUNT : CYCLE_DURATION

let stageIndex = 0
let payloadKey = 0
let intervalId: ReturnType<typeof setInterval> | null = null

const advanceStage = () => {
  if (!STAGE_COUNT) return
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

const getStageLabel = () => labelStages[stageIndex] ?? labelStages[0]

onMount(() => {
  startStageCycle()
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
      <div class="example-photo-frame mobile-hidden h-92 mt-4 rounded-2xl border border-dashed border-white/20 bg-slate-950/70">
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
        <Avatar theme={theme} size={200} seed="svelte" />
      </div>
      <p class="mobile-hidden mt-6 text-sm text-slate-300">Predictions applied: medium hair length, chestnut copper palette, warm-neutral tone.</p>
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
    left: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 1rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(15, 23, 42, 0.9);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.45);
    animation: travelCycle calc(7500ms / 3) cubic-bezier(0.4, 0, 0.2, 1);
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
      transform: translateX(-60%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translateX(50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(150%) scale(0);
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
</style>


