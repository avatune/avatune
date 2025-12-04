<script lang="ts">
import { Avatar } from '@avatune/svelte'

interface Props {
  theme: unknown
  seed: string
  avatarProps: Record<string, string>
}

const { theme, seed, avatarProps }: Props = $props()
</script>

<div class="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl lg:w-1/3">
	<div class="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
		<div class="flex gap-1.5">
			<div class="h-3 w-3 rounded-full bg-pink-300"></div>
			<div class="h-3 w-3 rounded-full bg-pink-300"></div>
			<div class="h-3 w-3 rounded-full bg-pink-300"></div>
		</div>
		<div class="flex-1 text-center">
			<span class="text-xs font-medium text-slate-400">Avatar Preview</span>
		</div>
		<div class="w-12"></div>
	</div>

	<div class="flex min-h-[200px] flex-col items-center justify-center bg-linear-to-br from-slate-900/50 to-slate-950 p-6 sm:p-8">
		{#if theme}
			{#key JSON.stringify(avatarProps) + seed}
				<Avatar theme={theme} seed={seed} size={200} {...avatarProps} />
			{/key}
		{/if}
	</div>
</div>

