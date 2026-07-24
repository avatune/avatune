'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FrameworkShowcaseEntry } from '@/lib/framework-showcase'

interface FrameworksTabsProps {
  entries: FrameworkShowcaseEntry[]
}

const tabBase =
  'flex shrink-0 cursor-pointer items-center gap-2.5 border-0 border-r border-line px-[22px] py-4 text-sm font-medium whitespace-nowrap transition'
const tabIdle = 'bg-transparent text-ink-3 hover:bg-paper-3 hover:text-ink-2'
const tabActive =
  'bg-[#131313] text-ink shadow-[inset_0_-2px_0_var(--color-ink)]'
const buttonClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px'

export function FrameworksTabs({ entries }: FrameworksTabsProps) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? 'react')
  const [copied, setCopied] = useState(false)
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0]

  if (!active) return null
  const activeEntry = active

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(activeEntry.snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
      window.dispatchEvent(
        new CustomEvent('avatune:toast', {
          detail: `Copied ${activeEntry.label} snippet`,
        }),
      )
    } catch {
      return
    }
  }

  async function copyInstall() {
    const command = `npm i ${activeEntry.pkg}`

    try {
      await navigator.clipboard.writeText(command)
      window.dispatchEvent(
        new CustomEvent('avatune:toast', { detail: `Copied ${command}` }),
      )
    } catch {
      return
    }
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-[#0d0d0d]">
      <div className="flex overflow-x-auto border-b border-line">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setActiveId(entry.id)}
            className={`${tabBase} ${activeId === entry.id ? tabActive : tabIdle}`}
          >
            {entry.logo && (
              <Image
                src={entry.logo.src}
                alt={entry.logo.alt}
                width={18}
                height={18}
                className={activeId === entry.id ? 'opacity-100' : 'opacity-70'}
              />
            )}
            {entry.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-[320px] grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-center gap-[18px] border-b border-line p-8 lg:border-r lg:border-b-0">
          <div className="font-display text-[32px] leading-tight tracking-[-0.02em]">
            {active.tagline}
          </div>

          <div className="flex flex-col gap-2.5 font-code text-[11.5px] text-ink-3">
            <div className="flex items-baseline gap-3.5">
              <span className="w-[60px] shrink-0 text-ink-4">package</span>
              <span className="min-w-0 truncate text-ink-2">{active.pkg}</span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-[60px] shrink-0 text-ink-4">size</span>
              <span className="text-ink-2">
                {active.size}
                <span className="text-ink-4">gzipped</span>
              </span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-[60px] shrink-0 text-ink-4">deps</span>
              <span className="text-ink-2">{active.deps}</span>
            </div>
            <div className="flex items-baseline gap-3.5">
              <span className="w-[60px] shrink-0 text-ink-4">since</span>
              <span className="text-ink-2">{active.since}</span>
            </div>
          </div>

          <div>
            <button type="button" className={buttonClass} onClick={copyInstall}>
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
                <path d="m4 17 6-6-6-6" />
                <path d="M12 19h8" />
              </svg>
              <code className="font-code text-[12px]">npm i {active.pkg}</code>
            </button>
          </div>
        </div>

        <div className="bg-paper p-6">
          <div className="code-shell rounded-xl border border-line bg-[#0c0c0c]">
            <div className="flex items-center gap-3 border-b border-line px-3.5 py-2.5 text-ink-3">
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink-3"
              >
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
              </svg>
              <span className="font-code text-[11.5px] text-ink-2">
                {active.filePath}
              </span>
              <button
                type="button"
                className="ml-auto cursor-pointer rounded-md border border-line-2 bg-transparent px-2.5 py-1 font-code text-[11px] text-ink-2 transition hover:border-line-strong hover:text-ink"
                onClick={copySnippet}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki renders trusted local snippets.
              dangerouslySetInnerHTML={{ __html: active.highlightedSnippet }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
