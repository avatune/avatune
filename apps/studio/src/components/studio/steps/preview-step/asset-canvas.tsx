import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrag } from '../../../../hooks/use-drag'
import { useHitTest } from '../../../../hooks/use-hit-test'
import { useKeyboardNavigation } from '../../../../hooks/use-keyboard-navigation'
import { useResize } from '../../../../hooks/use-resize'
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

const HANDLE_SIZE = 8

const ResizeHandles = ({
  onResizeStart,
  asset,
}: {
  onResizeStart: (e: React.MouseEvent, asset: Asset) => void
  asset: Asset
}) => {
  const handleStyle = (
    position: Record<string, string | undefined>,
  ): React.CSSProperties => ({
    position: 'absolute',
    width: `${HANDLE_SIZE}px`,
    height: `${HANDLE_SIZE}px`,
    background: 'rgba(236, 72, 153, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '2px',
    pointerEvents: 'auto',
    zIndex: 1,
    ...position,
  })

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handles are mouse-only */}
      <div
        key="tl"
        style={handleStyle({
          top: '-5px',
          left: '-5px',
          cursor: 'nwse-resize',
        })}
        onMouseDown={(e) => onResizeStart(e, asset)}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handles are mouse-only */}
      <div
        key="tr"
        style={handleStyle({
          top: '-5px',
          right: '-5px',
          cursor: 'nesw-resize',
        })}
        onMouseDown={(e) => onResizeStart(e, asset)}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handles are mouse-only */}
      <div
        key="bl"
        style={handleStyle({
          bottom: '-5px',
          left: '-5px',
          cursor: 'nesw-resize',
        })}
        onMouseDown={(e) => onResizeStart(e, asset)}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handles are mouse-only */}
      <div
        key="br"
        style={handleStyle({
          bottom: '-5px',
          right: '-5px',
          cursor: 'nwse-resize',
        })}
        onMouseDown={(e) => onResizeStart(e, asset)}
      />
    </>
  )
}

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

  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null)

  const { isDragging, draggedAssetId, handleMouseDown } = useDrag({
    canvasRef,
    onAssetUpdate,
  })

  const { isResizing, resizingAssetId, handleResizeStart } = useResize({
    onAssetUpdate,
  })

  const { findAssetAtPoint } = useHitTest({
    canvasRef,
    assets,
    zoom,
    onHitAsset: onSelectAsset,
  })

  const handleCanvasMouseMove = useCallback(
    async (e: React.MouseEvent) => {
      if (isDragging || isResizing) return
      const hit = await findAssetAtPoint(e.clientX, e.clientY)
      setHoveredAssetId(hit?.id ?? null)
    },
    [isDragging, isResizing, findAssetAtPoint],
  )

  const handleCanvasMouseLeave = useCallback(() => {
    if (!isDragging && !isResizing) {
      setHoveredAssetId(null)
    }
  }, [isDragging, isResizing])

  const handleCanvasMouseDown = useCallback(
    async (e: React.MouseEvent) => {
      const hit = await findAssetAtPoint(e.clientX, e.clientY)
      if (hit) {
        onSelectAsset(hit)
        handleMouseDown(e, hit)
      }
    },
    [findAssetAtPoint, onSelectAsset, handleMouseDown],
  )

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
          cursor:
            isDragging || isResizing
              ? 'grabbing'
              : hoveredAssetId
                ? 'grab'
                : 'default',
        }}
        role="application"
        aria-label="Preview canvas for positioning assets"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        onMouseDown={handleCanvasMouseDown}
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
          const isHovered = hoveredAssetId === asset.id
          const isBeingDragged = draggedAssetId === asset.id
          const isBeingResized = resizingAssetId === asset.id
          const isSelected = selectedAsset?.id === asset.id
          const showOutline = isHovered || isBeingDragged || isBeingResized
          const showHandles = isSelected && !isDragging && !isResizing

          return (
            // biome-ignore lint/a11y/useSemanticElements: This is a positioned asset wrapper, not a real button
            <div
              key={asset.id}
              data-asset-wrapper
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                transform: `scale(${zoom * (asset.scale ?? 1)})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
                zIndex: asset.layer,
                outline: showOutline
                  ? '2px solid rgba(236, 72, 153, 0.6)'
                  : isSelected
                    ? '1px solid rgba(236, 72, 153, 0.3)'
                    : 'none',
                outlineOffset: '2px',
                borderRadius: '4px',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Asset ${asset.name}, drag to reposition`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectAsset(asset)
                }
              }}
            >
              <img
                src={asset.dataUrl}
                alt={asset.name}
                className="w-auto h-auto pointer-events-none"
                style={{
                  maxWidth: `${previewSize}px`,
                  maxHeight: `${previewSize}px`,
                }}
                draggable={false}
              />
              {showHandles && (
                <ResizeHandles
                  onResizeStart={handleResizeStart}
                  asset={asset}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
