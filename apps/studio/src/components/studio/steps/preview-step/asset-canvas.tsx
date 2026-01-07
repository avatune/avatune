import { useEffect, useRef } from 'react'
import { useDrag } from '../../../../hooks/use-drag'
import { useKeyboardNavigation } from '../../../../hooks/use-keyboard-navigation'
import type { Asset } from '../../../../types'

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

const getAssetPosition = (asset: Asset) => {
  return {
    left: `${asset.xPercent}%`,
    top: `${asset.yPercent}%`,
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
      className="mx-auto relative w-full"
      style={{
        maxWidth: `${previewSize}px`,
        maxHeight: '80vh',
      }}
    >
      <div
        ref={canvasRef}
        className="relative bg-white/5 border-2 border-white/20 overflow-hidden mx-auto w-full"
        style={{
          maxWidth: `${previewSize}px`,
          width: 'min(100%, 500px)',
          aspectRatio: '1 / 1',
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
          const position = getAssetPosition(asset)

          return (
            // biome-ignore lint/a11y/useSemanticElements: This is a draggable element, div is appropriate
            <div
              key={asset.id}
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
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
                className="max-w-[200px] max-h-[200px] w-auto h-auto pointer-events-none"
                style={{
                  maxWidth: 'min(200px, 40vw)',
                  maxHeight: 'min(200px, 40vw)',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
