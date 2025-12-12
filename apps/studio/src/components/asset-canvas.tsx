import { useRef } from 'react'
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
}

const getAssetPosition = (asset: Asset, previewSize: number) => {
  const baseX = previewSize * 0.5
  const baseY = previewSize * 0.5
  return {
    left: baseX + (asset.xPercent / 100) * previewSize,
    top: baseY + (asset.yPercent / 100) * previewSize,
  }
}

export const AssetCanvas = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onAssetUpdate,
  previewSize = 400,
  borderRadius = '100%',
  zoom = 1,
}: AssetCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const scaledSize = previewSize * zoom

  const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag({
      canvasRef,
      previewSize: scaledSize,
      onAssetUpdate,
      selectedAsset,
    })

  useKeyboardNavigation({
    selectedAsset,
    onAssetUpdate,
  })

  const sortedAssets = [...assets].sort((a, b) => a.layer - b.layer)

  return (
    <div
      className="overflow-auto mx-auto"
      style={{
        maxWidth: '100%',
        maxHeight: '80vh',
      }}
    >
      <div
        ref={canvasRef}
        className="relative bg-white/5 border-2 border-white/20 overflow-hidden mx-auto"
        style={{
          width: scaledSize,
          height: scaledSize,
          borderRadius,
          transformOrigin: 'top left',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          const position = getAssetPosition(asset, scaledSize)
          const isSelected = selectedAsset?.id === asset.id

          return (
            // biome-ignore lint/a11y/useSemanticElements: This is a draggable element, div is appropriate
            <div
              key={asset.id}
              className={`transition-transform ${isSelected ? 'outline-2 outline-pink-400 outline-offset-2' : ''}`}
              style={{
                position: 'absolute',
                left: `${position.left}px`,
                top: `${position.top}px`,
                transform: `translate(-50%, -50%) scale(${zoom})`,
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
              {isSelected && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 px-2 py-1 rounded text-xs whitespace-nowrap z-1000">
                  <div className="font-semibold mb-1">{asset.name}</div>
                  <div className="text-xs opacity-80 mb-1">
                    X: {asset.xPercent.toFixed(2)}% Y:{' '}
                    {asset.yPercent.toFixed(2)}%
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <label htmlFor={`layer-${asset.id}`} className="opacity-80">
                      Layer:
                    </label>
                    <input
                      id={`layer-${asset.id}`}
                      type="number"
                      value={asset.layer}
                      onChange={(e) =>
                        onAssetUpdate(asset.id, {
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
        })}
      </div>
    </div>
  )
}
