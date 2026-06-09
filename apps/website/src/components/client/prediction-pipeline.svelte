<script lang="ts">
import { Avatar } from '@avatune/svelte'
import type { Predictions } from '@avatune/types'
import { onDestroy, onMount } from 'svelte'
import { createImageFromFile, validateImageFile } from '../../lib/file-handler'
import {
  initializePredictors,
  type Predictors,
  predictFromImage,
} from '../../lib/predictors'
import { getHairColors, getSkinToneColors } from '../../lib/theme-helpers'
import { getTheme, getThemeInfo, themeInfos } from '../../lib/themes'

const defaultPredictions: Predictions = {
  skinTone: 'medium',
  hairLength: 'medium',
  hairColor: 'brown',
  faceHair: 'facial_hair',
}

const cachedDefaultPredictions: Predictions = {
  skinTone: 'medium',
  hairLength: 'medium',
  hairColor: 'brown',
  faceHair: 'facial_hair',
}

let predictors: Predictors | null = null
let selectedThemeId = 'micah'
let isProcessing = false
let predictions: Predictions | null = cachedDefaultPredictions
let imageUrl: string | null = '/prediction-2.jpg'
let filename = 'prediction-2.jpg'
let error: string | null = null
let isDragging = false
let fileInput: HTMLInputElement | null = null
let isThemeOpen = false
let dropdownButton: HTMLButtonElement | null = null
let dropdownMenu: HTMLDivElement | null = null
let dropdownPos = { top: 0, left: 0, width: 0 }

$: currentPredictions = predictions ?? defaultPredictions
$: currentTheme = getTheme(selectedThemeId)
$: currentThemeInfo = getThemeInfo(selectedThemeId)
$: themeName = currentThemeInfo.label
$: skinSwatches = getSkinToneColors(currentTheme, currentPredictions)
$: hairSwatches = getHairColors(currentTheme, currentPredictions)

function createImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

onMount(() => {
  initializePredictors()
    .then((p) => {
      predictors = p
    })
    .catch((err) => {
      console.error('Failed to load predictors:', err)
      error = 'Failed to load prediction models. Please refresh the page.'
    })
})

onDestroy(() => {
  if (imageUrl) URL.revokeObjectURL(imageUrl)
})

async function handleFile(file: File) {
  error = null

  if (!validateImageFile(file)) {
    error = 'Please upload an image file.'
    return
  }
  if (!predictors) {
    error = 'Models still loading — try again in a second.'
    return
  }

  if (imageUrl) URL.revokeObjectURL(imageUrl)
  imageUrl = URL.createObjectURL(file)
  filename = file.name

  try {
    isProcessing = true
    const img = await createImageFromFile(file)
    predictions = await predictFromImage(predictors, img)
  } catch (err) {
    console.error(err)
    error = 'Failed to process image. Please try a different photo.'
    predictions = null
  } finally {
    isProcessing = false
  }
}

function onFileChange(e: Event) {
  const input = e.currentTarget as HTMLInputElement
  if (input.files && input.files[0]) {
    handleFile(input.files[0])
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging = true
}
function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging = false
}
function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging = false
  const f = e.dataTransfer?.files?.[0]
  if (f) handleFile(f)
}

function rerun() {
  if (!fileInput) return
  fileInput.click()
}

function pickTheme(id: string) {
  selectedThemeId = id
  isThemeOpen = false
}

function updateDropdownPos() {
  if (!dropdownButton) return
  const r = dropdownButton.getBoundingClientRect()
  dropdownPos = { top: r.bottom + 4, left: r.left, width: r.width }
}

function toggleTheme() {
  if (!isThemeOpen) updateDropdownPos()
  isThemeOpen = !isThemeOpen
}

function onViewportChange() {
  if (isThemeOpen) updateDropdownPos()
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as Node
  if (
    isThemeOpen &&
    dropdownButton &&
    dropdownMenu &&
    !dropdownButton.contains(target) &&
    !dropdownMenu.contains(target)
  ) {
    isThemeOpen = false
  }
}

async function copyResult() {
  try {
    const payload = JSON.stringify(
      { theme: selectedThemeId, predictions: currentPredictions },
      null,
      2,
    )
    await navigator.clipboard.writeText(payload)
    window.dispatchEvent(
      new CustomEvent('avatune:toast', { detail: 'Copied avatar config' }),
    )
  } catch {
    /* no-op */
  }
}

const stepDefs = [
  { key: 'skinTone', label: 'Skin tone' },
  { key: 'hairLength', label: 'Hair length' },
  { key: 'hairColor', label: 'Hair color' },
  { key: 'faceHair', label: 'Face hair' },
] as const

function formatStepValue(key: string, value: unknown): string {
  if (key === 'faceHair') {
    return value === 'facial_hair' ? 'Have facial hair' : 'No facial hair'
  }
  return String(value ?? '—').replace(/_/g, ' ')
}

$: stepData = stepDefs.map((s) => {
  const value = currentPredictions[s.key]
  const swatches =
    s.key === 'skinTone'
      ? skinSwatches.slice(0, 3)
      : s.key === 'hairColor'
        ? hairSwatches.slice(0, 3)
        : []
  return {
    key: s.key,
    label: s.label,
    value: formatStepValue(s.key, value),
    swatches,
    done: predictions !== null,
  }
})

const btnBase =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px'
const btnSmall =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card disabled:cursor-not-allowed disabled:opacity-50'
const btnPrimary =
  'inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-ink bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-paper transition hover:border-white hover:bg-white active:translate-y-px'
const labelMono = 'font-code text-[11px] tracking-[0.16em] uppercase text-ink-3'
</script>

<svelte:window
  on:click={handleOutsideClick}
  on:scroll={onViewportChange}
  on:resize={onViewportChange}
/>

<div
  class="grid grid-cols-1 overflow-hidden rounded-[14px] border border-line bg-[#0d0d0d] lg:grid-cols-[1fr_1.1fr_1fr]"
>
  <!-- 01 · Source -->
  <div
    class="flex min-h-[480px] flex-col gap-[18px] border-b border-line p-8 lg:border-r lg:border-b-0"
  >
    <div class="{labelMono} flex items-center gap-2.5">01 · Source</div>

    <label
      for="predictor-file-input"
      class="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[10px] border p-5 transition {isDragging
        ? 'border-emerald-mark bg-emerald-mark/[0.06]'
        : 'border-line-2 bg-paper'}"
      on:dragover={onDragOver}
      on:dragleave={onDragLeave}
      on:drop={onDrop}
    >
      {#if imageUrl}
        <img
          src={imageUrl}
          alt="uploaded preview"
          class="max-h-[200px] max-w-[200px] rounded-[10px] border border-line-2 object-contain"
        />
      {:else}
        <div
          class="relative h-[280px] w-[280px] rounded-full [background:radial-gradient(circle_at_50%_38%,#2a2a2a_0%,#1a1a1a_50%,#0e0e0e_100%)]"
        ></div>
      {/if}

      <!-- <div
        class="text-center font-code text-[11px] tracking-[0.1em] uppercase text-ink-3"
      >
        {filename}
      </div> -->

      <span class="{btnBase} mt-1">
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M17 8 12 3 7 8" />
          <path d="M12 3v12" />
        </svg>
        {imageUrl ? 'Replace' : 'Upload photo'}
      </span>

      <input
        id="predictor-file-input"
        bind:this={fileInput}
        type="file"
        accept="image/*"
        class="sr-only"
        on:change={onFileChange}
      />

      {#if isProcessing}
        <div
          class="absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-[2px]"
        >
          <span class={labelMono}>Inferring…</span>
        </div>
      {/if}
    </label>

    {#if error}
      <p class="text-xs text-coral-mark">{error}</p>
    {/if}
  </div>

  <!-- 02 · Inferred parts -->
  <div
    class="flex min-h-[480px] flex-col gap-[18px] border-b border-line p-8 lg:border-r lg:border-b-0"
  >
    <div class="flex items-center justify-between">
      <span class={labelMono}>02 · Inferred parts</span>
      <button
        type="button"
        class={btnSmall}
        on:click={rerun}
        disabled={isProcessing}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 4l14 8-14 8z" />
        </svg>
        Re-run
      </button>
    </div>

    <div class="flex flex-col gap-3">
      {#each stepData as step, idx (step.key)}
        <div
          class="grid grid-cols-[28px_1fr_auto] items-center gap-3.5 rounded-[10px] border border-line bg-[#0b0b0b] px-3.5 py-3 transition"
        >
          <div
            class="grid h-6 w-6 place-items-center rounded-full border border-line-2 bg-[#1a1a1a] font-code text-[11px] font-semibold text-ink-2 transition"
          >
            {idx + 1}
          </div>
          <div>
            <div class="{labelMono} whitespace-nowrap">{step.label}</div>
            <div class="text-sm text-ink">
              {step.value}
            </div>
          </div>
          <div class="flex gap-1">
            {#if step.swatches.length > 0}
              {#each step.swatches as sw, j (j)}
                <span
                  class="inline-block h-[18px] w-[18px] rounded border border-black/40 shadow-[0_0_0_1px_var(--color-line-2)]"
                  style="background: {sw}; opacity: 0.35;"
                ></span>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- 03 · Result -->
  <div class="flex min-h-[480px] flex-col gap-[18px] p-8">
    <div class={labelMono}>03 · Result</div>

    <div class="flex flex-1 flex-col items-center justify-center gap-[18px]">
      <div
        class="pg-frame-checker relative grid h-[200px] w-[200px] place-items-center overflow-hidden rounded-full border border-line-2 [&>*]:relative [&>*]:z-[1]"
      >
        {#key `${selectedThemeId}-${JSON.stringify(currentPredictions)}`}
          <Avatar
            theme={currentTheme}
            size={200}
            predictions={currentPredictions}
          />
        {/key}
      </div>

      <div class="flex w-full max-w-[240px] flex-col items-center gap-2">
        <span class={labelMono}>Theme · {themeName}</span>
        <div class="relative w-full">
          <button
            type="button"
            bind:this={dropdownButton}
            on:click|stopPropagation={toggleTheme}
            class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-line-2 bg-paper-3 px-3 py-2 text-xs text-ink transition hover:border-line-strong"
            aria-haspopup="listbox"
            aria-expanded={isThemeOpen}
          >
            <span class="flex items-center gap-2">
              <span
                class="block h-6 w-6 shrink-0 overflow-hidden rounded border border-line"
              >
                {#key selectedThemeId}
                  <Avatar
                    theme={currentTheme}
                    size={24}
                    predictions={currentPredictions}
                  />
                {/key}
              </span>
              <span class="text-ink">{themeName}</span>
            </span>
            <svg
              class="h-4 w-4 text-ink-2 transition-transform"
              style:transform={isThemeOpen ? 'rotate(180deg)' : 'none'}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if isThemeOpen}
            <div
              bind:this={dropdownMenu}
              class="fixed z-50 max-h-64 overflow-y-auto rounded-md border border-line-2 bg-[rgba(16,16,16,0.97)] shadow-2xl backdrop-blur-sm"
              style:top="{dropdownPos.top}px"
              style:left="{dropdownPos.left}px"
              style:width="{dropdownPos.width}px"
              role="listbox"
            >
              {#each themeInfos as info (info.id)}
                <button
                  type="button"
                  on:click={() => pickTheme(info.id)}
                  class="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-xs text-ink transition hover:bg-paper-3"
                  style:background={selectedThemeId === info.id
                    ? 'rgba(25, 179, 133, 0.12)'
                    : ''}
                >
                  <span
                    class="block h-8 w-8 shrink-0 overflow-hidden rounded border border-line"
                  >
                    {#key info.id}
                      <Avatar
                        theme={getTheme(info.id)}
                        size={32}
                        predictions={currentPredictions}
                      />
                    {/key}
                  </span>
                  <span class="flex-1">{info.label}</span>
                  {#if selectedThemeId === info.id}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-emerald-mark"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <button type="button" class="{btnPrimary} mt-2" on:click={copyResult}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          Use this avatar
        </button>
      </div>
    </div>
  </div>
</div>
