import type { Builder } from '../../hooks/use-builder'
import type { ThemeColorCategory, ThemePalette } from '../../types'
import { CATEGORIES } from '../../types'
import { EyeIcon } from './icons'

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<string, string>

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

interface PaletteColorsProps {
  builder: Builder
  /** The palette the selected category resolves to, if any. */
  palette: ThemePalette | undefined
  previewColorId: string | undefined
  /** Set when the palette is inherited through a category connection. */
  colorSource: ThemeColorCategory | undefined
}

export const PaletteColors = ({
  builder,
  palette,
  previewColorId,
  colorSource,
}: PaletteColorsProps) => {
  const { meta, patchMeta, selCat } = builder

  const updatePalette = (patch: Partial<ThemePalette>) => {
    if (!palette) return
    patchMeta({
      palettes: meta.palettes.map((entry) =>
        entry.id === palette.id ? { ...entry, ...patch } : entry,
      ),
    })
  }

  const updateColor = (
    colorId: string,
    patch: { name?: string; value?: string },
  ) => {
    if (!palette) return
    updatePalette({
      colors: palette.colors.map((color) =>
        color.id === colorId ? { ...color, ...patch } : color,
      ),
    })
  }

  if (!palette) {
    return (
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Palette
        </div>
        <div style={{ fontSize: 12, color: '#a5a19a', lineHeight: 1.5 }}>
          {colorSource
            ? `${CATEGORY_LABEL[selCat]} is connected to ${CATEGORY_LABEL[colorSource] ?? colorSource}, which has no palette applied.`
            : `${CATEGORY_LABEL[selCat]} has no palette applied. Pick one on the left to edit its colors.`}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minWidth: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          marginBottom: 10,
          minWidth: 0,
        }}
      >
        <div className="eyebrow">Palette</div>
        <div
          style={{
            fontSize: 12.5,
            color: '#1c1b19',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {palette.name}
        </div>
        {colorSource && (
          <div
            style={{ fontSize: 11, color: '#a5a19a', whiteSpace: 'nowrap' }}
            title={`${CATEGORY_LABEL[selCat]} is connected to ${CATEGORY_LABEL[colorSource] ?? colorSource}`}
          >
            · via {CATEGORY_LABEL[colorSource] ?? colorSource}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            maxHeight: 196,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'start',
            gap: 7,
            paddingRight: 4,
          }}
        >
          {palette.colors.map((color) => (
            <div
              key={color.id}
              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
            >
              <input
                type="color"
                aria-label={`${color.name} color`}
                value={color.value}
                onChange={(event) =>
                  updateColor(color.id, {
                    value: event.target.value.toUpperCase(),
                  })
                }
                style={{ width: 30, height: 28, padding: 2 }}
              />
              <input
                aria-label="Color name"
                className="field"
                value={color.name}
                onChange={(event) =>
                  updateColor(color.id, { name: event.target.value })
                }
                style={{ flex: 1, minWidth: 0, padding: '5px 7px' }}
              />
              <button
                type="button"
                className="icon-action"
                title={
                  color.id === previewColorId
                    ? 'Previewing this color'
                    : 'Preview the avatar with this color'
                }
                aria-label={`Preview ${color.name}`}
                aria-pressed={color.id === previewColorId}
                disabled={color.id === previewColorId}
                onClick={() =>
                  patchMeta({
                    previewColorByPalette: {
                      ...meta.previewColorByPalette,
                      [palette.id]: color.id,
                    },
                  })
                }
              >
                <EyeIcon />
              </button>
              <button
                type="button"
                className="del-btn"
                title={
                  palette.colors.length === 1
                    ? 'A palette needs at least one color'
                    : 'Remove color'
                }
                aria-label={`Remove ${color.name}`}
                disabled={palette.colors.length === 1}
                onClick={() =>
                  updatePalette({
                    colors: palette.colors.filter(
                      (entry) => entry.id !== color.id,
                    ),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-soft"
          onClick={() =>
            updatePalette({
              colors: [
                ...palette.colors,
                {
                  id: `color-${uid()}`,
                  name: `Color ${palette.colors.length + 1}`,
                  value: '#000000',
                },
              ],
            })
          }
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Add color
        </button>
      </div>
    </div>
  )
}
