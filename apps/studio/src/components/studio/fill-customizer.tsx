import type { ThemeFillTransform } from '../../types'
import type { SvgFillPart } from '../../utils/svgColors'
import {
  applyThemeFillBinding,
  formatColordChain,
  parseColordChain,
} from '../../utils/svgColors'

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const TRANSFORM_TYPES: ThemeFillTransform['type'][] = [
  'rotate',
  'saturate',
  'desaturate',
  'lighten',
  'darken',
  'grayscale',
  'invert',
]

export const createFillTransform = (
  type: ThemeFillTransform['type'],
): ThemeFillTransform => {
  if (type === 'grayscale' || type === 'invert') return { type }
  return { type, amount: type === 'rotate' ? 0 : 0.1 }
}

export interface FillTransformStep {
  id: string
  transform: ThemeFillTransform
}

export interface FillCustomization {
  assetId: string
  fillIndices: number[]
  steps: FillTransformStep[]
  code: string
}

interface FillCustomizerProps {
  customization: FillCustomization
  /** The fill parts the chain is being edited for — at least one. */
  parts: SvgFillPart[]
  /** The palette color the chain is previewed against. */
  themeColor: string
  onChange: (customization: FillCustomization) => void
  onSave: () => void
  onReset: () => void
}

export const FillCustomizer = ({
  customization,
  parts,
  themeColor,
  onChange,
  onSave,
  onReset,
}: FillCustomizerProps) => {
  const part = parts[0]
  const parsed = parseColordChain(customization.code)
  const isValid = parsed !== null
  const previewColor = applyThemeFillBinding(themeColor, {
    type: 'custom',
    ...(parsed?.sourceColor ? { sourceColor: parsed.sourceColor } : {}),
    transforms:
      parsed?.transforms ??
      customization.steps.map(({ transform }) => transform),
  })
  const summary =
    parts.length > 1
      ? `${part.value} · ${parts.length} paths`
      : `${part.label} · ${part.value}`

  const setSteps = (steps: FillTransformStep[]) =>
    onChange({
      ...customization,
      steps,
      code: formatColordChain(
        steps.map(({ transform }) => transform),
        parsed?.sourceColor,
      ),
    })

  return (
    <div
      style={{
        minWidth: 0,
        borderLeft: '1px solid #efece6',
        paddingLeft: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div>
        <div className="eyebrow" style={{ marginBottom: 4 }}>
          {parts.length > 1 ? 'Customize color group' : 'Customize fill'}
        </div>
        <div
          title={summary}
          style={{
            fontSize: 12.5,
            color: '#6b675f',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {summary}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12,
          color: '#6b675f',
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            background: previewColor,
            border: '1px solid #ddd9d2',
          }}
        />
        {previewColor}
      </div>
      <div
        style={{
          maxHeight: 122,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingRight: 4,
        }}
      >
        {customization.steps.length === 0 ? (
          <div style={{ fontSize: 11.5, color: '#a5a19a' }}>
            No transforms. The primary theme color is used.
          </div>
        ) : (
          customization.steps.map(({ id, transform }, index) => (
            <div
              key={id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(82px, 1fr) 64px 26px 26px 26px',
                gap: 5,
                alignItems: 'center',
              }}
            >
              <select
                aria-label={`Transform ${index + 1}`}
                className="field"
                value={transform.type}
                onChange={(event) =>
                  setSteps(
                    customization.steps.map((step, stepIndex) =>
                      stepIndex === index
                        ? {
                            ...step,
                            transform: createFillTransform(
                              event.target.value as ThemeFillTransform['type'],
                            ),
                          }
                        : step,
                    ),
                  )
                }
                style={{ minWidth: 0, padding: '5px 6px' }}
              >
                {TRANSFORM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {'amount' in transform ? (
                <input
                  type="number"
                  aria-label={`${transform.type} amount`}
                  className="field"
                  min={transform.type === 'rotate' ? -360 : 0}
                  max={transform.type === 'rotate' ? 360 : 1}
                  step={transform.type === 'rotate' ? 1 : 0.01}
                  value={transform.amount}
                  onChange={(event) =>
                    setSteps(
                      customization.steps.map((step, stepIndex) =>
                        stepIndex === index
                          ? {
                              ...step,
                              transform: {
                                ...transform,
                                amount: Number(event.target.value),
                              },
                            }
                          : step,
                      ),
                    )
                  }
                  style={{ minWidth: 0, padding: '5px 6px' }}
                />
              ) : (
                <span style={{ textAlign: 'center', color: '#a5a19a' }}>—</span>
              )}
              <button
                type="button"
                className="chip-btn"
                aria-label={`Move ${transform.type} up`}
                disabled={index === 0}
                onClick={() => {
                  const steps = [...customization.steps]
                  ;[steps[index - 1], steps[index]] = [
                    steps[index],
                    steps[index - 1],
                  ]
                  setSteps(steps)
                }}
              >
                ↑
              </button>
              <button
                type="button"
                className="chip-btn"
                aria-label={`Move ${transform.type} down`}
                disabled={index === customization.steps.length - 1}
                onClick={() => {
                  const steps = [...customization.steps]
                  ;[steps[index], steps[index + 1]] = [
                    steps[index + 1],
                    steps[index],
                  ]
                  setSteps(steps)
                }}
              >
                ↓
              </button>
              <button
                type="button"
                className="chip-btn"
                aria-label={`Remove ${transform.type}`}
                onClick={() =>
                  setSteps(customization.steps.filter((step) => step.id !== id))
                }
              >
                −
              </button>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        className="chip-btn"
        onClick={() =>
          setSteps([
            ...customization.steps,
            { id: uid(), transform: createFillTransform('lighten') },
          ])
        }
      >
        Add transform
      </button>
      <textarea
        rows={2}
        aria-label="Colord transform chain"
        className="field"
        value={customization.code}
        onChange={(event) => {
          const code = event.target.value
          const parsedCode = parseColordChain(code)
          onChange({
            ...customization,
            code,
            steps:
              parsedCode === null
                ? customization.steps
                : parsedCode.transforms.map((transform) => ({
                    id: uid(),
                    transform,
                  })),
          })
        }}
        spellCheck={false}
        style={{
          width: '100%',
          minWidth: 0,
          padding: '6px 8px',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 10.5,
          borderColor: isValid ? '#ddd9d2' : '#b45f52',
        }}
      />
      {!isValid && (
        <div style={{ fontSize: 11, color: '#b45f52' }}>
          Enter a valid colord(...).toHex() chain.
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="chip-btn" onClick={onReset}>
          Reset
        </button>
        <button
          type="button"
          className="btn-dark"
          disabled={!isValid}
          onClick={onSave}
          style={{ flex: 1 }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
