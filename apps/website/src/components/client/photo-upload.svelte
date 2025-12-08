<script lang="ts">
import photo1 from '../../assets/prediction-2.jpg'

export let imageUrl: string | null = null
export let isDragging = false
export let isProcessing = false
export let error: string | null = null
export let fileInput: HTMLInputElement | null = null

export let onFileSelect: (file: File) => void = () => {}
export let onDragOver: (e: DragEvent) => void = () => {}
export let onDragLeave: (e: DragEvent) => void = () => {}
export let onDrop: (e: DragEvent) => void = () => {}
export let onImageError: () => void = () => {}
</script>

<div
  role="button"
  tabindex="0"
  class={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
    isDragging
      ? 'border-pink-400 bg-pink-500/10'
      : 'border-white/20 bg-slate-900/50'
  } p-3`}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Upload a photo</p>
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    onchange={(e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        onFileSelect(target.files[0])
        if (fileInput) {
          fileInput.value = ''
        }
      }
    }}
    disabled={isProcessing}
  />
  <div class="relative h-60 w-50 overflow-hidden rounded-lg">
    {#if imageUrl}
      <img
        class="h-full w-full object-cover rounded-lg object-top"
        src={imageUrl}
        alt=""
        onerror={() => {
          onImageError()
        }}
      />
      {#if isProcessing}
        <div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div class="text-center">
            <div class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
            <p class="text-xs text-white">Processing...</p>
          </div>
        </div>
      {/if}
    {:else}
      {#if error && error.includes('image')}
        <div class="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-800/50 border border-red-500/30">
          <svg class="h-12 w-12 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-xs text-red-300 text-center px-2">{error}</p>
        </div>
      {:else}
        <img
          class="h-full w-full object-cover rounded-lg object-top"
          src={photo1.src}
          alt="Portrait for prediction"
          loading="lazy"
          width={photo1.width}
          height={photo1.height}
        />
      {/if}
    {/if}
  </div>
  <button
    type="button"
    class="mt-2 rounded-md bg-pink-500/20 px-3 py-1.5 text-xs font-medium text-pink-200 hover:bg-pink-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={isProcessing}
    onclick={() => fileInput?.click()}
  >
    {imageUrl ? 'Change Photo' : 'Upload Photo'}
  </button>
</div>
