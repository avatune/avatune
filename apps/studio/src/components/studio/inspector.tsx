import { type CSSProperties, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import { CATEGORIES } from '../../types'
import { PredictorPanel } from './predictor-panel'

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<string, string>

const eyebrowStyle: CSSProperties = { marginBottom: 10 }
const labelStyle: CSSProperties = { fontSize: 12.5, color: '#6b675f' }
const numberStyle: CSSProperties = {
  width: 64,
  padding: '5px 6px',
  fontSize: 12,
}
const miniBtnStyle: CSSProperties = {
  minWidth: 34,
  fontSize: 13,
  textAlign: 'center',
}

const MOVE_SCOPES = [
  { id: 'all', label: 'All categories' },
  { id: 'category', label: 'Current category' },
] as const

interface ControlRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  /** Layer has no slider — only the numeric field. */
  slider?: boolean
}

const ControlRow = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  slider = true,
}: ControlRowProps) => {
  const id = `ctl-${label.toLowerCase()}`
  return (
    <>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {slider ? (
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <div />
      )}
      <input
        id={id}
        type="number"
        className="field"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={numberStyle}
      />
    </>
  )
}

interface InspectorProps {
  builder: Builder
}

export const Inspector = ({ builder }: InspectorProps) => {
  const {
    assets,
    meta,
    patchMeta,
    selCat,
    selected,
    updateAsset,
    resetPlacement,
    inheritFrom,
    moveAssets,
    scaleAssets,
  } = builder

  const [sourceId, setSourceId] = useState('')
  const [moveScope, setMoveScope] = useState<'all' | 'category'>('all')

  const hasAssets = Object.keys(assets).length > 0
  const moveTarget = moveScope === 'category' ? selCat : undefined

  const inheritSources = Object.values(assets)
    .filter(
      (asset) =>
        asset.id !== selected?.id && asset.category === selected?.category,
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleInherit = () => {
    if (!sourceId) return
    inheritFrom(sourceId)
  }

  return (
    <aside
      style={{
        background: '#ffffff',
        borderLeft: '1px solid #e8e5df',
        padding: '22px 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          padding: '0 22px',
        }}
      >
        <div>
          <div className="eyebrow" style={eyebrowStyle}>
            Container
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label
                htmlFor="container-size"
                style={{ ...labelStyle, width: 70 }}
              >
                Size
              </label>
              <input
                id="container-size"
                type="number"
                className="field"
                min={80}
                max={960}
                value={meta.size}
                onChange={(e) =>
                  patchMeta({
                    size: Math.max(
                      80,
                      Math.min(960, Number(e.target.value) || 560),
                    ),
                  })
                }
                style={{ width: 70, padding: '6px 8px', fontSize: 13 }}
              />
              <span style={{ fontSize: 12, color: '#a5a19a' }}>px</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label
                htmlFor="container-radius"
                style={{ ...labelStyle, width: 70 }}
              >
                Radius
              </label>
              <input
                id="container-radius"
                type="range"
                min={0}
                max={50}
                value={meta.radius}
                onChange={(e) => patchMeta({ radius: Number(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: '#6b675f',
                  fontFamily: "'IBM Plex Mono', monospace",
                  width: 38,
                  textAlign: 'right',
                }}
              >
                {meta.radius}%
              </span>
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: '#6b675f',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={meta.clip}
                onChange={(e) => patchMeta({ clip: e.target.checked })}
              />{' '}
              Clip to container
            </label>
          </div>
        </div>

        <div style={{ height: 1, background: '#efece6' }} />

        {hasAssets && (
          <>
            <div>
              <div className="eyebrow" style={eyebrowStyle}>
                Move
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <div
                  role="radiogroup"
                  aria-label="Which assets to move and scale"
                  style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  {MOVE_SCOPES.map(({ id, label }) => (
                    <label key={id} className="scope-option">
                      <input
                        type="radio"
                        name="move-scope"
                        checked={moveScope === id}
                        onChange={() => setMoveScope(id)}
                      />
                      {id === 'category'
                        ? `${label} · ${CATEGORY_LABEL[selCat]}`
                        : label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ ...labelStyle, width: 50 }}>Move</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Move left"
                      onClick={() => moveAssets(-2, 0, moveTarget)}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Move up"
                      onClick={() => moveAssets(0, -2, moveTarget)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Move down"
                      onClick={() => moveAssets(0, 2, moveTarget)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Move right"
                      onClick={() => moveAssets(2, 0, moveTarget)}
                    >
                      →
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ ...labelStyle, width: 50 }}>Scale</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Scale down"
                      onClick={() => scaleAssets(0.95, moveTarget)}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="btn-soft"
                      style={miniBtnStyle}
                      aria-label="Scale up"
                      onClick={() => scaleAssets(1.05, moveTarget)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: 1, background: '#efece6' }} />
          </>
        )}

        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                Adjust selected asset
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                {selected.name}{' '}
                <span style={{ color: '#a5a19a', fontWeight: 400 }}>
                  · {CATEGORY_LABEL[selected.category]}
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <ControlRow
                label="X"
                value={selected.x}
                min={-50}
                max={150}
                step={0.5}
                onChange={(x) => updateAsset(selected.id, { x })}
              />
              <ControlRow
                label="Y"
                value={selected.y}
                min={-50}
                max={150}
                step={0.5}
                onChange={(y) => updateAsset(selected.id, { y })}
              />
              <ControlRow
                label="Scale"
                value={selected.scale}
                min={1}
                max={200}
                step={0.5}
                onChange={(scale) => updateAsset(selected.id, { scale })}
              />
              <ControlRow
                label="Rotate"
                value={selected.rotation}
                min={-180}
                max={180}
                step={1}
                onChange={(rotation) => updateAsset(selected.id, { rotation })}
              />
              <ControlRow
                label="Layer"
                value={selected.layer}
                min={0}
                max={100}
                step={1}
                slider={false}
                onChange={(layer) =>
                  updateAsset(selected.id, { layer: Math.round(layer) || 0 })
                }
              />
            </div>
            <div style={{ fontSize: 11, color: '#a5a19a', lineHeight: 1.5 }}>
              X / Y / scale are % of container size — position is the asset's
              center point.
            </div>
            <button type="button" className="btn-soft" onClick={resetPlacement}>
              Reset
            </button>
            {inheritSources.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <select
                  aria-label="Inherit position from asset"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '6px 8px',
                    fontSize: 12,
                    border: '1px solid #ddd9d2',
                    borderRadius: 6,
                    background: '#ffffff',
                    color: '#1c1b19',
                  }}
                >
                  <option value="">Inherit position from…</option>
                  {inheritSources.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-soft"
                  style={miniBtnStyle}
                  title="Copy the selected asset's placement onto this one"
                  aria-label="Inherit placement"
                  disabled={!sourceId}
                  onClick={handleInherit}
                >
                  Inherit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: '#a5a19a', lineHeight: 1.6 }}>
            Select an asset in the list — or click it on the preview — to adjust
            its position, scale, rotation and layer.
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <PredictorPanel builder={builder} />

      <div
        style={{
          padding: '14px 22px 0',
          fontSize: 11,
          color: '#c0bcb4',
          lineHeight: 1.6,
        }}
      >
        Everything is saved in your browser automatically.
      </div>
    </aside>
  )
}
