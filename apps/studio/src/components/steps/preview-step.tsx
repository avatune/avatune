import { useEffect, useState } from 'react'
import type { Asset, CategoryId, ThemeData } from '../../types'
import { CATEGORIES } from '../../types'
import { AssetCanvas } from '../asset-canvas'
import { Button, Card, CardSection, Input, StepHeader } from '../ui'

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
  const [zoom, setZoom] = useState(1)

  const PREVIEW_SIZE = 500
  // Calculate theme canvas size based on zoom
  // When zoom is 2x, assets appear twice as big, so theme size should be half
  const calculatedSize = Math.round(PREVIEW_SIZE / zoom)

  // Update theme size when zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    const newSize = Math.round(PREVIEW_SIZE / newZoom)
    onThemeSettingsChange(newSize, themeData.borderRadius, themeData.themeName)
  }

  // Get assets for selected category
  const getCategoryAssets = (categoryId: CategoryId | null) => {
    if (!categoryId) return []
    // Head asset is stored separately
    if (categoryId === 'head') {
      return themeData.headAsset ? [themeData.headAsset] : []
    }
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

  return (
    <Card>
      <StepHeader
        title="Step 3: Preview & Adjust"
        description="Select a category to adjust. Use arrow keys or drag to adjust position. Hold Shift for larger steps."
      />

      <div className="mb-8">
        <div className="mb-2 font-medium text-slate-300">
          Select Category to Adjust
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
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
            <Button
              variant="small"
              onClick={() =>
                setSelectedAssetIndex(
                  (prev) =>
                    (prev - 1 + categoryAssets.length) % categoryAssets.length,
                )
              }
            >
              ← Previous
            </Button>
            <span className="font-semibold min-w-[60px] text-center">
              {selectedAssetIndex + 1} / {categoryAssets.length}
            </span>
            <Button
              variant="small"
              onClick={() =>
                setSelectedAssetIndex(
                  (prev) => (prev + 1) % categoryAssets.length,
                )
              }
            >
              Next →
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
          <Input
            id="theme-name-preview"
            label="Theme Name"
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
          <Input
            id="border-radius"
            label="Border Radius"
            value={themeData.borderRadius}
            onChange={(e) =>
              onThemeSettingsChange(themeData.size, e.target.value)
            }
            placeholder="100%"
          />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleZoomChange(Math.max(0.25, zoom - 0.25))}
            className="w-8 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors flex items-center justify-center text-lg font-bold"
            aria-label="Zoom out"
          >
            −
          </button>
          <div className="text-center">
            <span className="text-sm text-slate-300 min-w-[60px] font-mono block">
              {Math.round(zoom * 100)}%
            </span>
            <span className="text-xs text-slate-500">
              Size: {calculatedSize}px
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleZoomChange(Math.min(4, zoom + 0.25))}
            className="w-8 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors flex items-center justify-center text-lg font-bold"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleZoomChange(1)}
            className="px-3 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors text-xs"
            aria-label="Reset zoom"
          >
            Reset
          </button>
        </div>

        <AssetCanvas
          assets={displayAssets}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          onAssetUpdate={onAssetUpdate}
          borderRadius={themeData.borderRadius}
          previewSize={PREVIEW_SIZE}
          zoom={zoom}
          onZoomChange={handleZoomChange}
        />
      </div>

      {selectedCategory && categoryAssets.length > 0 && (
        <CardSection className="mt-8">
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
        </CardSection>
      )}

      <div className="flex gap-4 mt-8">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Continue to Save</Button>
      </div>
    </Card>
  )
}

export default PreviewStep
