<script lang="ts">
import { onDestroy, onMount } from 'svelte'

export let totalCombinations: number
export let duration = 3000
export let startOnMount = false

let counterElement: HTMLSpanElement | null = null
let observer: IntersectionObserver | null = null
let animationFrame = 0
let hasAnimated = false

let displayValue = '0'

const updateDisplay = (value: number) => {
  displayValue = value.toLocaleString('en-US')
}

const smoothProgress = (t: number) => 1 - (1 - t) ** 3

const runCounterAnimation = () => {
  const target = totalCombinations
  const startTime = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1)
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

onMount(() => {
  if (startOnMount) {
    startCounter()
    return
  }

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
    { threshold: 0.3 },
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
})
</script>

<span
  class="inline-block font-bold text-pink-400 w-30"
  bind:this={counterElement}
  aria-live="polite"
>
  {displayValue}+
</span>

