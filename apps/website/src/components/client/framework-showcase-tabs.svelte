<script lang="ts">
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import { Avatar } from '@avatune/svelte'
import yanliuTheme from '@avatune/yanliu-theme/svelte'

import type {
  FrameworkShowcaseEntry,
  FrameworkThemeId,
} from '../../lib/framework-showcase'

type FrameworkTab = FrameworkShowcaseEntry & {
  themeId: FrameworkThemeId
}

export let entries: FrameworkTab[] = []

const themeMap: Record<FrameworkThemeId, unknown> = {
  yanliu: yanliuTheme,
  miniavs: miniavsTheme,
  nevmstas: nevmstasTheme,
  micah: micahTheme,
  kyute: kyuteTheme,
  pacovqzz: pacovqzzTheme,
  fatinVerse: fatinVerseTheme,
}

let selectedFrameworkId = entries[0]?.id ?? 'react'

const selectFramework = (id: string) => {
  selectedFrameworkId = id
}

$: selectedFramework =
  entries.find((entry) => entry.id === selectedFrameworkId) ?? entries[0]
$: selectedTheme = selectedFramework
  ? themeMap[selectedFramework.themeId]
  : themeMap.yanliu
$: selectedSeed = selectedFramework?.id ?? 'avatune'
</script>

<div class="mt-8 flex flex-nowrap justify-around sm:justify-start gap-2 overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 sm:p-2 p-1 sm:flex-wrap">
  {#each entries as framework}
    <button
      type="button"
      class={`flex items-center cursor-pointer gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        selectedFrameworkId === framework.id
          ? 'bg-pink-500/20 text-pink-200 shadow-lg shadow-pink-500/10'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
      onclick={() => selectFramework(framework.id)}
    >
      {#if framework.logo}
        <img src={framework.logo.src} alt={framework.logo.alt} class="sm:h-8 sm:w-8 h-5 w-5 shrink-0 object-contain" />
      {/if}
      <span class="hidden lg:inline">{framework.label}</span>
    </button>
  {/each}
</div>

<div class="mt-6 flex flex-col gap-6 lg:flex-row">
  <div class="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 lg:w-2/3">
    <div class="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
      <div class="flex gap-1.5">
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
      </div>
      <div class="flex-1 text-center">
        <span class="text-xs font-mono text-slate-400">{selectedFramework?.filePath}</span>
      </div>
      <div class="w-12"></div>
    </div>
    <div class="min-h-[200px] overflow-x-auto">
      {@html selectedFramework?.highlightedSnippet ?? ''}
    </div>
  </div>

  <div class="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl lg:w-1/3">
    <div class="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
      <div class="flex gap-1.5">
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
        <div class="h-3 w-3 rounded-full bg-pink-300"></div>
      </div>
      <div class="flex-1 text-center">
        <span class="text-xs font-medium text-slate-400">Avatar Preview</span>
      </div>
      <div class="w-12"></div>
    </div>

    <div class="flex min-h-[200px] flex-col items-center justify-center bg-linear-to-br from-slate-900/50 to-slate-950 p-6 sm:p-8">
      {#if selectedTheme}
        <Avatar theme={selectedTheme} seed={selectedSeed} size={200} />
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.shiki) {
    margin: 0;
    padding: 1rem;
    background: transparent !important;
  }
</style>


