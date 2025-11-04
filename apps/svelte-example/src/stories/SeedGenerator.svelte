<script lang="ts">
import flatTheme from '@avatune/flat-design-theme/svelte'
import sketchTheme from '@avatune/sketch-black-white-theme/svelte'
import { Avatar } from '@avatune/svelte'

let seed = $state('hello-world')
let selectedTheme = $state<'sketch' | 'flat'>('sketch')

const currentTheme = $derived(
  selectedTheme === 'sketch' ? sketchTheme : flatTheme,
)
</script>

<div style="padding: 2rem; text-align: center">
  <div style="margin-bottom: 2rem">
    <Avatar theme={currentTheme} {seed} width={300} height={300} />
  </div>

  <div style="max-width: 400px; margin: 0 auto">
    <label
      for="theme"
      style="display: block; font-weight: bold; margin-bottom: 0.5rem"
    >
      Theme:
    </label>
    <select
      id="theme"
      bind:value={selectedTheme}
      style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 1rem"
    >
      <option value="sketch">Sketch Black & White</option>
      <option value="flat">Flat Design</option>
    </select>

    <label
      for="seed"
      style="display: block; font-weight: bold; margin-bottom: 0.5rem"
    >
      Seed Phrase:
    </label>
    <input
      id="seed"
      type="text"
      bind:value={seed}
      placeholder="Enter a seed phrase..."
      style="width: 100%; padding: 0.75rem; font-size: 1rem; border-radius: 4px; border: 1px solid #ccc; font-family: monospace"
    />
    <p style="margin-top: 1rem; font-size: 0.875rem; color: #666">
      Try different phrases to generate unique avatars deterministically!
    </p>
  </div>
</div>
