<script lang="ts">
import { Avatar } from '@avatune/svelte'
import type { Predictions } from '@avatune/types'
import { getTheme, getThemeInfo, themeInfos } from '../../lib/themes'

export let predictions: Predictions
export let selectedThemeId: string
export let isThemeDropdownOpen = false
export let themeDropdownButton: HTMLButtonElement | null = null
export let themeDropdownMenu: HTMLDivElement | null = null

export let onThemeSelect: (themeId: string) => void = () => {}
export let onDropdownToggle: () => void = () => {}
export let onClickOutside: (event: MouseEvent) => void = () => {}

$: svelteTheme = getTheme(selectedThemeId)
$: selectedThemeInfo = getThemeInfo(selectedThemeId)
</script>

<div class="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-900/30 p-3 w-full max-w-[240px] lg:w-60">
  <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Result</p>
  {#key selectedThemeId}
    <Avatar theme={svelteTheme} size={220} {predictions} />
  {/key}
  <div class="mt-4 w-full">
    <label for="theme-dropdown-button" class="mb-2 block text-xs font-medium text-slate-400">Theme</label>
    <div class="relative">
      <button
        id="theme-dropdown-button"
        bind:this={themeDropdownButton}
        type="button"
        onclick={onDropdownToggle}
        class="w-full rounded-md border border-white/10 bg-slate-800/60 px-3 py-2 text-xs text-white focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30 flex items-center gap-2 justify-between hover:bg-slate-800/80 transition-colors"
        aria-expanded={isThemeDropdownOpen}
        aria-haspopup="listbox"
      >
        <div class="flex items-center gap-2">
          <div class="h-6 w-6 rounded overflow-hidden shrink-0">
            {#key selectedThemeId}
              <Avatar theme={svelteTheme} size={24} {predictions} />
            {/key}
          </div>
          <span>{selectedThemeInfo.label}</span>
        </div>
        <svg
          class="h-4 w-4 transition-transform {isThemeDropdownOpen ? 'rotate-180' : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {#if isThemeDropdownOpen}
        <div bind:this={themeDropdownMenu} class="absolute z-10 bottom-full mb-1 w-full rounded-md border border-white/10 bg-slate-800/95 backdrop-blur-sm shadow-lg max-h-64 overflow-y-auto">
          {#each themeInfos as themeInfo}
            {@const theme = getTheme(themeInfo.id)}
            <button
              type="button"
              onclick={() => onThemeSelect(themeInfo.id)}
              class="w-full px-3 py-2 text-left text-xs text-white transition-colors flex items-center gap-2 {selectedThemeId === themeInfo.id ? 'bg-pink-500/20' : 'bg-transparent hover:bg-slate-700/50'}"
            >
              <div class="h-8 w-8 rounded overflow-hidden shrink-0">
                {#key themeInfo.id}
                  <Avatar theme={theme} size={32} {predictions} />
                {/key}
              </div>
              <span class="flex-1">{themeInfo.label}</span>
              {#if selectedThemeId === themeInfo.id}
                <svg class="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<svelte:window on:click={onClickOutside} />
