<script lang="ts">
import ashleySeoTheme from '@avatune/ashley-seo-theme/svelte'
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/svelte'
import pawelOlekWomanTheme from '@avatune/pawel-olek-woman-theme/svelte'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import { createHighlighter } from 'shiki'
import {
  extractCategories,
  frameworks,
  generateSnippet,
  type ThemeInfo,
  themeInfos,
} from '../../lib/create-avatar-showcase'
import AvatarPreview from './avatar-preview.svelte'
import CategoryTabs from './category-tabs.svelte'
import CodeDisplay from './code-display.svelte'
import FrameworkSelector from './framework-selector.svelte'
import ThemeSelector from './theme-selector.svelte'

const themeMap: Record<string, unknown> = {
  kyute: kyuteTheme,
  micah: micahTheme,
  miniavs: miniavsTheme,
  pacovqzz: pacovqzzTheme,
  yanliu: yanliuTheme,
  nevmstas: nevmstasTheme,
  fatinVerse: fatinVerseTheme,
  ashleySeo: ashleySeoTheme,
  pawelOlekMan: pawelOlekManTheme,
  pawelOlekWoman: pawelOlekWomanTheme,
}

let selectedThemeId = 'kyute'
let selectedFrameworkId = 'react'
let selections: Record<string, string> = {}
let highlightedCode = ''
let selectedCategoryTab: string | null = null
let seed = 'my-avatar'
let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

$: selectedThemeInfo =
  themeInfos.find((t) => t.id === selectedThemeId) ?? themeInfos[0]
$: selectedFramework =
  frameworks.find((f) => f.id === selectedFrameworkId) ?? frameworks[0]
$: svelteTheme = themeMap[selectedThemeId] ?? themeMap.kyute
$: allCategories = extractCategories(svelteTheme as Record<string, unknown>)
$: categories = allCategories.filter(
  (cat) => cat.items.length > 1 || cat.optional,
)
$: avatarProps = Object.fromEntries(
  Object.entries(selections).filter(([_, v]) => v && v !== 'none'),
)
$: if (selectedCategoryTab === null && categories.length > 0) {
  selectedCategoryTab = categories[0].id
}
$: if (selectedCategoryTab === 'seed' && categories.length === 0) {
  selectedCategoryTab = null
}

// Initialize Shiki highlighter
createHighlighter({
  themes: ['github-dark'],
  langs: ['tsx', 'html', 'ts', 'javascript', 'typescript'],
}).then((h) => {
  highlighter = h
  // Trigger initial code highlighting after highlighter is ready
  updateHighlightedCode(
    selectedFrameworkId,
    selectedThemeInfo,
    selections,
    seed,
  )
})

// Update highlighted code when dependencies change (only if highlighter is ready)
$: if (highlighter) {
  updateHighlightedCode(
    selectedFrameworkId,
    selectedThemeInfo,
    selections,
    seed,
  )
}

async function updateHighlightedCode(
  frameworkId: string,
  themeInfo: ThemeInfo,
  currentSelections: Record<string, string>,
  currentSeed: string,
) {
  if (!highlighter) {
    // Highlighter not ready yet, use plain text
    const framework =
      frameworks.find((f) => f.id === frameworkId) ?? frameworks[0]
    const snippet = generateSnippet(
      frameworkId,
      themeInfo,
      currentSelections,
      currentSeed,
    )
    highlightedCode = `<pre class="shiki"><code>${snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    return
  }

  const framework =
    frameworks.find((f) => f.id === frameworkId) ?? frameworks[0]
  const snippet = generateSnippet(
    frameworkId,
    themeInfo,
    currentSelections,
    currentSeed,
  )
  // Use html for vue/svelte, tsx for react/react-native, ts for vanilla js
  const lang =
    framework.language === 'vue' || framework.language === 'svelte'
      ? 'html'
      : framework.language === 'tsx'
        ? 'tsx'
        : 'typescript'
  try {
    const html = highlighter.codeToHtml(snippet, {
      lang,
      theme: 'github-dark',
    })
    highlightedCode = html
  } catch (error) {
    // Fallback to plain text if highlighting fails
    console.error('Code highlighting failed:', error)
    highlightedCode = `<pre class="shiki"><code>${snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  }
}

function selectTheme(id: string) {
  selectedThemeId = id
  selections = {}
  selectedCategoryTab = null
}

function selectFramework(id: string) {
  selectedFrameworkId = id
}

function onItemSelect(category: string, item: string) {
  selections = { ...selections, [category]: item }
}

function onItemDeselect(category: string) {
  const newSelections = { ...selections }
  delete newSelections[category]
  selections = newSelections
}

function generateRandomSeed(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

function onRandomSeed() {
  seed = generateRandomSeed()
}

$: themes = themeInfos.map((info) => ({
  info,
  theme: themeMap[info.id] ?? themeMap.kyute,
}))
</script>

<div class="mt-8 space-y-4">
	<ThemeSelector
		{themes}
		{selectedThemeId}
		onSelect={selectTheme}
	/>

	<!-- Avatar Preview and Category Tabs -->
	<div class="flex flex-col gap-4 lg:flex-row">
		<AvatarPreview theme={svelteTheme} {seed} {avatarProps} />

		<CategoryTabs
			{categories}
			{selectedCategoryTab}
			{selections}
			theme={svelteTheme}
			{seed}
			onCategorySelect={(id) => (selectedCategoryTab = id)}
			onItemSelect={onItemSelect}
			onItemDeselect={onItemDeselect}
			onSeedChange={(newSeed) => (seed = newSeed)}
			onRandomSeed={onRandomSeed}
		/>
	</div>

	<FrameworkSelector
		{frameworks}
		{selectedFrameworkId}
		onSelect={selectFramework}
	/>

	<CodeDisplay framework={selectedFramework} {highlightedCode} />
</div>
