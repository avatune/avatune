<script lang="ts">
import type { FrameworkDefinition } from '../../lib/create-avatar-showcase'

interface Props {
  frameworks: FrameworkDefinition[]
  selectedFrameworkId: string
  onSelect: (id: string) => void
}

const { frameworks, selectedFrameworkId, onSelect }: Props = $props()
</script>

<div>
	<p class="mb-2 text-sm font-medium text-slate-400">Framework</p>
	<div class="flex flex-wrap justify-around gap-1.5 sm:justify-start">
		{#each frameworks as framework}
			<button
				type="button"
				class={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all ${
					selectedFrameworkId === framework.id
						? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
						: 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
				}`}
				onclick={() => onSelect(framework.id)}
			>
				{#if framework.logo}
					<img src={framework.logo.src} alt={framework.logo.alt} class="h-5 w-5 shrink-0 object-contain" />
				{/if}
				<span class="hidden sm:inline">{framework.label}</span>
			</button>
		{/each}
	</div>
</div>

