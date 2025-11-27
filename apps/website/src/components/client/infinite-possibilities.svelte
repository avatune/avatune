<script lang="ts">
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import { Avatar } from '@avatune/svelte'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import { onDestroy, onMount } from 'svelte'
import { fade } from 'svelte/transition'

export let totalCombinations: number

const themes = [
  { label: 'Nevmstas', theme: nevmstasTheme },
  { label: 'Miniavs', theme: miniavsTheme },
  { label: 'Yanliu', theme: yanliuTheme },
  { label: 'Micah', theme: micahTheme },
  { label: 'Kyute', theme: kyuteTheme },
  { label: 'Pacovqzz', theme: pacovqzzTheme },
  { label: 'Fatin Verse', theme: fatinVerseTheme },
]

let counterElement: HTMLDivElement | null = null
let observer: IntersectionObserver | null = null
let animationFrame = 0
let avatarInterval: ReturnType<typeof setInterval> | null = null
let hasAnimated = false

let displayValue = '0'
let avatarSeed = 'preview-1'
let avatarTicker = 0
let currentThemeIndex = 0
let currentTheme = themes[currentThemeIndex]

const AVATAR_ROTATION_INTERVAL = 1000
const COUNTER_DURATION = 4200

const rotateTheme = () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length
  currentTheme = themes[currentThemeIndex]
}

const updateDisplay = (value: number) => {
  displayValue = value.toLocaleString('en-US')
}

const smoothProgress = (t: number) => 1 - (1 - t) ** 3

const runCounterAnimation = () => {
  const target = totalCombinations
  const startTime = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / COUNTER_DURATION, 1)
    const eased = smoothProgress(progress)
    const currentValue = Math.floor(target * eased)
    updateDisplay(currentValue)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    } else {
      updateDisplay(target)
    }
  }

  animationFrame = requestAnimationFrame(step)
}

const startCounter = () => {
  if (hasAnimated) return
  hasAnimated = true
  runCounterAnimation()
}

const randomSeed = () => `preview-${Math.floor(Math.random() * 100000)}`

const advanceAvatar = () => {
  rotateTheme()
  avatarSeed = randomSeed()
  avatarTicker += 1
}

const startAvatarRotation = () => {
  advanceAvatar()

  if (!avatarInterval) {
    avatarInterval = setInterval(advanceAvatar, AVATAR_ROTATION_INTERVAL)
  }
}

const stopAvatarRotation = () => {
  if (!avatarInterval) return
  clearInterval(avatarInterval)
  avatarInterval = null
}

onMount(() => {
  startAvatarRotation()

  if (!counterElement) {
    startCounter()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter()
          observer?.disconnect()
          observer = null
        }
      })
    },
    { threshold: 0.5 },
  )

  observer.observe(counterElement)
})

onDestroy(() => {
  if (observer) {
    observer.disconnect()
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  stopAvatarRotation()
})
</script>

<div class="flex w-full flex-col items-center gap-8">
  <div class="w-full space-y-4 text-center">
    <div class="relative flex h-[200px] w-full items-center justify-center">
      {#key avatarTicker}
        <div class="absolute inset-0 flex items-center justify-center" transition:fade={{ duration: 450 }}>
          <Avatar theme={currentTheme.theme} seed={avatarSeed} size={160} />
        </div>
      {/key}
    </div>
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200">Live Preview</p>
    <p class="text-base font-medium text-white">{currentTheme.label} theme</p>
    <p class="text-sm text-slate-400">Seed {avatarSeed}</p>
  </div>
  <div class="flex w-full flex-col items-center justify-center rounded-2xl bg-slate-900/60 px-8 py-6 text-center shadow-inner shadow-pink-500/10">
    <div class="text-6xl font-bold text-pink-400 sm:text-7xl" bind:this={counterElement} aria-live="polite">
      {displayValue}+
    </div>
    <div class="mt-2 text-sm uppercase tracking-wide text-slate-400">Unique Combinations</div>
  </div>
</div>


