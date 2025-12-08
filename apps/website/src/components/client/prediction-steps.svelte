<script lang="ts">
import type { Predictions, SvelteTheme } from '@avatune/types'
import {
  getHairColors,
  getHairComponent,
  getHairItems,
  getSkinToneColors,
} from '../../lib/theme-helpers'

export let predictions: Predictions
export let theme: SvelteTheme
export let themeName: string

type Step = {
  id: 'skinTone' | 'hairLength' | 'hairColor'
  label: string
  prediction: string
}

$: steps = [
  {
    id: 'skinTone' as const,
    label: 'Skin Tone',
    prediction: predictions.skinTone || 'medium',
  },
  {
    id: 'hairLength' as const,
    label: 'Hair Length',
    prediction: predictions.hairLength || 'medium',
  },
  {
    id: 'hairColor' as const,
    label: 'Hair Color',
    prediction: predictions.hairColor || 'brown',
  },
] satisfies Step[]

$: skinToneColors = getSkinToneColors(theme, predictions)
$: hairItems = getHairItems(theme, predictions)
$: hairColors = getHairColors(theme, predictions)
</script>

<div class="flex flex-col justify-around gap-2">
  {#each steps as step, index}
    <div class="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/30 px-3 py-4 min-w-[326px]">
      <!-- Step number -->
      <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-400 text-[10px] font-bold text-white">
        {index + 1}
      </div>

      <!-- Step label -->
      <div class="min-w-[120px]">
        <p class="text-xs font-medium text-slate-300">{step.label}</p>
        <p class="text-[10px] text-slate-500">
          <span class="text-white text-xs capitalize">{step.prediction}</span>
        </p>
      </div>

      <!-- Asset previews -->
      <div class="flex flex-1 items-center justify-end gap-1.5">
        {#if step.id === 'skinTone'}
          {#each skinToneColors.slice(0, 3) as color}
            <div class="w-10 h-10 rounded-full" style={`background-color: ${color}`}></div>
          {/each}
        {:else if step.id === 'hairLength'}
          {#each hairItems.slice(0, 3) as item (item + '-' + themeName)}
            {@const HairComponent = getHairComponent(theme, item)}
            {#if HairComponent}
              {@const Component = HairComponent as any}
              <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-800/80">
                <Component color="#8B7355" />
              </div>
            {/if}
          {/each}
        {:else if step.id === 'hairColor'}
          {#each hairColors.slice(0, 3) as color}
            <div class="w-10 h-10 rounded-full" style={`background-color: ${color}`}></div>
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>
