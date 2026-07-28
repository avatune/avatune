import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import type {
  CategoryId,
  PaletteAssignments,
  ThemeColorCategory,
} from '../../types'
import { CATEGORIES } from '../../types'
import { wouldConnectionCycle } from '../../utils/palettes'
import { PencilIcon } from './icons'

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<string, string>

const subheadingStyle = {
  fontSize: 11.5,
  fontWeight: 500,
  color: '#8a867e',
} as const

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

interface PaletteRadioProps {
  groupName: string
  label: string
  checked: boolean
  onSelect: () => void
  children?: ReactNode
}

const PaletteRadio = ({
  groupName,
  label,
  checked,
  onSelect,
  children,
}: PaletteRadioProps) => (
  <div className={`palette-row${checked ? ' active' : ''}`}>
    <label className="palette-select">
      <input
        type="radio"
        name={groupName}
        checked={checked}
        onChange={onSelect}
      />
      <span className="palette-name">{label}</span>
    </label>
    {children}
  </div>
)

interface PalettePanelProps {
  builder: Builder
}

export const PalettePanel = ({ builder }: PalettePanelProps) => {
  const { meta, patchMeta, selCat } = builder
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const cancelRenameRef = useRef(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!renamingId) return
    nameInputRef.current?.focus()
    nameInputRef.current?.select()
  }, [renamingId])

  const disconnect = (category: ThemeColorCategory) => {
    const paletteConnections = { ...meta.paletteConnections }
    delete paletteConnections[category as CategoryId]
    return paletteConnections
  }

  /** A palette and a connection are exclusive — picking one drops the other. */
  const assignPalette = (
    category: ThemeColorCategory,
    paletteId: string | null,
  ) => {
    const paletteByCategory = { ...meta.paletteByCategory }
    if (paletteId) paletteByCategory[category] = paletteId
    else delete paletteByCategory[category]
    patchMeta({ paletteByCategory, paletteConnections: disconnect(category) })
  }

  const connectCategory = (target: CategoryId | null) => {
    const paletteByCategory = { ...meta.paletteByCategory }
    if (!target) {
      patchMeta({ paletteConnections: disconnect(selCat) })
      return
    }
    delete paletteByCategory[selCat]
    patchMeta({
      paletteByCategory,
      paletteConnections: { ...meta.paletteConnections, [selCat]: target },
    })
  }

  const addPalette = () => {
    const id = `palette-${uid()}`
    patchMeta({
      palettes: [
        ...meta.palettes,
        {
          id,
          name: `Palette ${meta.palettes.length + 1}`,
          colors: [{ id: `color-${uid()}`, name: 'Color 1', value: '#000000' }],
        },
      ],
      // Applied straight away, so its colors are editable in the preview panel.
      paletteByCategory: { ...meta.paletteByCategory, [selCat]: id },
      paletteConnections: disconnect(selCat),
    })
  }

  const removePalette = (paletteId: string) => {
    if (meta.palettes.length === 1) return
    patchMeta({
      palettes: meta.palettes.filter((palette) => palette.id !== paletteId),
      paletteByCategory: Object.fromEntries(
        Object.entries(meta.paletteByCategory).filter(
          ([, assigned]) => assigned !== paletteId,
        ),
      ) as PaletteAssignments,
      previewColorByPalette: Object.fromEntries(
        Object.entries(meta.previewColorByPalette).filter(
          ([id]) => id !== paletteId,
        ),
      ),
    })
  }

  const beginRename = (id: string, name: string) => {
    cancelRenameRef.current = false
    setDraftName(name)
    setRenamingId(id)
  }

  const finishRename = (id: string, currentName: string) => {
    if (cancelRenameRef.current) {
      cancelRenameRef.current = false
      setRenamingId(null)
      return
    }

    const name = draftName.trim()
    if (name && name !== currentName) {
      patchMeta({
        palettes: meta.palettes.map((palette) =>
          palette.id === id ? { ...palette, name } : palette,
        ),
      })
    }
    setRenamingId(null)
  }

  const cancelRename = () => {
    cancelRenameRef.current = true
    setRenamingId(null)
  }

  const connectedTo = meta.paletteConnections[selCat]
  const categoryPaletteId = connectedTo
    ? undefined
    : meta.paletteByCategory[selCat]
  const backgroundPaletteId = meta.paletteByCategory.background
  const connectableCategories = CATEGORIES.filter(
    (category) =>
      !wouldConnectionCycle(meta.paletteConnections, selCat, category.id),
  )

  return (
    <div
      style={{
        borderTop: '1px solid #e8e5df',
        padding: '14px 20px 18px',
        maxHeight: '45%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div className="eyebrow">Palettes</div>
        <div style={{ fontSize: 11, color: '#a5a19a' }}>
          {CATEGORY_LABEL[selCat]}
        </div>
      </div>

      <div style={subheadingStyle}>Select palette</div>
      <div
        role="radiogroup"
        aria-label={`Palette for ${CATEGORY_LABEL[selCat]}`}
      >
        <PaletteRadio
          groupName={`palette-${selCat}`}
          label="None"
          checked={!connectedTo && !categoryPaletteId}
          onSelect={() => assignPalette(selCat, null)}
        />
        {meta.palettes.map((palette) =>
          renamingId === palette.id ? (
            <div key={palette.id} className="palette-row">
              <form
                style={{ flex: 1, minWidth: 0 }}
                onSubmit={(event) => {
                  event.preventDefault()
                  finishRename(palette.id, palette.name)
                }}
              >
                <input
                  type="text"
                  className="asset-name-input"
                  aria-label={`Rename ${palette.name}`}
                  value={draftName}
                  ref={nameInputRef}
                  maxLength={60}
                  onChange={(event) => setDraftName(event.target.value)}
                  onBlur={() => finishRename(palette.id, palette.name)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Escape') return
                    event.preventDefault()
                    cancelRename()
                  }}
                />
              </form>
            </div>
          ) : (
            <PaletteRadio
              key={palette.id}
              groupName={`palette-${selCat}`}
              label={palette.name}
              checked={categoryPaletteId === palette.id}
              onSelect={() => assignPalette(selCat, palette.id)}
            >
              <button
                type="button"
                className="icon-action"
                title="Rename palette"
                aria-label={`Rename ${palette.name}`}
                onClick={() => beginRename(palette.id, palette.name)}
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                className="del-btn"
                title={
                  meta.palettes.length === 1
                    ? 'A theme needs at least one palette'
                    : 'Delete palette'
                }
                aria-label={`Delete ${palette.name}`}
                disabled={meta.palettes.length === 1}
                onClick={() => removePalette(palette.id)}
              >
                ×
              </button>
            </PaletteRadio>
          ),
        )}
      </div>

      <button type="button" className="btn-soft" onClick={addPalette}>
        <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Add palette
      </button>

      <div style={{ ...subheadingStyle, marginTop: 2 }}>
        Or connect to a category
      </div>
      <select
        aria-label={`Connect ${CATEGORY_LABEL[selCat]} colors to another category`}
        className="field"
        value={connectedTo ?? ''}
        onChange={(event) =>
          connectCategory((event.target.value || null) as CategoryId | null)
        }
        style={{ width: '100%', padding: '6px 8px', fontSize: 12.5 }}
      >
        <option value="">Not connected</option>
        {connectableCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <div className="eyebrow" style={{ marginTop: 6 }}>
        Background
      </div>
      <div role="radiogroup" aria-label="Background palette">
        <PaletteRadio
          groupName="palette-background"
          label="None"
          checked={!backgroundPaletteId}
          onSelect={() => assignPalette('background', null)}
        />
        {meta.palettes.map((palette) => (
          <PaletteRadio
            key={palette.id}
            groupName="palette-background"
            label={palette.name}
            checked={backgroundPaletteId === palette.id}
            onSelect={() => assignPalette('background', palette.id)}
          />
        ))}
      </div>
    </div>
  )
}
