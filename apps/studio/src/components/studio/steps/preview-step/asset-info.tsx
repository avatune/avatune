import { useRef, useState } from 'react'
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
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(asset?.name ?? '')
  const prevAssetId = useRef(asset?.id)

  if (prevAssetId.current !== asset?.id) {
    prevAssetId.current = asset?.id
    setNameValue(asset?.name ?? '')
    setEditingName(false)
  }

  if (!asset || !category) return null

  const commitName = () => {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== asset.name) {
      onAssetUpdate(asset.id, { name: trimmed })
    } else {
      setNameValue(asset.name)
    }
    setEditingName(false)
  }

  return (
    <CardSection>
      <h3 className="mb-4 h-10 text-base sm:text-lg font-semibold wrap-break-word">
        {editingName ? (
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') {
                setNameValue(asset.name)
                setEditingName(false)
              }
            }}
            ref={(el) => el?.focus()}
            className="bg-white/10 border border-pink-400 rounded px-2 py-0.5 text-pink-200 text-base sm:text-lg font-semibold focus:outline-none w-full"
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="text-pink-200 hover:text-pink-100 underline decoration-dotted underline-offset-4 cursor-text"
              title="Click to rename"
            >
              {asset.name}
            </button>{' '}
            asset from the <span className="text-pink-200">{category}</span>{' '}
            category
          </>
        )}
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
        <div className="flex justify-between items-center py-2 border-b border-white/10 gap-2">
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
        <div className="flex justify-between items-center py-2 gap-2">
          <label
            htmlFor={`scale-${asset.id}`}
            className="font-medium opacity-80 text-sm sm:text-base"
          >
            Scale:
          </label>
          <input
            id={`scale-${asset.id}`}
            type="number"
            value={asset.scale ?? 1}
            onChange={(e) => {
              const val = Number.parseFloat(e.target.value)
              if (!Number.isNaN(val) && val > 0) {
                onAssetUpdate(asset.id, { scale: val })
              }
            }}
            min="0.1"
            max="5"
            step="0.1"
            className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center text-sm focus:outline-none focus:border-pink-400"
          />
        </div>
      </div>
    </CardSection>
  )
}
