<script lang="ts">
import type { FrameworkDefinition } from '../../lib/create-avatar-showcase'

interface Props {
  framework: FrameworkDefinition
  highlightedCode: string
}

const { framework, highlightedCode }: Props = $props()
</script>

<div>
	<div class="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950">
		<div class="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
			<div class="flex gap-1.5">
				<div class="h-3 w-3 rounded-full bg-pink-300"></div>
				<div class="h-3 w-3 rounded-full bg-pink-300"></div>
				<div class="h-3 w-3 rounded-full bg-pink-300"></div>
			</div>
			<div class="flex-1 text-center">
				<span class="font-mono text-xs text-slate-400">{framework.filePath}</span>
			</div>
			<div class="w-12"></div>
		</div>
		<div class="min-h-[200px] overflow-x-auto">
			{@html highlightedCode}
		</div>
	</div>
</div>

<style>
	:global(.shiki) {
		margin: 0;
		padding: 1rem;
		background: transparent !important;
	}
</style>

