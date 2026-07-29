import type { CSSProperties } from 'react'
import type { Builder } from '../../hooks/use-builder'
import type { Predictor, PredictorSpec } from '../../types'
import { CATEGORIES, PREDICTOR_SPECS } from '../../types'
import { toCamelCase } from '../../utils/caseUtils'
import { resolvePaletteId } from '../../utils/palettes'

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<string, string>

const PREDICTOR_CATEGORIES = [
  ...new Set(PREDICTOR_SPECS.map(({ category }) => CATEGORY_LABEL[category])),
]

const subheadingStyle: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 500,
  color: '#8a867e',
}

const classLabelStyle: CSSProperties = {
  fontSize: 12,
  color: '#6b675f',
  fontFamily: "'IBM Plex Mono', monospace",
}

const hintStyle: CSSProperties = {
  fontSize: 11,
  color: '#a5a19a',
  lineHeight: 1.6,
}

const chipStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 8px',
  fontSize: 11.5,
}

const danglingChipStyle: CSSProperties = {
  background: '#fbeeec',
  borderColor: '#d9a79f',
  color: '#a24a3c',
  fontFamily: "'IBM Plex Mono', monospace",
}

interface Choice {
  value: string
  label: string
  swatch?: string
}

interface PredictorPanelProps {
  builder: Builder
}

export const PredictorPanel = ({ builder }: PredictorPanelProps) => {
  const { assets, meta, patchMeta, selCat } = builder
  const specs = PREDICTOR_SPECS.filter(({ category }) => category === selCat)

  /**
   * An empty class is dropped rather than stored, so a theme never generates a
   * `.mapPrediction` call that offers the renderer nothing to pick from.
   */
  const toggle = (predictor: Predictor, className: string, value: string) => {
    const mapping = meta.predictorMappings[predictor] ?? {}
    const selected = mapping[className] ?? []
    const next = selected.includes(value)
      ? selected.filter((entry) => entry !== value)
      : [...selected, value]

    const nextMapping = { ...mapping }
    if (next.length > 0) nextMapping[className] = next
    else delete nextMapping[className]

    const predictorMappings = { ...meta.predictorMappings }
    if (Object.keys(nextMapping).length > 0) {
      predictorMappings[predictor] = nextMapping
    } else {
      delete predictorMappings[predictor]
    }
    patchMeta({ predictorMappings })
  }

  const getChoices = ({ category, target }: PredictorSpec): Choice[] => {
    if (target === 'item') {
      const byIdentifier = new Map<string, Choice>()
      for (const asset of Object.values(assets)
        .filter((asset) => asset.category === category)
        .sort((left, right) => left.created - right.created)) {
        const value = toCamelCase(asset.name)
        if (!byIdentifier.has(value)) {
          byIdentifier.set(value, { value, label: asset.name })
        }
      }
      // An optional category also generates a 'none' item to pick.
      if (meta.optionalCategories.includes(category)) {
        byIdentifier.set('none', { value: 'none', label: 'None' })
      }
      return [...byIdentifier.values()]
    }

    // Follows connections, so hair colors still resolve when hair borrows them.
    const paletteId = resolvePaletteId(meta, category)
    const palette = meta.palettes.find(({ id }) => id === paletteId)
    return (palette?.colors ?? []).map((color) => ({
      value: color.value,
      label: color.name,
      swatch: color.value,
    }))
  }

  return (
    <div
      style={{
        borderTop: '1px solid #e8e5df',
        padding: '14px 22px 18px',
        maxHeight: '45%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div className="eyebrow">Predictions</div>
        <div style={{ fontSize: 11, color: '#a5a19a' }}>
          {CATEGORY_LABEL[selCat]}
        </div>
      </div>

      {specs.length === 0 ? (
        <div style={hintStyle}>
          Photo predictions pick from {PREDICTOR_CATEGORIES.join(', ')}. Select
          one of those categories to map them.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {specs.map((spec) => {
            const choices = getChoices(spec)
            const mapping = meta.predictorMappings[spec.id] ?? {}

            return (
              <div
                key={spec.id}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <div style={subheadingStyle}>{spec.label}</div>
                {choices.length === 0 ? (
                  <div style={hintStyle}>
                    {spec.target === 'item'
                      ? `Add ${CATEGORY_LABEL[spec.category]} assets to map this.`
                      : `Give ${CATEGORY_LABEL[spec.category]} a palette to map this.`}
                  </div>
                ) : (
                  spec.classes.map((className) => {
                    const selected = mapping[className] ?? []
                    // Values pointing at an item or color this theme no longer
                    // has — shown so they can be cleared instead of silently
                    // surviving an export and selecting nothing at render time.
                    const dangling = selected.filter(
                      (value) =>
                        !choices.some((choice) => choice.value === value),
                    )
                    return (
                      <div
                        key={className}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                        }}
                      >
                        <div style={classLabelStyle}>
                          {className.replace(/_/g, ' ')}
                        </div>
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}
                        >
                          {choices.map((choice) => (
                            <button
                              key={choice.value}
                              type="button"
                              className="chip-btn"
                              style={chipStyle}
                              aria-pressed={selected.includes(choice.value)}
                              title={
                                choice.swatch
                                  ? `${choice.label} · ${choice.value}`
                                  : choice.value
                              }
                              onClick={() =>
                                toggle(spec.id, className, choice.value)
                              }
                            >
                              {choice.swatch && (
                                <span
                                  aria-hidden="true"
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 3,
                                    background: choice.swatch,
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    flex: 'none',
                                  }}
                                />
                              )}
                              {choice.label}
                            </button>
                          ))}
                          {dangling.map((value) => (
                            <button
                              key={value}
                              type="button"
                              className="chip-btn"
                              style={{ ...chipStyle, ...danglingChipStyle }}
                              aria-pressed
                              title={`"${value}" is not in this theme — click to remove`}
                              onClick={() => toggle(spec.id, className, value)}
                            >
                              {value} ×
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
