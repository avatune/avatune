import { type RefObject, useCallback, useEffect, useState } from 'react'
import type { Asset } from '../types'

interface UseDragOptions {
  canvasRef: RefObject<HTMLDivElement | null>
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
}

interface UseDragReturn {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent, asset: Asset) => void
}

export const useDrag = ({
  canvasRef,
  onAssetUpdate,
}: UseDragOptions): UseDragReturn => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, asset: Asset) => {
      e.stopPropagation()
      e.preventDefault()
      setIsDragging(true)
      setDraggedAsset(asset)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        // Store offset from click position to asset top-left
        const assetX = rect.left + (asset.xPercent / 100) * rect.width
        const assetY = rect.top + (asset.yPercent / 100) * rect.height
        setDragStart({
          x: e.clientX - assetX,
          y: e.clientY - assetY,
        })
      }
    },
    [canvasRef],
  )

  // Use document-level events to handle drag even when mouse leaves canvas
  useEffect(() => {
    if (!isDragging || !draggedAsset) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()

      // Calculate position relative to canvas top-left (0-100%)
      const x = ((e.clientX - dragStart.x - rect.left) / rect.width) * 100
      const y = ((e.clientY - dragStart.y - rect.top) / rect.height) * 100

      onAssetUpdate(draggedAsset.id, {
        // Allow some overflow for positioning assets partially outside canvas
        xPercent: Math.max(-20, Math.min(100, Math.round(x * 100) / 100)),
        yPercent: Math.max(-20, Math.min(100, Math.round(y * 100) / 100)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setDraggedAsset(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, draggedAsset, canvasRef, dragStart, onAssetUpdate])

  return {
    isDragging,
    handleMouseDown,
  }
}
