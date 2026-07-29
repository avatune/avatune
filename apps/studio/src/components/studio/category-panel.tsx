import { useEffect, useRef, useState } from 'react'

import type { Builder } from '../../hooks/use-builder'
import { CATEGORIES } from '../../types'
import { PencilIcon } from './icons'
import { PalettePanel } from './palette-panel'

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<string, string>

interface CategoryPanelProps {
  builder: Builder
}

export const CategoryPanel = ({ builder }: CategoryPanelProps) => {
  const {
    assets,
    selCat,
    selectCategory,
    selId,
    selectAsset,
    removeAsset,
    uploadFiles,
    pasteSvg,
    updateAsset,
  } = builder
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const cancelRenameRef = useRef(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!renamingId) return
    nameInputRef.current?.focus()
    nameInputRef.current?.select()
  }, [renamingId])

  const beginRename = (id: string, name: string) => {
    cancelRenameRef.current = false
    selectAsset(id)
    setDraftName(name)
    setRenamingId(id)
  }

  const finishRename = (id: string, currentName: string) => {
    if (cancelRenameRef.current) {
      cancelRenameRef.current = false
      setRenamingId(null)
      return
    }

    const name = draftName
      .trim()
      .replace(/\.svg$/i, '')
      .trim()
    if (name && name !== currentName) updateAsset(id, { name })
    setRenamingId(null)
  }

  const cancelRename = () => {
    cancelRenameRef.current = true
    setRenamingId(null)
  }

  const categoryAssets = Object.values(assets)
    .filter((asset) => asset.category === selCat)
    .sort((a, b) => a.created - b.created)

  const handlePaste = async () => {
    let text = ''
    try {
      text = await navigator.clipboard.readText()
    } catch {
      window.alert(
        'Could not read the clipboard. Grant clipboard access and try again.',
      )
      return
    }
    if (!text.includes('<svg')) {
      window.alert('The clipboard does not contain SVG markup.')
      return
    }
    pasteSvg(text)
  }

  return (
    <aside
      style={{
        background: '#ffffff',
        borderRight: '1px solid #e8e5df',
        padding: '20px 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="eyebrow" style={{ padding: '0 20px 10px' }}>
        Categories
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {CATEGORIES.map((category) => {
          const count = Object.values(assets).filter(
            (asset) => asset.category === category.id,
          ).length
          const active = selCat === category.id
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => selectCategory(category.id)}
              className={`cat-row${active ? ' active' : ''}${count ? ' filled' : ''}`}
              style={{ textAlign: 'left', font: 'inherit' }}
            >
              <span className="cat-name">{category.label}</span>
              <span className="cat-count">{count || '—'}</span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          padding: '18px 20px 8px',
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <div className="eyebrow">Assets</div>
        <div style={{ fontSize: 11, color: '#a5a19a' }}>
          {CATEGORY_LABEL[selCat]}
        </div>
      </div>

      <div
        style={{
          padding: '0 20px 12px',
          display: 'flex',
          gap: 8,
        }}
      >
        <label className="btn-soft" style={{ flex: 1 }}>
          Upload SVG
          <input
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files)
              e.target.value = ''
            }}
            style={{ display: 'none' }}
          />
        </label>
        <button
          type="button"
          className="btn-soft"
          style={{ flex: 1 }}
          onClick={() => void handlePaste()}
        >
          Paste SVG
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: '0 12px',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          marginBottom: 12,
        }}
      >
        {categoryAssets.map((asset) => {
          const thumbnail = (
            <span className="asset-thumb">
              <img
                src={asset.url}
                alt=""
                style={{ maxWidth: 28, maxHeight: 28 }}
              />
            </span>
          )

          return (
            <div
              key={asset.id}
              className={`asset-row${selId === asset.id ? ' active' : ''}`}
            >
              {renamingId === asset.id ? (
                <div className="asset-select">
                  {thumbnail}
                  <form
                    className="asset-rename-form"
                    onSubmit={(event) => {
                      event.preventDefault()
                      finishRename(asset.id, asset.name)
                    }}
                  >
                    <input
                      type="text"
                      className="asset-name-input"
                      aria-label={`Rename ${asset.name}`}
                      value={draftName}
                      ref={nameInputRef}
                      maxLength={100}
                      onChange={(event) => setDraftName(event.target.value)}
                      onBlur={() => finishRename(asset.id, asset.name)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Escape') return
                        event.preventDefault()
                        cancelRename()
                      }}
                    />
                  </form>
                </div>
              ) : (
                <button
                  type="button"
                  className="asset-select"
                  onClick={() => selectAsset(asset.id)}
                  onDoubleClick={() => beginRename(asset.id, asset.name)}
                >
                  {thumbnail}
                  <span className="asset-name">{asset.name}</span>
                </button>
              )}
              {renamingId !== asset.id && (
                <>
                  <button
                    type="button"
                    className="icon-action"
                    title="Rename asset"
                    aria-label={`Rename ${asset.name}`}
                    onClick={() => beginRename(asset.id, asset.name)}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    className="del-btn"
                    title="Delete asset"
                    aria-label={`Delete ${asset.name}`}
                    onClick={() => removeAsset(asset.id)}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          )
        })}
        {categoryAssets.length === 0 && (
          <div
            style={{
              fontSize: 12,
              color: '#a5a19a',
              padding: 8,
              textAlign: 'center',
            }}
          >
            No assets in this category yet
          </div>
        )}
      </div>

      <PalettePanel builder={builder} />
    </aside>
  )
}
