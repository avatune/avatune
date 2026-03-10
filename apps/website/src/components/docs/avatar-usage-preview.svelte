<script lang="ts">
import ashleySeoTheme from '@avatune/ashley-seo-theme/svelte'
import ashleyyTheme from '@avatune/ashleyy-theme/svelte'
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/svelte'
import pawelOlekWomanTheme from '@avatune/pawel-olek-woman-theme/svelte'
import { Avatar } from '@avatune/svelte'
import yanliuTheme from '@avatune/yanliu-theme/svelte'

const themeMap = {
  yanliu: yanliuTheme,
  miniavs: miniavsTheme,
  nevmstas: nevmstasTheme,
  micah: micahTheme,
  kyute: kyuteTheme,
  pacovqzz: pacovqzzTheme,
  'fatin-verse': fatinVerseTheme,
  'pawel-olek-man': pawelOlekManTheme,
  'pawel-olek-woman': pawelOlekWomanTheme,
  'ashley-seo': ashleySeoTheme,
  ashleyy: ashleyyTheme,
} as const

type AvatarUsageThemeId = keyof typeof themeMap

export let seed: string
export let size: number = 200
export let themeId: AvatarUsageThemeId = 'nevmstas'

$: selectedTheme = themeMap[themeId] ?? nevmstasTheme
</script>

<div class="avatar-usage-preview">
  <Avatar theme={selectedTheme} seed={seed} size={size} />
</div>

<style>
  .avatar-usage-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;
  }
</style>

