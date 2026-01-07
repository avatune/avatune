import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Asset, CategoryId, ThemeData } from '../../../../types'
import { CATEGORIES } from '../../../../types'
import { Button, Card, Input, StepHeader } from '../../../ui'
import { AssetCanvas } from './asset-canvas'
import { AssetInfo } from './asset-info'
import { CategorySelector } from './category-selector'
import { ZoomControls } from './zoom-controls'

const PREVIEW_SIZE = 500

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

  const calculatedSize = useMemo(() => Math.round(PREVIEW_SIZE / zoom), [zoom])

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    const newSize = Math.round(PREVIEW_SIZE / newZoom)
    onThemeSettingsChange(newSize, themeData.borderRadius, themeData.themeName)
  }

  const handleSizeChange = (newSize: number) => {
    const newZoom = PREVIEW_SIZE / newSize
    setZoom(newZoom)
    onThemeSettingsChange(newSize, themeData.borderRadius, themeData.themeName)
  }

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

  const getSelectedIndexForCategory = useCallback(
    (categoryId: CategoryId | null) => {
      if (!categoryId) return 0
      return selectedAssetIndexes[categoryId] ?? 0
    },
    [selectedAssetIndexes],
  )

  const categoryAssets = useMemo(
    () => getCategoryAssets(selectedCategory),
    [getCategoryAssets, selectedCategory],
  )

  const selectedAssetIndex = useMemo(
    () => getSelectedIndexForCategory(selectedCategory),
    [getSelectedIndexForCategory, selectedCategory],
  )

  const currentCategoryAsset = useMemo(
    () =>
      categoryAssets.length > 0
        ? categoryAssets[selectedAssetIndex % categoryAssets.length]
        : null,
    [categoryAssets, selectedAssetIndex],
  )

  const displayAssets = useMemo(() => {
    const assets: Asset[] = []
    if (themeData.headAsset) {
      assets.push(themeData.headAsset)
    }
    CATEGORIES.filter((category) => category.id !== 'head').forEach(
      (category) => {
        const assetsForCategory = getCategoryAssets(category.id)
        if (assetsForCategory.length === 0) return
        const selectedIndex = Math.min(
          getSelectedIndexForCategory(category.id),
          assetsForCategory.length - 1,
        )
        assets.push(assetsForCategory[selectedIndex])
      },
    )
    return assets
  }, [themeData.headAsset, getCategoryAssets, getSelectedIndexForCategory])

  useEffect(() => {
    if (themeData.headAsset && selectedCategory === null) {
      setSelectedCategory('head')
      setSelectedAsset(themeData.headAsset)
    }
  }, [themeData.headAsset, selectedCategory])

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
  }, [selectedCategory, getCategoryAssets])

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

  const handleSelectAsset = useCallback(
    (asset: Asset) => {
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
    },
    [getCategoryAssets],
  )

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    setSelectedCategory(categoryId)
  }, [])

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (!selectedCategory) return
      setSelectedAssetIndexes((prev) => ({
        ...prev,
        [selectedCategory]: newIndex,
      }))
    },
    [selectedCategory],
  )

  return (
    <Card>
      <StepHeader
        title="Step 3: Preview & Adjust"
        description="Select a category to adjust. Use arrow keys or drag to adjust position. Hold Shift for larger steps."
      />

      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          {/* Canvas on the left */}
          <div className="flex justify-center lg:justify-start">
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

          {/* Controls on the right */}
          <div className="flex flex-col gap-6">
            <ZoomControls
              calculatedSize={calculatedSize}
              onSizeChange={handleSizeChange}
              previewSize={PREVIEW_SIZE}
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

            {selectedCategory && categoryAssets.length > 0 && (
              <AssetInfo
                asset={currentCategoryAsset}
                category={selectedCategory}
                onAssetUpdate={onAssetUpdate}
              />
            )}
          </div>
        </div>
      </div>

      <CategorySelector
        selectedCategory={selectedCategory}
        categoryAssets={categoryAssets}
        selectedAssetIndex={selectedAssetIndex}
        onCategorySelect={handleCategorySelect}
        onIndexChange={handleIndexChange}
        getCategoryAssets={getCategoryAssets}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full sm:w-auto cursor-pointer"
        >
          Back
        </Button>
        <Button onClick={onNext} className="w-full sm:w-auto cursor-pointer">
          Continue to Save
        </Button>
      </div>
    </Card>
  )
}

export default PreviewStep
