<script lang="ts">
import ashleySeoTheme from '@avatune/ashley-seo-theme/svelte'
import fatinVerseTheme from '@avatune/fatin-verse-theme/svelte'
import kyuteTheme from '@avatune/kyute-theme/svelte'
import micahTheme from '@avatune/micah-theme/svelte'
import miniavsTheme from '@avatune/miniavs-theme/svelte'
import nevmstasTheme from '@avatune/nevmstas-theme/svelte'
import pacovqzzTheme from '@avatune/pacovqzz-theme/svelte'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/svelte'
import { Avatar } from '@avatune/svelte'
import yanliuTheme from '@avatune/yanliu-theme/svelte'
import { onMount } from 'svelte'
import { fade } from 'svelte/transition'

const themes = [
  nevmstasTheme,
  miniavsTheme,
  yanliuTheme,
  micahTheme,
  kyuteTheme,
  pacovqzzTheme,
  fatinVerseTheme,
  pawelOlekManTheme,
  ashleySeoTheme,
]

const AVATAR_COUNT = 20
const MIN_SIZE = 80
const MAX_SIZE = 180
const FADE_DURATION = 2000

interface ActiveAvatar {
  id: number
  x: number
  y: number
  size: number
  theme: unknown
  seed: string
  rotation: number
  endRotation: number
}

let activeAvatars: ActiveAvatar[] = []
let nextId = 1
let containerWidth = 0
let containerHeight = 0

const creationTimers = new Set<ReturnType<typeof setTimeout>>()

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const randomTheme = () => themes[getRandomInt(0, themes.length - 1)]
const randomSeed = () => Math.random().toString(36).slice(2, 9)
const containerReady = () => containerWidth > 0 && containerHeight > 0

function checkCollision(x: number, y: number, size: number, buffer = 5) {
  return activeAvatars.some((other) => {
    const dx = x - other.x
    const dy = y - other.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDistance = size / 2 + other.size / 2 + buffer
    return distance < minDistance
  })
}

function getValidPosition(size: number) {
  if (!containerReady()) return null

  const maxAttempts = 50

  for (let i = 0; i < maxAttempts; i++) {
    const topPct = getRandomInt(5, 85)
    const leftPct = getRandomInt(0, 100)
    const inCenterX = leftPct > 15 && leftPct < 85
    const inCenterY = topPct > 15 && topPct < 85

    if (inCenterX && inCenterY) continue

    const x = (leftPct / 100) * containerWidth
    const y = (topPct / 100) * containerHeight

    if (!checkCollision(x, y, size)) {
      return { x, y }
    }
  }

  return null
}

const scheduleCreation = (callback: () => void, delay = 0) => {
  const timer = setTimeout(() => {
    creationTimers.delete(timer)
    callback()
  }, delay)
  creationTimers.add(timer)
}

const clearCreationTimers = () => {
  creationTimers.forEach((timer) => {
    clearTimeout(timer)
  })
  creationTimers.clear()
}

function createAvatar() {
  if (document.hidden || !containerReady()) return

  const size = getRandomInt(MIN_SIZE, MAX_SIZE)
  const pos = getValidPosition(size)

  if (!pos) {
    scheduleCreation(createAvatar, 500)
    return
  }

  const id = nextId++
  const newAvatar: ActiveAvatar = {
    id,
    x: pos.x,
    y: pos.y,
    size,
    theme: randomTheme(),
    seed: randomSeed(),
    rotation: getRandomInt(-15, 15),
    endRotation: getRandomInt(-5, 5),
  }

  activeAvatars = [...activeAvatars, newAvatar]
}

const ensureAvatarPool = () => {
  if (!containerReady()) return

  const missing = AVATAR_COUNT - activeAvatars.length

  if (missing <= 0) return

  for (let i = 0; i < missing; i++) {
    scheduleCreation(createAvatar, i * 150)
  }
}

$: if (containerReady() && activeAvatars.length < AVATAR_COUNT) {
  ensureAvatarPool()
}

onMount(() => {
  ensureAvatarPool()

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      ensureAvatarPool()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    clearCreationTimers()
  }
})
</script>

<div
  class="absolute inset-0 pointer-events-none"
  aria-hidden="true"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <div class="absolute inset-0 bg-linear-to-b from-slate-900/20 via-slate-950/60 to-slate-950 z-10"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900/50 via-slate-950/80 to-slate-950 z-0"></div>

  <div class="absolute inset-0 z-0 overflow-hidden select-none opacity-60">
    {#each activeAvatars as av (av.id)}
      <div
        class="absolute"
        style="
          top: {av.y}px;
          left: {av.x}px;
          width: {av.size}px;
          height: {av.size}px;
          transform: translate(-50%, -50%) rotate({av.rotation}deg);
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        "
        in:fade={{ duration: FADE_DURATION }}
        out:fade={{ duration: FADE_DURATION }}
      >
        <Avatar theme={av.theme} seed={av.seed} size={av.size} />
      </div>
    {/each}
  </div>
</div>


