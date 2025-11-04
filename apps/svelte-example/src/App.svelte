<script lang="ts">
import theme from '@avatune/sketch-black-white-theme/svelte'
import { Avatar } from '@avatune/svelte'
</script>

<div class="content">
  <h2>Custom Avatar Example</h2>
  <Avatar
    {theme}
    ears="round"
    eyebrows="bold"
    eyes="standard"
    hair="star"
    head="oval"
    mouth="smirk"
    noses="sharp"
  />

  <h2>Random Avatar (tag-based)</h2>
  <Avatar {theme} seed="random-seed-123" />
</div>
