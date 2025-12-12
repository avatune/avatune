import { type RefObject, useCallback, useState } from 'react'
import type { Asset } from '../types'

interface UseDragOptions {
  canvasRef: RefObject<HTMLDivElement | null>
  previewSize: number
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
  selectedAsset: Asset | null
}

interface UseDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent, asset: Asset) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: () => void
}

export const useDrag = ({
  canvasRef,
  previewSize,
  onAssetUpdate,
  selectedAsset,
}: UseDragOptions): UseDragReturn => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, asset: Asset) => {
      e.stopPropagation()
      setIsDragging(true)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setDragStart({
          x: e.clientX - (rect.left + (asset.xPercent / 100) * previewSize),
          y: e.clientY - (rect.top + (asset.yPercent / 100) * previewSize),
        })
      }
    },
    [canvasRef, previewSize],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedAsset || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left - dragStart.x) / previewSize) * 100
      const y = ((e.clientY - rect.top - dragStart.y) / previewSize) * 100

      onAssetUpdate(selectedAsset.id, {
        xPercent: Math.max(-50, Math.min(50, Math.round(x * 100) / 100)),
        yPercent: Math.max(-50, Math.min(50, Math.round(y * 100) / 100)),
      })
    },
    [
      isDragging,
      selectedAsset,
      canvasRef,
      dragStart,
      previewSize,
      onAssetUpdate,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
