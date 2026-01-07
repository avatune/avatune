import type { Asset, CategoryId } from '../../../../types'
import { CardSection } from '../../../ui'

interface AssetInfoProps {
  asset: Asset | null
  category: CategoryId | null
  onAssetUpdate: (assetId: string, updates: Partial<Asset>) => void
}

export const AssetInfo = ({
  asset,
  category,
  onAssetUpdate,
}: AssetInfoProps) => {
  if (!asset || !category) return null

  return (
    <CardSection>
      <h3 className="mb-4 text-base sm:text-lg font-semibold wrap-break-word">
        {/* Sweater asset from the Head category */}
        <span className="text-pink-200">{asset.name}</span> asset from the{' '}
        <span className="text-pink-200">{category}</span> category{' '}
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center py-2 border-b border-white/10 gap-2">
          <span className="font-medium opacity-80 text-sm sm:text-base">
            Position:
          </span>
          <span className="font-mono text-xs sm:text-sm break-all text-right">
            X: {asset.xPercent.toFixed(2)}%, Y: {asset.yPercent.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center py-2 gap-2">
          <label
            htmlFor={`layer-${asset.id}`}
            className="font-medium opacity-80 text-sm sm:text-base"
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
            className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center text-sm focus:outline-none focus:border-pink-400"
          />
        </div>
      </div>
    </CardSection>
  )
}
