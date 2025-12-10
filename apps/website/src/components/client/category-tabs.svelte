<script lang="ts">
import { Avatar } from '@avatune/svelte'
import type { ThemeCategory } from '../../lib/create-avatar-showcase'

interface Props {
  categories: ThemeCategory[]
  selectedCategoryTab: string | null
  selections: Record<string, string>
  theme: unknown
  seed: string
  onCategorySelect: (categoryId: string) => void
  onItemSelect: (category: string, item: string) => void
  onItemDeselect: (category: string) => void
  onSeedChange: (seed: string) => void
  onRandomSeed: () => void
}

const {
  categories,
  selectedCategoryTab,
  selections,
  theme,
  seed,
  onCategorySelect,
  onItemSelect,
  onItemDeselect,
  onSeedChange,
  onRandomSeed,
}: Props = $props()

function formatItemName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function getPreviewProps(
  categoryId: string,
  item: string,
): Record<string, string> {
  const previewProps: Record<string, string> = {}
  // Include all current selections except the one we're previewing
  for (const [key, value] of Object.entries(selections)) {
    if (key !== categoryId && value && value !== 'none') {
      previewProps[key] = value
    }
  }
  // Add the preview item
  previewProps[categoryId] = item
  return previewProps
}
</script>

{#if categories.length > 0}
	<div class="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl lg:w-2/3">
		<div class="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
			<div class="flex-1 text-center">
				<span class="text-xs font-medium text-slate-400">Customize</span>
			</div>
			<div class="w-12"></div>
		</div>

		<div class="flex flex-col">
			<!-- Tabs -->
			<div class="flex flex-wrap gap-1.5 border-b border-white/10 bg-slate-900/40 px-4 py-2.5">
				{#each categories as category}
					<button
						type="button"
						class={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all ${
							selectedCategoryTab === category.id
								? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
								: 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
						}`}
						onclick={() => onCategorySelect(category.id)}
					>
						{category.label}
					</button>
				{/each}
				<!-- Seed Tab -->
				<button
					type="button"
					class={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all ${
						selectedCategoryTab === 'seed'
							? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
							: 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
					}`}
					onclick={() => onCategorySelect('seed')}
				>
					Try random
				</button>
			</div>

			<!-- Tab Content: Cards Grid (Scrollable) or Seed Control -->
			{#if selectedCategoryTab === 'seed'}
				<!-- Seed Control Content -->
				<div class="p-4">
					<div class="flex flex-wrap items-center gap-2">
						<input
							type="text"
							value={seed}
							oninput={(e) => onSeedChange((e.target as HTMLInputElement).value)}
							class="h-8 flex-1 min-w-[200px] rounded-md border border-white/10 bg-slate-800/60 px-2.5 text-xs text-slate-300 transition-all focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
							placeholder="Try your own seed (email, username, etc.)"
						/>
						<button
							type="button"
							class="flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-slate-800/60 px-2.5 text-xs font-medium text-slate-400 transition-all hover:bg-slate-700/60 hover:text-white"
							onclick={onRandomSeed}
						>
							Randomize
						</button>
					</div>
				</div>
			{:else if selectedCategoryTab}
				{@const activeCategory = categories.find((c) => c.id === selectedCategoryTab)}
				{#if activeCategory}
					<div class="max-h-[200px] overflow-y-auto p-4">
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{#if activeCategory.optional}
								<!-- None option -->
								<button
									type="button"
									class={`group flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
										selections[activeCategory.id] === 'none'
											? 'border-pink-500/50 bg-pink-500/10 ring-1 ring-pink-500/30'
											: 'border-white/10 bg-slate-800/60 hover:border-white/20 hover:bg-slate-700/60'
									}`}
									onclick={() => onItemDeselect(activeCategory.id)}
								>
									<div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-slate-900/50">
										<span class="text-xs text-slate-500">None</span>
									</div>
									<span class="text-xs font-medium text-slate-300">None</span>
								</button>
							{/if}

							{#each activeCategory.items as item}
								{@const previewProps = getPreviewProps(activeCategory.id, item)}
								{@const isSelected = selections[activeCategory.id] === item}
								<button
									type="button"
									class={`group flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
										isSelected
											? 'border-pink-500/50 bg-pink-500/10 ring-1 ring-pink-500/30'
											: 'border-white/10 bg-slate-800/60 hover:border-white/20 hover:bg-slate-700/60'
									}`}
									onclick={() => onItemSelect(activeCategory.id, item)}
								>
									<div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-slate-900/50">
										{#if theme}
											<Avatar
												theme={theme}
												seed="preview"
												size={64}
												{...previewProps}
											/>
										{/if}
									</div>
									<span class="text-xs font-medium text-slate-300">{formatItemName(item)}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

