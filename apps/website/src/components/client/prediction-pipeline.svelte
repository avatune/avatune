<script lang="ts">
import type { Predictions } from '@avatune/types'
import { onDestroy, onMount } from 'svelte'
import { createImageFromFile, validateImageFile } from '../../lib/file-handler'
import {
  initializePredictors,
  type Predictors,
  predictFromImage,
} from '../../lib/predictors'
import { getTheme } from '../../lib/themes'
import PhotoUpload from './photo-upload.svelte'
import PredictionSteps from './prediction-steps.svelte'
import ResultPreview from './result-preview.svelte'

let selectedThemeId = 'kyute'
let imageUrl: string | null = null
let isDragging = false
let isProcessing = false
let predictions: Predictions | null = null
let error: string | null = null
let fileInput: HTMLInputElement | null = null
let isThemeDropdownOpen = false
let themeDropdownButton: HTMLButtonElement | null = null
let themeDropdownMenu: HTMLDivElement | null = null
let predictors: Predictors | null = null

const defaultPredictions: Predictions = {
  skinTone: 'medium',
  hairLength: 'medium',
  hairColor: 'brown',
  facialHair: 'facial_hair',
}

$: currentPredictions = predictions || defaultPredictions
$: currentTheme = getTheme(selectedThemeId)

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

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDragging = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDragging = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  isDragging = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
    if (fileInput) {
      fileInput.value = ''
    }
  }
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile()
      if (file) {
        handleFile(file)
        if (fileInput) {
          fileInput.value = ''
        }
      }
      break
    }
  }
}

async function handleFile(file: File) {
  error = null

  if (!validateImageFile(file)) {
    error = 'Please upload an image file'
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      imageUrl = null
    }
    return
  }

  if (imageUrl) {
    URL.revokeObjectURL(imageUrl)
  }

  try {
    imageUrl = URL.createObjectURL(file)
    await processImage(file)
  } catch (err) {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      imageUrl = null
    }
    error = 'Failed to load image. Please try a different file.'
  }
}

async function processImage(file: File) {
  if (!predictors) {
    error = 'Predictors not loaded yet. Please wait...'
    return
  }

  isProcessing = true
  error = null

  try {
    const img = await createImageFromFile(file)
    predictions = await predictFromImage(predictors, img)
    console.log('New predictions:', predictions)
  } catch (err) {
    console.error('Prediction error:', err)
    error = 'Failed to process image. Please try again with a different image.'
    predictions = null
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      imageUrl = null
    }
  } finally {
    isProcessing = false
  }
}

onDestroy(() => {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl)
  }
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (
    isThemeDropdownOpen &&
    themeDropdownButton &&
    themeDropdownMenu &&
    !themeDropdownButton.contains(target) &&
    !themeDropdownMenu.contains(target)
  ) {
    isThemeDropdownOpen = false
  }
}

function selectTheme(themeId: string) {
  selectedThemeId = themeId
  isThemeDropdownOpen = false
}

function handleImageError() {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl)
    imageUrl = null
  }
  error =
    'Failed to load image. The file may be corrupted or in an unsupported format.'
}
</script>

<svelte:window onpaste={handlePaste} />

<section class="rounded-2xl border border-white/10 bg-slate-950/80 py-10 px-2 shadow-xl shadow-pink-500/5 sm:py-10 sm:px-6">
  <div class="mb-4 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200/80">Prediction Flow</p>
    <h3 class="mt-1 text-xl font-semibold text-white sm:text-2xl">Or try out experimental</h3>
  </div>

  <div class="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
    <!-- Photo -->
    <PhotoUpload
      bind:imageUrl
      bind:isDragging
      bind:isProcessing
      bind:error
      bind:fileInput
      onFileSelect={handleFile}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onImageError={handleImageError}
    />

    <!-- Connector: Photo -> Steps with Arrow and Text -->
    <div class="flex flex-col items-center justify-center gap-2">
      <p class="text-xs font-medium text-white">Let's detect!</p>
      <svg class="h-8 w-12 rotate-90 text-pink-300 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>

    <!-- Steps -->
    <PredictionSteps predictions={currentPredictions} theme={currentTheme} themeName={selectedThemeId} />

    <!-- Connector: Steps -> Result with Arrow and Text -->
    <div class="flex flex-col items-center justify-center gap-2">
      <p class="text-xs font-medium text-white">Mix it up!</p>
      <svg class="h-8 w-12 rotate-90 text-pink-300 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>

    <!-- Result -->
    <ResultPreview
      predictions={currentPredictions}
      bind:selectedThemeId
      bind:isThemeDropdownOpen
      bind:themeDropdownButton
      bind:themeDropdownMenu
      onThemeSelect={selectTheme}
      onDropdownToggle={() => (isThemeDropdownOpen = !isThemeDropdownOpen)}
      onClickOutside={handleClickOutside}
    />
  </div>
</section>
