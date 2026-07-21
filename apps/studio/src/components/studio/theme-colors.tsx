import { colord } from 'colord'
import { useMemo, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import type {
  PaletteAssignments,
  ThemeFillBinding,
  ThemeFillTransform,
  ThemePalette,
} from '../../types'
import {
  applyThemeFillBinding,
  formatColordChain,
  getSvgFillParts,
  parseColordChain,
  replaceSvgFillSource,
  setThemeFillBindings,
} from '../../utils/svgColors'

interface ThemeColorsProps {
  builder: Builder
}

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

const createFillTransform = (
  type: ThemeFillTransform['type'],
): ThemeFillTransform => {
  if (type === 'grayscale' || type === 'invert') return { type }
  return { type, amount: type === 'rotate' ? 0 : 0.1 }
}

interface FillTransformStep {
  id: string
  transform: ThemeFillTransform
}

interface FillCustomization {
  assetId: string
  fillIndices: number[]
  steps: FillTransformStep[]
  code: string
}

export const ThemeColors = ({ builder }: ThemeColorsProps) => {
  const { meta, patchMeta, selected, updateAsset } = builder
  const [selectedPaletteId, setSelectedPaletteId] = useState(
    meta.palettes[0]?.id ?? '',
  )
  const [renameValue, setRenameValue] = useState<string | null>(null)
  const [fillCustomization, setFillCustomization] =
    useState<FillCustomization | null>(null)

  const selectedPalette =
    meta.palettes.find((palette) => palette.id === selectedPaletteId) ??
    meta.palettes[0]
  const configuredPreviewColorId = selectedPalette
    ? meta.previewColorByPalette[selectedPalette.id]
    : undefined
  const previewColorId = selectedPalette?.colors.some(
    (color) => color.id === configuredPreviewColorId,
  )
    ? configuredPreviewColorId
    : selectedPalette?.colors[0]?.id
  const previewTargetCategory = selected?.category ?? 'background'
  const selectedPaletteIsApplied =
    selectedPalette &&
    meta.paletteByCategory[previewTargetCategory] === selectedPalette.id
  const selectedAssetColor =
    selectedPalette?.colors.find((color) => color.id === previewColorId)
      ?.value ??
    selectedPalette?.colors[0]?.value ??
    '#000000'
  const selectedSvg = selected?.svg

  const updatePalettes = (palettes: ThemePalette[]) => patchMeta({ palettes })
  const fillParts = useMemo(
    () => (selectedSvg ? getSvgFillParts(selectedSvg) : []),
    [selectedSvg],
  )
  const activeFillCustomization =
    selected && fillCustomization?.assetId === selected.id
      ? fillCustomization
      : null
  const fillColorGroups = useMemo(() => {
    const groups: Array<{
      key: string
      value: string
      parts: typeof fillParts
    }> = []
    const groupsByColor = new Map<string, (typeof groups)[number]>()

    for (const part of fillParts) {
      const parsedColor = colord(part.value)
      const key = parsedColor.isValid()
        ? parsedColor.toHex().toLowerCase()
        : part.value.trim().toLowerCase()
      const existingGroup = groupsByColor.get(key)
      if (existingGroup) {
        existingGroup.parts.push(part)
        continue
      }

      const group = { key, value: part.value, parts: [part] }
      groups.push(group)
      groupsByColor.set(key, group)
    }

    return groups
  }, [fillParts])
  const customizingParts = activeFillCustomization
    ? fillParts.filter((part) =>
        activeFillCustomization.fillIndices.includes(part.index),
      )
    : []
  const customizingPart = customizingParts[0]
  const parsedCustomization = activeFillCustomization
    ? parseColordChain(activeFillCustomization.code)
    : null
  const customizationPreviewColor = activeFillCustomization
    ? applyThemeFillBinding(selectedAssetColor, {
        type: 'custom',
        ...(parsedCustomization?.sourceColor
          ? { sourceColor: parsedCustomization.sourceColor }
          : {}),
        transforms:
          parsedCustomization?.transforms ??
          activeFillCustomization.steps.map(({ transform }) => transform),
      })
    : selectedAssetColor
  const customizationCodeIsValid =
    !activeFillCustomization || parsedCustomization !== null
  const updatePalette = (paletteId: string, patch: Partial<ThemePalette>) => {
    updatePalettes(
      meta.palettes.map((palette) =>
        palette.id === paletteId ? { ...palette, ...patch } : palette,
      ),
    )
  }

  const updateFillBindings = (
    indices: number[],
    binding: ThemeFillBinding | null,
  ) => {
    if (!selected) return
    const themeFillBindings = setThemeFillBindings(
      selected.themeFillBindings,
      indices,
      binding,
    )
    updateAsset(selected.id, { themeFillBindings })
    if (binding && selectedPalette) {
      patchMeta({
        paletteByCategory: {
          ...meta.paletteByCategory,
          [selected.category]: selectedPalette.id,
        },
      })
    }
  }

  const saveFillCustomization = () => {
    if (!activeFillCustomization) return
    const parsed = parseColordChain(activeFillCustomization.code)
    if (!parsed) return
    updateFillBindings(
      activeFillCustomization.fillIndices,
      parsed.transforms.length > 0 || parsed.sourceColor
        ? { type: 'custom', ...parsed }
        : { type: 'primary' },
    )
    setFillCustomization(null)
  }

  const setCustomizationSteps = (steps: FillTransformStep[]) => {
    if (!activeFillCustomization) return
    const parsed = parseColordChain(activeFillCustomization.code)
    setFillCustomization({
      ...activeFillCustomization,
      steps,
      code: formatColordChain(
        steps.map(({ transform }) => transform),
        parsed?.sourceColor,
      ),
    })
  }

  const startFillCustomization = (parts: typeof fillParts) => {
    if (!selected || parts.length === 0) return
    const firstBinding = selected.themeFillBindings[parts[0].index]
    const bindingKey = JSON.stringify(firstBinding ?? null)
    const sharedBinding = parts.every(
      (part) =>
        JSON.stringify(selected.themeFillBindings[part.index] ?? null) ===
        bindingKey,
    )
      ? firstBinding
      : undefined
    const transforms =
      sharedBinding?.type === 'custom' ? sharedBinding.transforms : []

    setFillCustomization({
      assetId: selected.id,
      fillIndices: parts.map(({ index }) => index),
      steps: transforms.map((transform) => ({ id: uid(), transform })),
      code: formatColordChain(
        transforms,
        sharedBinding?.type === 'custom'
          ? sharedBinding.sourceColor
          : undefined,
      ),
    })
  }

  const resetFillCustomization = () => {
    if (!activeFillCustomization) return
    const target =
      customizingParts.length === 1
        ? customizingParts[0].label
        : `${customizingParts.length} paths in this color group`
    if (!window.confirm(`Reset customization for ${target}?`)) return
    updateFillBindings(activeFillCustomization.fillIndices, {
      type: 'primary',
    })
    setFillCustomization(null)
  }

  const handleRename = () => {
    if (!selectedPalette) return
    if (renameValue === null) {
      setRenameValue(selectedPalette.name)
      return
    }

    const name = renameValue.trim()
    if (!name) return
    updatePalette(selectedPalette.id, { name })
    setRenameValue(null)
  }

  const addPalette = () => {
    const id = `palette-${uid()}`
    updatePalettes([
      ...meta.palettes,
      {
        id,
        name: `Palette ${meta.palettes.length + 1}`,
        colors: [{ id: `color-${uid()}`, name: 'Color 1', value: '#000000' }],
      },
    ])
    setSelectedPaletteId(id)
  }

  const removePalette = () => {
    if (!selectedPalette || meta.palettes.length === 1) return
    const palettes = meta.palettes.filter(
      (palette) => palette.id !== selectedPalette.id,
    )
    const fallbackId = palettes[0].id
    const paletteByCategory = Object.fromEntries(
      Object.entries(meta.paletteByCategory).map(([category, paletteId]) => [
        category,
        paletteId === selectedPalette.id ? fallbackId : paletteId,
      ]),
    ) as PaletteAssignments
    const previewColorByPalette = Object.fromEntries(
      Object.entries(meta.previewColorByPalette).filter(
        ([paletteId]) => paletteId !== selectedPalette.id,
      ),
    )
    patchMeta({ palettes, paletteByCategory, previewColorByPalette })
    setSelectedPaletteId(fallbackId)
  }

  const addColor = () => {
    if (!selectedPalette) return
    updatePalette(selectedPalette.id, {
      colors: [
        ...selectedPalette.colors,
        {
          id: `color-${uid()}`,
          name: `Color ${selectedPalette.colors.length + 1}`,
          value: '#000000',
        },
      ],
    })
  }

  const assignPalette = (
    category: keyof PaletteAssignments,
    paletteId: string,
  ) => {
    patchMeta({
      paletteByCategory: {
        ...meta.paletteByCategory,
        [category]: paletteId,
      },
    })
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 18,
        minWidth: 0,
      }}
    >
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Theme palettes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {renameValue === null ? (
              <select
                aria-label="Palette to edit"
                value={selectedPalette?.id ?? ''}
                onChange={(event) => setSelectedPaletteId(event.target.value)}
                className="field"
                style={{ flex: 1, minWidth: 0, padding: '6px 8px' }}
              >
                {meta.palettes.map((palette) => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                aria-label="Palette name"
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleRename()
                  if (event.key === 'Escape') setRenameValue(null)
                }}
                className="field"
                style={{ flex: 1, minWidth: 0, padding: '6px 8px' }}
              />
            )}
            <button
              type="button"
              className="chip-btn"
              disabled={renameValue !== null}
              onClick={addPalette}
            >
              Add
            </button>
            <button
              type="button"
              className="chip-btn"
              disabled={renameValue !== null || meta.palettes.length === 1}
              onClick={removePalette}
            >
              Remove
            </button>
            <button
              type="button"
              className="chip-btn"
              disabled={renameValue !== null && !renameValue.trim()}
              onClick={handleRename}
            >
              {renameValue === null ? 'Rename' : 'Save'}
            </button>
          </div>

          {selectedPalette && (
            <>
              <div
                style={{
                  height: 98,
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  alignContent: 'start',
                  gap: 7,
                  paddingRight: 4,
                }}
              >
                {selectedPalette.colors.map((color) => (
                  <div
                    key={color.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                  >
                    <input
                      type="color"
                      aria-label={`${color.name} color`}
                      value={color.value}
                      onChange={(event) =>
                        updatePalette(selectedPalette.id, {
                          colors: selectedPalette.colors.map((entry) =>
                            entry.id === color.id
                              ? {
                                  ...entry,
                                  value: event.target.value.toUpperCase(),
                                }
                              : entry,
                          ),
                        })
                      }
                      style={{ width: 30, height: 28, padding: 2 }}
                    />
                    <input
                      aria-label="Color name"
                      className="field"
                      value={color.name}
                      onChange={(event) =>
                        updatePalette(selectedPalette.id, {
                          colors: selectedPalette.colors.map((entry) =>
                            entry.id === color.id
                              ? { ...entry, name: event.target.value }
                              : entry,
                          ),
                        })
                      }
                      style={{ flex: 1, minWidth: 0, padding: '5px 7px' }}
                    />
                    <button
                      type="button"
                      className="chip-btn"
                      aria-pressed={
                        selectedPaletteIsApplied && color.id === previewColorId
                      }
                      disabled={
                        selectedPaletteIsApplied && color.id === previewColorId
                      }
                      onClick={() =>
                        patchMeta({
                          previewColorByPalette: {
                            ...meta.previewColorByPalette,
                            [selectedPalette.id]: color.id,
                          },
                          paletteByCategory: {
                            ...meta.paletteByCategory,
                            [previewTargetCategory]: selectedPalette.id,
                          },
                        })
                      }
                    >
                      Try
                    </button>
                    <button
                      type="button"
                      className="chip-btn"
                      aria-label={`Remove ${color.name}`}
                      disabled={selectedPalette.colors.length === 1}
                      onClick={() =>
                        updatePalette(selectedPalette.id, {
                          colors: selectedPalette.colors.filter(
                            (entry) => entry.id !== color.id,
                          ),
                        })
                      }
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="chip-btn" onClick={addColor}>
                Add color
              </button>
            </>
          )}

          <label
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr)',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: '#6b675f',
            }}
          >
            Background
            <select
              value={meta.paletteByCategory.background ?? ''}
              onChange={(event) =>
                assignPalette('background', event.target.value)
              }
              className="field"
              style={{ width: '100%', padding: '6px 8px' }}
            >
              {meta.palettes.map((palette) => (
                <option key={palette.id} value={palette.id}>
                  {palette.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {selected && activeFillCustomization && customizingPart ? (
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
              {customizingParts.length > 1
                ? 'Customize color group'
                : 'Customize fill'}
            </div>
            <div
              title={
                customizingParts.length > 1
                  ? `${customizingPart.value} · ${customizingParts.length} paths`
                  : `${customizingPart.label} · ${customizingPart.value}`
              }
              style={{
                fontSize: 12.5,
                color: '#6b675f',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {customizingParts.length > 1
                ? `${customizingPart.value} · ${customizingParts.length} paths`
                : `${customizingPart.label} · ${customizingPart.value}`}
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
                background: customizationPreviewColor,
                border: '1px solid #ddd9d2',
              }}
            />
            {customizationPreviewColor}
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
            {activeFillCustomization.steps.length === 0 ? (
              <div style={{ fontSize: 11.5, color: '#a5a19a' }}>
                No transforms. The primary theme color is used.
              </div>
            ) : (
              activeFillCustomization.steps.map(({ id, transform }, index) => (
                <div
                  key={id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(82px, 1fr) 64px 26px 26px 26px',
                    gap: 5,
                    alignItems: 'center',
                  }}
                >
                  <select
                    aria-label={`Transform ${index + 1}`}
                    className="field"
                    value={transform.type}
                    onChange={(event) => {
                      const steps = activeFillCustomization.steps.map(
                        (step, stepIndex) =>
                          stepIndex === index
                            ? {
                                ...step,
                                transform: createFillTransform(
                                  event.target
                                    .value as ThemeFillTransform['type'],
                                ),
                              }
                            : step,
                      )
                      setCustomizationSteps(steps)
                    }}
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
                      onChange={(event) => {
                        const steps = activeFillCustomization.steps.map(
                          (step, stepIndex) =>
                            stepIndex === index
                              ? {
                                  ...step,
                                  transform: {
                                    ...transform,
                                    amount: Number(event.target.value),
                                  },
                                }
                              : step,
                        )
                        setCustomizationSteps(steps)
                      }}
                      style={{ minWidth: 0, padding: '5px 6px' }}
                    />
                  ) : (
                    <span style={{ textAlign: 'center', color: '#a5a19a' }}>
                      —
                    </span>
                  )}
                  <button
                    type="button"
                    className="chip-btn"
                    aria-label={`Move ${transform.type} up`}
                    disabled={index === 0}
                    onClick={() => {
                      const steps = [...activeFillCustomization.steps]
                      ;[steps[index - 1], steps[index]] = [
                        steps[index],
                        steps[index - 1],
                      ]
                      setCustomizationSteps(steps)
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="chip-btn"
                    aria-label={`Move ${transform.type} down`}
                    disabled={
                      index === activeFillCustomization.steps.length - 1
                    }
                    onClick={() => {
                      const steps = [...activeFillCustomization.steps]
                      ;[steps[index], steps[index + 1]] = [
                        steps[index + 1],
                        steps[index],
                      ]
                      setCustomizationSteps(steps)
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="chip-btn"
                    aria-label={`Remove ${transform.type}`}
                    onClick={() =>
                      setCustomizationSteps(
                        activeFillCustomization.steps.filter(
                          (step) => step.id !== id,
                        ),
                      )
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
              setCustomizationSteps([
                ...activeFillCustomization.steps,
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
            value={activeFillCustomization.code}
            onChange={(event) => {
              const code = event.target.value
              const parsed = parseColordChain(code)
              setFillCustomization({
                ...activeFillCustomization,
                code,
                steps:
                  parsed === null
                    ? activeFillCustomization.steps
                    : parsed.transforms.map((transform) => ({
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
              borderColor: customizationCodeIsValid ? '#ddd9d2' : '#b45f52',
            }}
          />
          {!customizationCodeIsValid && (
            <div style={{ fontSize: 11, color: '#b45f52' }}>
              Enter a valid colord(...).toHex() chain.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="chip-btn"
              onClick={resetFillCustomization}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn-dark"
              disabled={!customizationCodeIsValid}
              onClick={saveFillCustomization}
              style={{ flex: 1 }}
            >
              Save
            </button>
          </div>
        </div>
      ) : selected ? (
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
          <div className="eyebrow">Selected asset colors</div>

          {fillParts.length > 0 ? (
            <fieldset
              style={{
                border: 0,
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              }}
            >
              <div
                style={{
                  height: 256,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  paddingRight: 4,
                }}
              >
                {fillColorGroups.map((group) => (
                  <div
                    key={group.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        color: '#6b675f',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          flexShrink: 0,
                          borderRadius: 4,
                          background: group.value,
                          border: '1px solid #ddd9d2',
                        }}
                      />
                      <span>{group.value}</span>
                      <span
                        style={{
                          color: '#a5a19a',
                          fontSize: 10.5,
                          fontWeight: 400,
                        }}
                      >
                        {group.parts.length}{' '}
                        {group.parts.length === 1 ? 'path' : 'paths'}
                      </span>
                      <button
                        type="button"
                        className="chip-btn"
                        onClick={() => startFillCustomization(group.parts)}
                        style={{ marginLeft: 'auto' }}
                      >
                        Customize group
                      </button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 7,
                        paddingLeft: 14,
                      }}
                    >
                      {group.parts.map((part) => {
                        const binding = selected.themeFillBindings[part.index]

                        return (
                          <div
                            key={part.index}
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'auto 22px minmax(72px, 1fr) 86px',
                              alignItems: 'center',
                              gap: 7,
                              fontSize: 12,
                              color: '#6b675f',
                            }}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Use theme color for ${part.label}`}
                              checked={Boolean(binding)}
                              onChange={() =>
                                updateFillBindings(
                                  [part.index],
                                  binding ? null : { type: 'primary' },
                                )
                              }
                            />
                            <input
                              type="color"
                              aria-label={`Change source fill for ${part.label}`}
                              title={`Source fill: ${part.value}`}
                              value={colord(part.value).toHex()}
                              onChange={(event) =>
                                updateAsset(selected.id, {
                                  svg: replaceSvgFillSource(
                                    selected.svg,
                                    part.index,
                                    event.target.value,
                                  ),
                                })
                              }
                              style={{ width: 22, height: 22, padding: 2 }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                minWidth: 0,
                              }}
                            >
                              <span
                                title={`${part.label} · ${part.value}`}
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {part.label}
                              </span>
                              {binding?.type === 'custom' && (
                                <span
                                  style={{
                                    flexShrink: 0,
                                    padding: '1px 5px',
                                    border: '1px solid #b8c9c0',
                                    borderRadius: 999,
                                    background: '#eef2ef',
                                    color: '#4a6b5d',
                                    fontSize: 9.5,
                                    fontWeight: 600,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  Customized
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="chip-btn"
                              onClick={() => startFillCustomization([part])}
                            >
                              Customize
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          ) : (
            <div style={{ fontSize: 11.5, color: '#a5a19a', lineHeight: 1.5 }}>
              This SVG has no explicit color fill attributes to override.
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            minWidth: 0,
            borderLeft: '1px solid #efece6',
            paddingLeft: 18,
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Selected asset colors
          </div>
          <div style={{ fontSize: 12, color: '#a5a19a', lineHeight: 1.5 }}>
            Select an asset to assign its palette and theme-enabled fills.
          </div>
        </div>
      )}
    </div>
  )
}
