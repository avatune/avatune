<script lang="ts">
import kyuteTheme from '@avatune/kyute-theme/svelte'
import { Avatar } from '@avatune/svelte'
import type { Predictions } from '@avatune/types'
import photo1 from '../../assets/prediction-2.jpg'

type ThemeType = typeof kyuteTheme

const predictions: Predictions = {
  skinTone: 'medium',
  hairLength: 'medium',
  hairColor: 'brown',
}

const steps = [
  {
    id: 'skinTone',
    label: 'Skin Tone',
    prediction: predictions.skinTone,
  },
  {
    id: 'hairLength',
    label: 'Hair Length',
    prediction: predictions.hairLength,
  },
  {
    id: 'hairColor',
    label: 'Hair Color',
    prediction: predictions.hairColor,
  },
]

function getHeadComponent(
  theme: ThemeType,
): typeof kyuteTheme.head.standard.Component | null {
  const headCategory = theme.head as Record<
    string,
    { Component: typeof kyuteTheme.head.standard.Component }
  >
  const firstKey = Object.keys(headCategory)[0]
  return firstKey ? (headCategory[firstKey]?.Component ?? null) : null
}

function getHairComponent(
  theme: ThemeType,
  item: string,
): typeof kyuteTheme.hair.bob.Component | null {
  const hairCategory = theme.hair as Record<
    string,
    { Component: typeof kyuteTheme.hair.bob.Component }
  >
  return hairCategory?.[item]?.Component ?? null
}

function getSkinToneColors(theme: ThemeType): string[] {
  const skinToneMap = theme.predictorMappings?.skinTone
  if (!skinToneMap || !predictions.skinTone) return []
  return skinToneMap[predictions.skinTone] ?? []
}

function getHairItems(theme: ThemeType): string[] {
  const hairMap = theme.predictorMappings?.hair
  if (!hairMap || !predictions.hairLength) return []
  return hairMap[predictions.hairLength] ?? []
}

function getHairColors(theme: ThemeType): string[] {
  const colorMap = theme.predictorMappings?.hairColor
  if (!colorMap || !predictions.hairColor) return []
  return colorMap[predictions.hairColor] ?? []
}

const skinToneColors = getSkinToneColors(kyuteTheme)
const hairItems = getHairItems(kyuteTheme)
const hairColors = getHairColors(kyuteTheme)
</script>

<section class="rounded-2xl border border-white/10 bg-slate-950/80 py-10 px-2 shadow-xl shadow-pink-500/5 sm:py-10 sm:px-6">
  <div class="mb-4 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200/80">Prediction Flow</p>
    <h3 class="mt-1 text-xl font-semibold text-white sm:text-2xl">Or try out experimental</h3>
  </div>

  <div class="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
    <!-- Photo -->
    <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-900/50 p-3">
      <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Upload a photo</p>
      <div class="h-60 w-50 overflow-hidden rounded-lg">
        <img
          class="h-full w-full object-cover rounded-lg object-top"
          src={photo1.src}
          alt="Portrait for prediction"
          loading="lazy"
          width={photo1.width}
          height={photo1.height}
        />
      </div>
    </div>

    <!-- Connector: Photo -> Steps with Arrow and Text -->
    <div class="flex flex-col items-center justify-center gap-2">
      <p class="text-xs font-medium text-white">Let's detect!</p>
      <svg class="h-8 w-12 rotate-90 text-pink-300 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>

    <!-- Steps -->
    <div class="flex flex-col justify-around gap-2">
      {#each steps as step, index}
        <div class="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/30 px-3 py-4">
          <!-- Step number -->
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-400 text-[10px] font-bold text-white">
            {index + 1}
          </div>

          <!-- Step label -->
          <div class="min-w-[120px]">
            <p class="text-xs font-medium text-slate-300">{step.label}</p>
            <p class="text-[10px] text-slate-500">
              <span class="text-white text-xs">{step.prediction}</span>
            </p>
          </div>

          <!-- Asset previews -->
          <div class="flex flex-1 items-center justify-end gap-1.5">
            {#if step.id === 'skinTone'}
              {#each skinToneColors.slice(0, 3) as color}
                <div class={`w-10 h-10 rounded-full`} style={`background-color: ${color}`}></div>
              {/each}
            {:else if step.id === 'hairLength'}
              {#each hairItems.slice(0, 3) as item}
                {@const HairComponent = getHairComponent(kyuteTheme, item)}
                {#if HairComponent}
                  <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-800/80">
                      <HairComponent color="#8B7355" />
                  </div>
                {/if}
              {/each}
            {:else if step.id === 'hairColor'}
              {#each hairColors.slice(0, 3) as color}
                <div class={`w-10 h-10 rounded-full`} style={`background-color: ${color}`}></div>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Connector: Steps -> Result with Arrow and Text -->
    <div class="flex flex-col items-center justify-center gap-2">
      <p class="text-xs font-medium text-white">Mix it up!</p>
      <svg class="h-8 w-12 rotate-90 text-pink-300 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>

    <!-- Result -->
    <div class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-900/30 p-3 w-full max-w-[240px] lg:w-60">
      <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Result</p>
      <Avatar theme={kyuteTheme} size={220} predictions={predictions} />
      <p class="mt-2 text-center text-[10px] text-slate-500">
        {predictions.hairLength}, {predictions.hairColor}, {predictions.skinTone}
      </p>
    </div>
  </div>
</section>
