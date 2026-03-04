import { useCallback, useEffect, useState } from 'react'
import type { Asset } from '../types'

interface UseResizeOptions {
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
}

interface UseResizeReturn {
  isResizing: boolean
  resizingAssetId: string | null
  handleResizeStart: (e: React.MouseEvent, asset: Asset) => void
}

export const useResize = ({
  onAssetUpdate,
}: UseResizeOptions): UseResizeReturn => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizingAsset, setResizingAsset] = useState<Asset | null>(null)
  const [startDistance, setStartDistance] = useState(0)
  const [startScale, setStartScale] = useState(1)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })

  const handleResizeStart = useCallback((e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const assetEl = target.closest('[data-asset-wrapper]') as HTMLElement
    if (!assetEl) return

    const rect = assetEl.getBoundingClientRect()
    const ox = rect.left
    const oy = rect.top

    const dx = e.clientX - ox
    const dy = e.clientY - oy
    const distance = Math.sqrt(dx * dx + dy * dy)

    setOrigin({ x: ox, y: oy })
    setStartDistance(distance)
    setStartScale(asset.scale ?? 1)
    setResizingAsset(asset)
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing || !resizingAsset) return

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - origin.x
      const dy = e.clientY - origin.y
      const currentDistance = Math.sqrt(dx * dx + dy * dy)

      const ratio = currentDistance / startDistance
      const newScale =
        Math.round(Math.max(0.1, Math.min(5, startScale * ratio)) * 100) / 100

      onAssetUpdate(resizingAsset.id, { scale: newScale })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizingAsset(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    isResizing,
    resizingAsset,
    origin,
    startDistance,
    startScale,
    onAssetUpdate,
  ])

  return {
    isResizing,
    resizingAssetId: resizingAsset?.id ?? null,
    handleResizeStart,
  }
}
