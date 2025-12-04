<script lang="ts">
import { Avatar } from '@avatune/svelte'
import type { ThemeInfo } from '../../lib/create-avatar-showcase'

interface Props {
  themes: Array<{ info: ThemeInfo; theme: unknown }>
  selectedThemeId: string
  onSelect: (id: string) => void
}

const { themes, selectedThemeId, onSelect }: Props = $props()
</script>

<div>
	<p class="mb-2 text-sm font-medium text-slate-400">Theme</p>
	<div class="flex flex-wrap justify-around gap-1.5 sm:justify-start">
		{#each themes as { info, theme }}
			<button
				type="button"
				class={`flex h-12 items-center gap-2 rounded-md px-3 text-xs font-medium transition-all cursor-pointer ${
					selectedThemeId === info.id
						? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
						: 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
				}`}
				onclick={() => onSelect(info.id)}
			>
				<span class="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-700/50">
					<Avatar theme={theme} seed={info.id} size={40} />
				</span>
				<span class="hidden sm:inline">{info.label}</span>
			</button>
		{/each}
	</div>
</div>

