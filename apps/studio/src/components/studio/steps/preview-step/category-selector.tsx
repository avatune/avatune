import type { Asset, CategoryId } from '../../../../types'
import { CATEGORIES } from '../../../../types'

interface CategorySelectorProps {
  selectedCategory: CategoryId | null
  categoryAssets: Asset[]
  selectedAssetIndex: number
  onCategorySelect: (categoryId: CategoryId) => void
  onIndexChange: (newIndex: number) => void
  getCategoryAssets: (categoryId: CategoryId) => Asset[]
}

export const CategorySelector = ({
  selectedCategory,
  categoryAssets,
  selectedAssetIndex,
  onCategorySelect,
  onIndexChange,
  getCategoryAssets,
}: CategorySelectorProps) => {
  return (
    <div className="mb-8">
      <div className="mb-2 font-medium text-slate-300">
        Select Category to Adjust
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const assets = getCategoryAssets(category.id)
          const isSelected = selectedCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-500/30'
                  : assets.length === 0
                    ? 'bg-slate-800/60 text-slate-400 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white'
              }`}
              onClick={() => onCategorySelect(category.id)}
              disabled={assets.length === 0}
            >
              <span className="whitespace-nowrap">{category.label}</span>
              {assets.length > 0 && (
                <span className="ml-1 text-xs opacity-70">
                  ({assets.length})
                </span>
              )}
            </button>
          )
        })}
      </div>
      {selectedCategory && categoryAssets.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 font-medium text-slate-300">
            Select Asset ({selectedAssetIndex + 1} / {categoryAssets.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryAssets.map((asset, index) => {
              const isSelected = selectedAssetIndex === index
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onIndexChange(index)}
                  className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/30'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white'
                  }`}
                >
                  <span className="whitespace-nowrap">{asset.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
