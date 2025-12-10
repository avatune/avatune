import { useEffect, useRef, useState } from 'react'
import type { Asset, CategoryId, ThemeData } from '../types'
import { CATEGORIES } from '../types'

interface PreviewStepProps {
  themeData: ThemeData
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
  onAssetRemove: (assetId: string) => void
  onNext: () => void
  onBack: () => void
  onThemeSettingsChange: (
    size: number,
    borderRadius: string,
    themeName?: string,
  ) => void
}

const PreviewStep = ({
  themeData,
  onAssetUpdate,
  onNext,
  onBack,
  onThemeSettingsChange,
}: PreviewStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null,
  )
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const previewSize = 400

  // Get assets for selected category (excluding head)
  const getCategoryAssets = (categoryId: CategoryId | null) => {
    if (!categoryId) return []
    return themeData.assets.filter((asset) => asset.category === categoryId)
  }

  const categoryAssets = getCategoryAssets(selectedCategory)
  const currentCategoryAsset =
    categoryAssets.length > 0
      ? categoryAssets[selectedAssetIndex % categoryAssets.length]
      : null

  // Assets to display: head (always) + current category asset
  const displayAssets: Asset[] = []
  if (themeData.headAsset) {
    displayAssets.push(themeData.headAsset)
  }
  if (currentCategoryAsset) {
    displayAssets.push(currentCategoryAsset)
  }

  const sortedAssets = [...displayAssets].sort((a, b) => a.layer - b.layer)

  // Update selected asset when category or index changes
  useEffect(() => {
    if (currentCategoryAsset) {
      setSelectedAsset(currentCategoryAsset)
    } else if (themeData.headAsset) {
      setSelectedAsset(themeData.headAsset)
    } else {
      setSelectedAsset(null)
    }
  }, [currentCategoryAsset, themeData.headAsset])

  // Reset index when category changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedCategory is intentionally the only dependency
  useEffect(() => {
    setSelectedAssetIndex(0)
  }, [selectedCategory])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAsset) return

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
        xPercent: Math.round(newX * 100) / 100,
        yPercent: Math.round(newY * 100) / 100,
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAsset, onAssetUpdate])

  const handleMouseDown = (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation()
    setSelectedAsset(asset)
    setIsDragging(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: e.clientX - (rect.left + (asset.xPercent / 100) * previewSize),
        y: e.clientY - (rect.top + (asset.yPercent / 100) * previewSize),
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedAsset || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left - dragStart.x) / previewSize) * 100
    const y = ((e.clientY - rect.top - dragStart.y) / previewSize) * 100

    onAssetUpdate(selectedAsset.id, {
      xPercent: Math.max(-50, Math.min(50, Math.round(x * 100) / 100)),
      yPercent: Math.max(-50, Math.min(50, Math.round(y * 100) / 100)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getAssetPosition = (asset: Asset) => {
    const baseX = previewSize * 0.5
    const baseY = previewSize * 0.5
    return {
      left: baseX + (asset.xPercent / 100) * previewSize,
      top: baseY + (asset.yPercent / 100) * previewSize,
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Step 3: Preview & Adjust
      </h2>
      <p className="text-slate-300 mb-8">
        Select a category to adjust. Use arrow keys or drag to adjust position.
        Hold Shift for larger steps.
      </p>

      <div className="mb-8">
        <div className="mb-2 font-medium text-slate-300">
          Select Category to Adjust
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((cat) => cat.id !== 'head').map((category) => {
            const categoryAssets = getCategoryAssets(category.id)
            const isSelected = selectedCategory === category.id
            return (
              <button
                key={category.id}
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
                    : categoryAssets.length === 0
                      ? 'bg-slate-800/60 text-slate-400 opacity-40 cursor-not-allowed'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                disabled={categoryAssets.length === 0}
              >
                {category.label}
                {categoryAssets.length > 0 && (
                  <span className="ml-1 text-xs opacity-70">
                    ({categoryAssets.length})
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {selectedCategory && categoryAssets.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-white/5 rounded-lg">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all"
              onClick={() =>
                setSelectedAssetIndex(
                  (prev) =>
                    (prev - 1 + categoryAssets.length) % categoryAssets.length,
                )
              }
            >
              ← Previous
            </button>
            <span className="font-semibold min-w-[60px] text-center">
              {selectedAssetIndex + 1} / {categoryAssets.length}
            </span>
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all"
              onClick={() =>
                setSelectedAssetIndex(
                  (prev) => (prev + 1) % categoryAssets.length,
                )
              }
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
          <div>
            <label
              htmlFor="theme-name-preview"
              className="block mb-2 font-medium text-slate-300"
            >
              Theme Name
            </label>
            <input
              id="theme-name-preview"
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400 focus:bg-white/15"
              value={themeData.themeName}
              onChange={(e) => {
                onThemeSettingsChange(
                  themeData.size,
                  themeData.borderRadius,
                  e.target.value,
                )
              }}
              placeholder="my-theme"
            />
          </div>
          <div>
            <label
              htmlFor="canvas-size"
              className="block mb-2 font-medium text-slate-300"
            >
              Canvas Size
            </label>
            <input
              id="canvas-size"
              type="number"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400 focus:bg-white/15"
              value={themeData.size}
              onChange={(e) =>
                onThemeSettingsChange(
                  Number(e.target.value),
                  themeData.borderRadius,
                )
              }
              min="100"
              max="1000"
              step="50"
            />
          </div>
          <div>
            <label
              htmlFor="border-radius"
              className="block mb-2 font-medium text-slate-300"
            >
              Border Radius
            </label>
            <input
              id="border-radius"
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400 focus:bg-white/15"
              value={themeData.borderRadius}
              onChange={(e) =>
                onThemeSettingsChange(themeData.size, e.target.value)
              }
              placeholder="100%"
            />
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative bg-white/5 border-2 border-white/20 rounded-xl overflow-hidden mx-auto"
          style={{ width: previewSize, height: previewSize }}
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
            const position = getAssetPosition(asset)
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
                  transform: 'translate(-50%, -50%)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  zIndex: asset.layer,
                }}
                onMouseDown={(e) => handleMouseDown(e, asset)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedAsset(asset)
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
                      <label
                        htmlFor={`layer-${asset.id}`}
                        className="opacity-80"
                      >
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

      {selectedCategory && categoryAssets.length > 0 && (
        <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
          <h3 className="mb-4 text-lg font-semibold text-pink-200">
            Current Asset: {currentCategoryAsset?.name}
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium opacity-80">Category:</span>
              <span className="font-mono text-pink-200">
                {selectedCategory}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium opacity-80">Position:</span>
              <span className="font-mono text-pink-200">
                X: {currentCategoryAsset?.xPercent.toFixed(2)}%, Y:{' '}
                {currentCategoryAsset?.yPercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium opacity-80">Layer:</span>
              <span className="font-mono text-pink-200">
                {currentCategoryAsset?.layer}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-pink-400 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-pink-300 hover:scale-105"
          onClick={onNext}
        >
          Continue to Save
        </button>
      </div>
    </div>
  )
}

export default PreviewStep
