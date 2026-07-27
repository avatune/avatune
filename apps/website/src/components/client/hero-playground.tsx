'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { extractCategories } from '@/lib/create-avatar-showcase'
import { themeInfos, themeMap } from '@/lib/theme-registry.generated'

const Avatar = dynamic(
  () => import('@avatune/react').then((module) => module.Avatar),
  { ssr: false },
)

const tabBase =
  'cursor-pointer rounded-md border-none bg-transparent px-3 py-1.5 font-code text-[11.5px] tracking-[0.06em] whitespace-nowrap hover:bg-paper-3'
const optionBase =
  'pg-frame-checker relative aspect-square cursor-pointer rounded-[10px] border border-line bg-[#0c0c0c] p-0 transition hover:-translate-y-px hover:border-line-strong [&>.thumb>svg]:block [&>.thumb>svg]:h-[78%] [&>.thumb>svg]:w-[78%] [&>.thumb>svg]:max-h-[56px] [&>.thumb>svg]:max-w-[56px]'
const optionActive = 'border-ink bg-[#181818]'
const buttonClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line-2 bg-paper-3 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px'
const primaryButtonClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-ink bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-paper transition hover:border-white hover:bg-white active:translate-y-px'

export function HeroPlayground() {
  const [selectedThemeId, setSelectedThemeId] = useState('pacovqzz')
  const [seed, setSeed] = useState('try-your-name')
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('theme')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  const fallbackTheme = themeMap.kyute
  if (!fallbackTheme) throw new Error('Missing theme: kyute')
  const selectedTheme = themeMap[selectedThemeId] ?? fallbackTheme
  const categories = useMemo(
    () =>
      extractCategories(selectedTheme as unknown as Record<string, unknown>),
    [selectedTheme],
  )
  const tabs = useMemo(
    () => [
      { id: 'theme', label: 'Theme' },
      ...categories.map((category) => ({
        id: category.id,
        label: category.label,
      })),
    ],
    [categories],
  )
  const activeCategory = categories.find(
    (category) => category.id === activeTab,
  )
  const avatarProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selections).filter(([, value]) => Boolean(value)),
      ),
    [selections],
  )

  const updateTabScroll = useCallback(() => {
    const element = tabsRef.current
    if (!element) return

    setCanScrollLeft(element.scrollLeft > 1)
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    )
  }, [])

  useEffect(() => {
    const element = tabsRef.current
    if (!element) return

    updateTabScroll()
    element.addEventListener('scroll', updateTabScroll)
    window.addEventListener('resize', updateTabScroll)

    return () => {
      element.removeEventListener('scroll', updateTabScroll)
      window.removeEventListener('resize', updateTabScroll)
    }
  }, [updateTabScroll])

  function scrollTabs(direction: -1 | 1) {
    const element = tabsRef.current
    if (!element) return

    element.scrollBy({
      left: direction * Math.max(160, element.clientWidth * 0.6),
      behavior: 'smooth',
    })
  }

  function pickTheme(themeId: string) {
    setSelectedThemeId(themeId)
    setActiveTab('theme')
    setSelections({})
  }

  function pickOption(categoryId: string, value: string) {
    setSelections((current) => ({ ...current, [categoryId]: value }))
  }

  async function copyProps() {
    const payload = JSON.stringify(
      { theme: selectedThemeId, seed, ...avatarProps },
      null,
      2,
    )

    try {
      await navigator.clipboard.writeText(payload)
      window.dispatchEvent(
        new CustomEvent('avatune:toast', {
          detail: 'Copied avatar config',
        }),
      )
    } catch {
      return
    }
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-line-2 [background:linear-gradient(180deg,#131313_0%,#0d0d0d_100%)]">
      <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5 font-code text-[11.5px] tracking-[0.06em] text-ink-3">
        <span className="h-2 w-2 rounded-[2px] bg-line-2" />
        <span className="h-2 w-2 rounded-[2px] bg-line-2" />
        <span className="h-2 w-2 rounded-[2px] bg-line-2" />
        <span className="ml-1.5">playground · live</span>
        <span className="flex-1" />
        <span className="text-ink-3">seed:</span>
        <span className="text-ink">{seed}</span>
      </div>

      <div className="grid min-h-[480px] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-[18px] border-b border-line p-6 [background:radial-gradient(60%_60%_at_50%_40%,rgba(25,179,133,0.06),transparent_70%),#0e0e0e] md:border-r md:border-b-0">
          <div className="pg-frame-checker relative grid h-60 w-60 place-items-center overflow-hidden rounded-full border border-line-2 [&>*]:relative [&>*]:z-[1]">
            <Avatar
              key={`${selectedThemeId}-${seed}-${JSON.stringify(avatarProps)}`}
              theme={selectedTheme}
              seed={seed}
              size={220}
              {...avatarProps}
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 font-code text-[11px] tracking-[0.16em] uppercase text-ink-3">
            <span>Live preview · 220×220</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 bg-[#101010] p-5">
          <div className="relative border-b border-line">
            <div
              ref={tabsRef}
              className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${tabBase} ${
                    activeTab === tab.id
                      ? 'bg-paper-card text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)]'
                      : 'text-ink-3 hover:text-ink-2'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => scrollTabs(-1)}
                className="absolute top-0 bottom-2 left-0 flex w-8 cursor-pointer items-center justify-start border-0 pl-0.5 text-ink-2 [background:linear-gradient(to_right,#101010_55%,transparent)] hover:text-ink"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => scrollTabs(1)}
                className="absolute top-0 right-0 bottom-2 flex w-8 cursor-pointer items-center justify-end border-0 pr-0.5 text-ink-2 [background:linear-gradient(to_left,#101010_55%,transparent)] hover:text-ink"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {activeTab === 'theme' &&
              themeInfos.map((themeInfo) => (
                <button
                  key={themeInfo.id}
                  type="button"
                  className={`${optionBase} ${
                    selectedThemeId === themeInfo.id ? optionActive : ''
                  }`}
                  title={themeInfo.label}
                  onClick={() => pickTheme(themeInfo.id)}
                >
                  <span className="thumb pointer-events-none inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                    <Avatar
                      key={themeInfo.id}
                      theme={themeMap[themeInfo.id] ?? fallbackTheme}
                      seed={seed}
                      size={48}
                    />
                  </span>
                </button>
              ))}

            {activeTab !== 'theme' &&
              activeCategory &&
              [
                ...(activeCategory.optional ? ['none'] : []),
                ...activeCategory.items,
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${optionBase} ${
                    selections[activeCategory.id] === option ? optionActive : ''
                  }`}
                  title={option}
                  onClick={() => pickOption(activeCategory.id, option)}
                >
                  <span className="thumb pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                    <Avatar
                      key={`${selectedThemeId}-${activeCategory.id}-${option}-${seed}`}
                      theme={selectedTheme}
                      seed={seed}
                      size={48}
                      {...avatarProps}
                      {...{ [activeCategory.id]: option }}
                    />
                  </span>
                </button>
              ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => setSeed(Math.random().toString(36).slice(2, 10))}
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
                <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
                <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
              </svg>
              Shuffle
            </button>
            <span className="flex-1" />
            <button
              type="button"
              className={primaryButtonClass}
              onClick={copyProps}
            >
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
