'use client'

import Image from 'next/image'
import { useState } from 'react'

const avatarUrl = '/api/svg/?theme=yanliu&seed=user-123&size=200'

export function ApiClientDemo() {
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchAvatar() {
    setLoading(true)
    setSvg(null)

    try {
      const response = await fetch(avatarUrl)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      setSvg(await response.text())
    } catch {
      // The existing demo intentionally has no visible error state.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="not-content my-6">
      <div className="flex min-h-[280px] flex-col items-center justify-center">
        {svg ? (
          <Image
            className="h-[200px] w-[200px]"
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
            alt="Generated Yanliu avatar"
            width={200}
            height={200}
            unoptimized
          />
        ) : (
          <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full border border-white/5 bg-gray-800/50" />
        )}

        <button
          type="button"
          onClick={fetchAvatar}
          disabled={loading}
          className="mt-6 cursor-pointer bg-gray-700 px-6 py-2.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Avatar'}
        </button>
      </div>
    </div>
  )
}
