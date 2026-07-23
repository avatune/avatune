'use client'

import { useEffect, useRef, useState } from 'react'

type ToastItem = { id: number; message: string }

export function Toast() {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (typeof detail !== 'string' || detail.length === 0) return

      const id = nextId.current++
      setItems((current) => [...current, { id, message: detail }])
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id))
      }, 2400)
    }

    window.addEventListener('avatune:toast', onToast)
    return () => window.removeEventListener('avatune:toast', onToast)
  }, [])

  return (
    <div
      className="pointer-events-none fixed right-5 bottom-5 z-[100] flex flex-col gap-2"
      aria-live="polite"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex items-center gap-2 rounded-lg border border-line-2 bg-[rgba(20,20,20,0.96)] px-4 py-2.5 font-code text-[12px] tracking-[0.04em] text-ink shadow-2xl backdrop-blur-md"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-mark"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  )
}
