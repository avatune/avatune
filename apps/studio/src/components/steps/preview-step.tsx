import { useCallback, useEffect, useState } from 'react'
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
  const [selectedAssetIndexes, setSelectedAssetIndexes] = useState<
    Partial<Record<CategoryId, number>>
  >({})
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [zoom, setZoom] = useState(1)

  // Responsive preview size - will be handled by CSS in AssetCanvas
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
  const getCategoryAssets = useCallback(
    (categoryId: CategoryId | null) => {
      if (!categoryId) return []
      // Head asset is stored separately
      if (categoryId === 'head') {
        return themeData.headAsset ? [themeData.headAsset] : []
      }
      return themeData.assets.filter((asset) => asset.category === categoryId)
    },
    [themeData.headAsset, themeData.assets],
  )

  const getSelectedIndexForCategory = (categoryId: CategoryId | null) => {
    if (!categoryId) return 0
    return selectedAssetIndexes[categoryId] ?? 0
  }

  const categoryAssets = getCategoryAssets(selectedCategory)
  const selectedAssetIndex = getSelectedIndexForCategory(selectedCategory)
  const currentCategoryAsset =
    categoryAssets.length > 0
      ? categoryAssets[selectedAssetIndex % categoryAssets.length]
      : null

  // Assets to display: head (always) + selected asset for each category
  const displayAssets: Asset[] = []
  if (themeData.headAsset) {
    displayAssets.push(themeData.headAsset)
  }
  CATEGORIES.filter((category) => category.id !== 'head').forEach(
    (category) => {
      const assetsForCategory = getCategoryAssets(category.id)
      if (assetsForCategory.length === 0) return
      const selectedIndex = Math.min(
        getSelectedIndexForCategory(category.id),
        assetsForCategory.length - 1,
      )
      displayAssets.push(assetsForCategory[selectedIndex])
    },
  )

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
    if (!selectedCategory) return
    const assetsForCategory = getCategoryAssets(selectedCategory)
    setSelectedAssetIndexes((prev) => {
      const prevIndex = prev[selectedCategory] ?? 0
      const clampedIndex = Math.min(
        prevIndex,
        Math.max(assetsForCategory.length - 1, 0),
      )
      if (prevIndex === clampedIndex) return prev
      return { ...prev, [selectedCategory]: clampedIndex }
    })
  }, [selectedCategory])

  // Clamp selected indexes if assets are added/removed
  useEffect(() => {
    setSelectedAssetIndexes((prev) => {
      let changed = false
      const next = { ...prev }
      CATEGORIES.forEach((category) => {
        if (category.id === 'head') return
        const assetsForCategory = getCategoryAssets(category.id)
        if (assetsForCategory.length === 0) {
          if (next[category.id] !== undefined) {
            delete next[category.id]
            changed = true
          }
          return
        }
        const currentIndex = next[category.id] ?? 0
        const clampedIndex = Math.min(
          currentIndex,
          assetsForCategory.length - 1,
        )
        if (clampedIndex !== currentIndex) {
          next[category.id] = clampedIndex
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [getCategoryAssets])

  const handleSelectAsset = (asset: Asset) => {
    setSelectedCategory(asset.category)
    if (asset.category !== 'head') {
      const assetsForCategory = getCategoryAssets(asset.category)
      const assetIndex = assetsForCategory.findIndex(
        (item) => item.id === asset.id,
      )
      if (assetIndex !== -1) {
        setSelectedAssetIndexes((prev) => ({
          ...prev,
          [asset.category]: assetIndex,
        }))
      }
    }
    setSelectedAsset(asset)
  }

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
                className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
                    : categoryAssets.length === 0
                      ? 'bg-slate-800/60 text-slate-400 opacity-40 cursor-not-allowed'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                disabled={categoryAssets.length === 0}
              >
                <span className="whitespace-nowrap">{category.label}</span>
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
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 p-3 sm:p-4 bg-white/5 rounded-lg">
            <Button
              variant="small"
              onClick={() => {
                if (!selectedCategory) return
                setSelectedAssetIndexes((prev) => {
                  const currentIndex = prev[selectedCategory] ?? 0
                  const newIndex =
                    (currentIndex - 1 + categoryAssets.length) %
                    categoryAssets.length
                  return { ...prev, [selectedCategory]: newIndex }
                })
              }}
            >
              <span className="hidden sm:inline">← Previous</span>
              <span className="sm:hidden">←</span>
            </Button>
            <span className="font-semibold min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
              {selectedAssetIndex + 1} / {categoryAssets.length}
            </span>
            <Button
              variant="small"
              onClick={() => {
                if (!selectedCategory) return
                setSelectedAssetIndexes((prev) => {
                  const currentIndex = prev[selectedCategory] ?? 0
                  const newIndex = (currentIndex + 1) % categoryAssets.length
                  return { ...prev, [selectedCategory]: newIndex }
                })
              }}
            >
              <span className="hidden sm:inline">Next →</span>
              <span className="sm:hidden">→</span>
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <button
            type="button"
            onClick={() => handleZoomChange(Math.max(0.25, zoom - 0.25))}
            className="w-8 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors flex items-center justify-center text-lg font-bold shrink-0"
            aria-label="Zoom out"
          >
            −
          </button>
          <div className="text-center min-w-[80px] sm:min-w-[100px]">
            <span className="text-xs sm:text-sm text-slate-300 font-mono block">
              {Math.round(zoom * 100)}%
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500">
              {calculatedSize}px
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleZoomChange(Math.min(4, zoom + 0.25))}
            className="w-8 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors flex items-center justify-center text-lg font-bold shrink-0"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleZoomChange(1)}
            className="px-2 sm:px-3 h-8 rounded-md bg-slate-800/60 border border-white/20 text-white hover:bg-slate-700/60 transition-colors text-xs shrink-0"
            aria-label="Reset zoom"
          >
            Reset
          </button>
        </div>

        <AssetCanvas
          assets={displayAssets}
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          onAssetUpdate={onAssetUpdate}
          borderRadius={themeData.borderRadius}
          previewSize={PREVIEW_SIZE}
          zoom={zoom}
          onZoomChange={handleZoomChange}
        />
      </div>

      {selectedCategory && categoryAssets.length > 0 && (
        <CardSection className="mt-8">
          <h3 className="mb-4 text-base sm:text-lg font-semibold text-pink-200 break-words">
            Current Asset: {currentCategoryAsset?.name}
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10 gap-2">
              <span className="font-medium opacity-80 text-sm sm:text-base">
                Category:
              </span>
              <span className="font-mono text-pink-200 text-xs sm:text-sm break-all text-right">
                {selectedCategory}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10 gap-2">
              <span className="font-medium opacity-80 text-sm sm:text-base">
                Position:
              </span>
              <span className="font-mono text-pink-200 text-xs sm:text-sm break-all text-right">
                X: {currentCategoryAsset?.xPercent.toFixed(2)}%, Y:{' '}
                {currentCategoryAsset?.yPercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 gap-2">
              <span className="font-medium opacity-80 text-sm sm:text-base">
                Layer:
              </span>
              <span className="font-mono text-pink-200 text-xs sm:text-sm">
                {currentCategoryAsset?.layer}
              </span>
            </div>
          </div>
        </CardSection>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
        <Button variant="ghost" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button onClick={onNext} className="w-full sm:w-auto">
          Continue to Save
        </Button>
      </div>
    </Card>
  )
}

export default PreviewStep
