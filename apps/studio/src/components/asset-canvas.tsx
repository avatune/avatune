import { useEffect, useRef } from 'react'
import { useDrag } from '../hooks/use-drag'
import { useKeyboardNavigation } from '../hooks/use-keyboard-navigation'
import type { Asset } from '../types'

interface AssetCanvasProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
  previewSize?: number
  borderRadius?: string
  zoom?: number
  onZoomChange?: (zoom: number) => void
}

/**
 * Calculate asset position in pixels from percentage.
 * Uses top-left based positioning to match the theme renderer.
 * xPercent/yPercent represent percentage from canvas top-left (0-100).
 */
const getAssetPosition = (asset: Asset, size: number) => {
  return {
    left: (asset.xPercent / 100) * size,
    top: (asset.yPercent / 100) * size,
  }
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 10

export const AssetCanvas = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onAssetUpdate,
  previewSize = 200,
  borderRadius = '100%',
  zoom = 1,
  onZoomChange,
}: AssetCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { isDragging, handleMouseDown } = useDrag({
    canvasRef,
    onAssetUpdate,
  })

  // Use native event listener with passive: false to prevent browser zoom
  useEffect(() => {
    const container = containerRef.current
    if (!container || !onZoomChange) return

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta))
      onZoomChange(newZoom)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [zoom, onZoomChange])

  useKeyboardNavigation({
    selectedAsset,
    onAssetUpdate,
  })

  const sortedAssets = [...assets].sort((a, b) => a.layer - b.layer)

  return (
    <div
      ref={containerRef}
      className="mx-auto relative"
      style={{
        maxWidth: '100%',
        maxHeight: '80vh',
      }}
    >
      {/* Fixed-size canvas that clips content */}
      <div
        ref={canvasRef}
        className="relative bg-white/5 border-2 border-white/20 overflow-hidden mx-auto"
        style={{
          width: previewSize,
          height: previewSize,
          borderRadius,
        }}
        role="application"
        aria-label="Preview canvas for positioning assets"
      >
        {/* Center crosshair */}
        <div
          className="canvas-center"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
        <div
          className="canvas-center-h"
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '1px',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
        <div
          className="canvas-center-v"
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: '100%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
        {sortedAssets.map((asset) => {
          const position = getAssetPosition(asset, previewSize)

          return (
            // biome-ignore lint/a11y/useSemanticElements: This is a draggable element, div is appropriate
            <div
              key={asset.id}
              style={{
                position: 'absolute',
                left: `${position.left}px`,
                top: `${position.top}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: asset.layer,
              }}
              onMouseDown={(e) => {
                onSelectAsset(asset)
                handleMouseDown(e, asset)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectAsset(asset)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Asset ${asset.name}, drag to reposition`}
            >
              <img
                src={asset.dataUrl}
                alt={asset.name}
                className="max-w-[200px] max-h-[200px] pointer-events-none"
              />
            </div>
          )
        })}
      </div>

      {/* Tooltip positioned outside the canvas to avoid clipping */}
      {selectedAsset && (
        <div
          className="absolute left-1/2 bg-black/90 px-3 py-2 rounded text-xs whitespace-nowrap z-50"
          style={{
            transform: 'translateX(-50%)',
            top: previewSize + 16,
          }}
        >
          <div className="font-semibold mb-1">{selectedAsset.name}</div>
          <div className="text-xs opacity-80 mb-1">
            X: {selectedAsset.xPercent.toFixed(2)}% Y:{' '}
            {selectedAsset.yPercent.toFixed(2)}%
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor={`layer-${selectedAsset.id}`} className="opacity-80">
              Layer:
            </label>
            <input
              id={`layer-${selectedAsset.id}`}
              type="number"
              value={selectedAsset.layer}
              onChange={(e) =>
                onAssetUpdate(selectedAsset.id, {
                  layer: Number(e.target.value),
                })
              }
              min="0"
              max="100"
              className="w-16 px-1 py-0.5 bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:border-pink-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
