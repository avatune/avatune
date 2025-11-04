<script lang="ts">
import theme from '@avatune/sketch-black-white-theme/svelte'
import { Avatar } from '@avatune/svelte'

let seed = $state('hello-world')
</script>

<div style="padding: 2rem; text-align: center">
  <div style="margin-bottom: 2rem">
    <Avatar {theme} {seed} width={300} height={300} />
  </div>

  <div style="max-width: 400px; margin: 0 auto">
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
