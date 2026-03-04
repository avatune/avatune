import { useEffect } from 'react'
import type { Asset } from '../types'

interface UseKeyboardNavigationOptions {
  selectedAsset: Asset | null
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
}

export const useKeyboardNavigation = ({
  selectedAsset,
  onAssetUpdate,
}: UseKeyboardNavigationOptions): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAsset) return

      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
        return

      const step = e.shiftKey ? 1 : 0.5
      let newX = selectedAsset.xPercent
      let newY = selectedAsset.yPercent

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          newX -= step
          break
        case 'ArrowRight':
          e.preventDefault()
          newX += step
          break
        case 'ArrowUp':
          e.preventDefault()
          newY -= step
          break
        case 'ArrowDown':
          e.preventDefault()
          newY += step
          break
        default:
          return
      }

      onAssetUpdate(selectedAsset.id, {
        // Allow some overflow for positioning assets partially outside canvas
        xPercent: Math.max(-20, Math.min(100, Math.round(newX * 100) / 100)),
        yPercent: Math.max(-20, Math.min(100, Math.round(newY * 100) / 100)),
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAsset, onAssetUpdate])
}
