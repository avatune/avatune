<script lang="ts">
import { Avatar } from '@avatune/svelte'
import {
  extractCategories,
  type ThemeInfo,
  themeInfos,
} from '../../lib/create-avatar-showcase'
import { themeMap } from '../../lib/themes'

type Tab = { id: string; label: string }

let selectedThemeId = $state<string>('pacovqzz')
let seed = $state<string>('try-your-name')
let selections = $state<Record<string, string>>({})
let activeTab = $state<string>('theme')
let tabsEl = $state<HTMLDivElement | null>(null)
let canScrollLeft = $state(false)
let canScrollRight = $state(false)

const svelteTheme = $derived(themeMap[selectedThemeId] ?? themeMap.kyute)
const categories = $derived(
  extractCategories(svelteTheme as unknown as Record<string, unknown>),
)
const tabs = $derived<Tab[]>([
  { id: 'theme', label: 'Theme' },
  ...categories.map((c) => ({ id: c.id, label: c.label })),
])
const activeCategory = $derived(categories.find((c) => c.id === activeTab))
const avatarProps = $derived(
  Object.fromEntries(Object.entries(selections).filter(([, v]) => Boolean(v))),
)
const sortedThemes = $derived<ThemeInfo[]>(themeInfos)

function shuffle() {
  seed = Math.random().toString(36).slice(2, 10)
}

function reset() {
  selectedThemeId = 'kyute'
  selections = {}
  seed = 'hello-avatune'
  activeTab = 'theme'
}

function pickTheme(id: string) {
  selectedThemeId = id
  selections = {}
}

function pickOption(categoryId: string, value: string) {
  selections = { ...selections, [categoryId]: value }
}

function updateTabScroll() {
  if (!tabsEl) return
  canScrollLeft = tabsEl.scrollLeft > 1
  canScrollRight =
    tabsEl.scrollLeft + tabsEl.clientWidth < tabsEl.scrollWidth - 1
}

function scrollTabs(direction: -1 | 1) {
  if (!tabsEl) return
  tabsEl.scrollBy({
    left: direction * Math.max(160, tabsEl.clientWidth * 0.6),
    behavior: 'smooth',
  })
}

$effect(() => {
  if (!tabsEl) return
  updateTabScroll()
  const el = tabsEl
  const onScroll = () => updateTabScroll()
  const onResize = () => updateTabScroll()
  el.addEventListener('scroll', onScroll)
  window.addEventListener('resize', onResize)
  return () => {
    el.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  }
})

async function copyProps() {
  const payload = JSON.stringify(
    { theme: selectedThemeId, seed, ...avatarProps },
    null,
    2,
  )
  try {
    await navigator.clipboard.writeText(payload)
    window.dispatchEvent(
      new CustomEvent('avatune:toast', { detail: 'Copied avatar config' }),
    )
  } catch {
    /* clipboard blocked — no-op */
  }
}

const tabBase =
  'cursor-pointer rounded-md border-none bg-transparent px-3 py-1.5 font-code text-[11.5px] tracking-[0.06em] whitespace-nowrap hover:bg-paper-3'
const optBase =
  'pg-frame-checker relative aspect-square min-w-0 min-h-0 cursor-pointer overflow-hidden rounded-[10px] border border-line bg-[#0c0c0c] p-0 transition hover:-translate-y-px hover:border-line-strong [&>.thumb>svg]:block [&>.thumb>svg]:h-[78%] [&>.thumb>svg]:w-[78%] [&>.thumb>svg]:max-h-[56px] [&>.thumb>svg]:max-w-[56px]'
const optActive = 'border-ink bg-[#181818]'
const btnBase =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line-2 bg-paper-3 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px'
const btnPrimary =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-ink bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-paper transition hover:border-white hover:bg-white active:translate-y-px'
</script>

<div
  class="overflow-hidden rounded-[14px] border border-line-2 [background:linear-gradient(180deg,#131313_0%,#0d0d0d_100%)]"
>
  <!-- Window bar -->
  <div
    class="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5 font-code text-[11.5px] tracking-[0.06em] text-ink-3"
  >
    <span class="h-2 w-2 rounded-[2px] bg-line-2"></span>
    <span class="h-2 w-2 rounded-[2px] bg-line-2"></span>
    <span class="h-2 w-2 rounded-[2px] bg-line-2"></span>
    <span class="ml-1.5">playground · live</span>
    <span class="flex-1"></span>
    <span class="text-ink-3">seed:</span>
    <span class="text-ink">{seed}</span>
  </div>

  <!-- Stage -->
  <div class="grid min-h-[480px] grid-cols-1 md:grid-cols-2">
    <!-- Preview -->
    <div
      class="flex flex-col items-center justify-center gap-[18px] border-b border-line p-6 [background:radial-gradient(60%_60%_at_50%_40%,rgba(25,179,133,0.06),transparent_70%),#0e0e0e] md:border-r md:border-b-0"
    >
      <div
        class="pg-frame-checker relative grid h-60 w-60 place-items-center overflow-hidden rounded-full border border-line-2 [&>*]:relative [&>*]:z-[1]"
      >
        {#key `${selectedThemeId}-${seed}-${JSON.stringify(avatarProps)}`}
          <Avatar theme={svelteTheme} {seed} size={220} {...avatarProps} />
        {/key}
      </div>
      <div
        class="flex flex-col items-center gap-1.5 font-code text-[11px] tracking-[0.16em] uppercase text-ink-3"
      >
        <span>Live preview · 220×220</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex min-w-0 flex-col gap-4 bg-[#101010] p-5">
      <!-- Tabs -->
      <div class="relative border-b border-line">
        <div
          bind:this={tabsEl}
          class="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {#each tabs as t (t.id)}
            <button
              type="button"
              class="{tabBase} {activeTab === t.id
                ? 'bg-paper-card text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)]'
                : 'text-ink-3 hover:text-ink-2'}"
              onclick={() => (activeTab = t.id)}
            >
              {t.label}
            </button>
          {/each}
        </div>

        {#if canScrollLeft}
          <button
            type="button"
            aria-label="Scroll tabs left"
            onclick={() => scrollTabs(-1)}
            class="absolute top-0 left-0 bottom-2 flex w-8 cursor-pointer items-center justify-start border-0 pl-0.5 text-ink-2 [background:linear-gradient(to_right,#101010_55%,transparent)] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        {/if}

        {#if canScrollRight}
          <button
            type="button"
            aria-label="Scroll tabs right"
            onclick={() => scrollTabs(1)}
            class="absolute top-0 right-0 bottom-2 flex w-8 cursor-pointer items-center justify-end border-0 pr-0.5 text-ink-2 [background:linear-gradient(to_left,#101010_55%,transparent)] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        {/if}
      </div>

      <!-- Options grid -->
      <div
        class="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4"
      >
        {#if activeTab === 'theme'}
          {#each sortedThemes as info (info.id)}
            <button
              type="button"
              class="{optBase} {selectedThemeId === info.id ? optActive : ''}"
              title={info.label}
              onclick={() => pickTheme(info.id)}
            >
              <span
                class="thumb pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg"
              >
                {#key info.id}
                  <Avatar theme={themeMap[info.id]} seed={seed} size={48} />
                {/key}
              </span>
            </button>
          {/each}
        {:else if activeCategory}
          {#each activeCategory.items as opt (opt)}
            <button
              type="button"
              class="{optBase} {selections[activeCategory.id] === opt
                ? optActive
                : ''}"
              title={opt}
              onclick={() => pickOption(activeCategory.id, opt)}
            >
              <span
                class="thumb pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg"
              >
                {#key `${selectedThemeId}-${activeCategory.id}-${opt}-${seed}`}
                  <Avatar
                    theme={svelteTheme}
                    {seed}
                    size={48}
                    {...avatarProps}
                    {...{ [activeCategory.id]: opt }}
                  />
                {/key}
              </span>
            </button>
          {/each}
        {/if}
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-2">
        <button type="button" class={btnBase} onclick={shuffle}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
            <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
          </svg>
          Shuffle
        </button>
        <span class="flex-1"></span>
        <button type="button" class={btnPrimary} onclick={copyProps}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          Copy
        </button>
      </div>
    </div>
  </div>
</div>
