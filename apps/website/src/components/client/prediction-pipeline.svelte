<script lang="ts">
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import { Avatar } from '@avatune/svelte'
import type { Predictions } from '@avatune/types'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import { onDestroy, onMount } from 'svelte'
import photo1 from '../../assets/prediction-1.jpg'
import photo2 from '../../assets/prediction-2.jpg'
import photo3 from '../../assets/prediction-3.jpg'

const examplePhotoNote =
  'Upload a centered, front-facing portrait shot, shoulders visible, neutral background, soft daylight, and no dramatic shadows.'

const photos = [photo1, photo2, photo3]

const themes = [
  micahTheme,
  kyuteTheme,
  miniavsTheme,
  nevmstasTheme,
  yanliuTheme,
]

const mockPredictions: Predictions[] = [
  { hairLength: 'long', hairColor: 'blond', skinTone: 'light' },
  { hairLength: 'short', hairColor: 'black', skinTone: 'medium' },
  { hairLength: 'short', hairColor: 'black', skinTone: 'dark' },
]

const PHOTO_COUNT = 3
const STAGE_COUNT = 3
const STAGE_DURATION = 4000

let photoIndex = $state(0)
let stageIndex = $state(0)
let animationKey = $state(0)
let avatarSize = $state(200)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentPhoto = $derived(photos[photoIndex])
const predictions = $derived(mockPredictions[photoIndex])
const currentTheme = $derived(themes[photoIndex % themes.length])

const advanceStage = () => {
  stageIndex = stageIndex + 1
  animationKey += 1

  if (stageIndex >= STAGE_COUNT) {
    stageIndex = 0
    photoIndex = (photoIndex + 1) % PHOTO_COUNT
  }
}

const startCycle = () => {
  stopCycle()
  intervalId = setInterval(advanceStage, STAGE_DURATION)
}

const stopCycle = () => {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}

const getStageLabel = () => {
  const labels = [
    `HAIR LENGTH: ${predictions.hairLength}`,
    `HAIR COLOR: ${predictions.hairColor}`,
    `SKIN TONE: ${predictions.skinTone}`,
  ]
  return labels[stageIndex] ?? labels[0]
}

const updateAvatarSize = () => {
  if (typeof window === 'undefined') return
  avatarSize = window.innerWidth <= 640 ? 160 : 200
}

onMount(() => {
  updateAvatarSize()
  window.addEventListener('resize', updateAvatarSize)
  startCycle()
})

onDestroy(() => {
  stopCycle()
  window.removeEventListener('resize', updateAvatarSize)
})
</script>

<section class="space-y-4 sm:space-y-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-xl shadow-pink-500/5 sm:p-12">
  <p class="text-xs font-semibold uppercase tracking-[0.35em] text-pink-200/80">Prediction Flow</p>
  <h3 class="text-3xl font-semibold text-white sm:text-4xl">Photo in, avatar out.</h3>
  <p class="mx-auto hidden max-w-3xl text-base text-slate-300 sm:block">
    Drop a single portrait into <span class="font-semibold text-white">createHairLengthPredictor</span>, <span class="font-semibold text-white">createHairColorPredictor</span>, and
    <span class="font-semibold text-white">createSkinTonePredictor</span>. Pipe those results into the Avatar component and render an instant preview.
  </p>

  <div class="grid gap-6 lg:grid-cols-3">
    <div class="rounded-3xl border border-dashed border-white/30 bg-slate-900/70 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Upload photo</p>
      <div class="mt-4 h-64 overflow-hidden rounded-2xl border border-dashed border-white/20 bg-slate-950/70 sm:h-92">
        {#key photoIndex}
        <img
          class="fade-in block h-full w-full object-cover"
          src={currentPhoto.src}
          alt={examplePhotoNote}
          loading="lazy"
          width={currentPhoto.width}
          height={currentPhoto.height}
        />
        {/key}
      </div>
    </div>

    <div class="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Predictors</p>
      <div class="relative mt-8 w-full max-w-xs">
        <div class="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(236,72,153,0.4),rgba(14,165,233,0.2))] opacity-30"></div>
        </div>
        {#key animationKey}
          <div
            class="pipeline-payload absolute -top-[22px] left-1/2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/90 px-4 py-1 text-white shadow-[0_10px_25px_rgba(15,23,42,0.45)] whitespace-nowrap"
            aria-live="polite"
          >
            <span class="inline-flex h-3 w-3 rounded-full bg-[linear-gradient(135deg,#f472b6,#c084fc)]" aria-hidden="true"></span>
            <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em]">{getStageLabel()}</span>
          </div>
        {/key}
      </div>
      <p class="mt-8 hidden text-sm text-slate-300 sm:block">
        Structured data streams left to right, triggered by a single upload. No extra UI—just clean automation feeding the avatar layer.
      </p>
    </div>

    <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Avatar</p>
      <div class="relative mx-auto mt-2 sm:mt-6 flex h-42 w-48 items-center justify-center rounded-full bg-linear-to-br from-pink-500/10 to-slate-900/80 sm:h-64 sm:w-64">
        {#key photoIndex}
        <div class="fade-in flex items-center justify-center">
          <Avatar theme={currentTheme} size={avatarSize} predictions={predictions} />
        </div>
        {/key}
      </div>
      <p class="mt-6 hidden text-sm text-slate-300 sm:block">
        Predictions applied: {predictions.hairLength} hair, {predictions.hairColor} color, {predictions.skinTone} skin tone.
      </p>
    </div>
  </div>
</section>
<style>
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

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .pipeline-payload {
    animation: travelCycle 4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }
</style>



