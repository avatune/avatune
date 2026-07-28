import { useMemo, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import type { ThemeFillBinding } from '../../types'
import { resolveColorSource } from '../../utils/palettes'
import type { SvgFillPart } from '../../utils/svgColors'
import {
  formatColordChain,
  getSvgFillParts,
  parseColordChain,
  setThemeFillBindings,
} from '../../utils/svgColors'
import type { FillCustomization } from './fill-customizer'
import { FillCustomizer } from './fill-customizer'
import { OverrideColors } from './override-colors'
import { PaletteColors } from './palette-colors'

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

interface ThemeColorsProps {
  builder: Builder
  onHighlightChange: (indices: number[] | null) => void
}

export const ThemeColors = ({
  builder,
  onHighlightChange,
}: ThemeColorsProps) => {
  const { meta, selCat, selected, updateAsset } = builder
  const [fillCustomization, setFillCustomization] =
    useState<FillCustomization | null>(null)

  const colorSource = resolveColorSource(meta.paletteConnections, selCat)
  const palette = meta.palettes.find(
    (entry) => entry.id === meta.paletteByCategory[colorSource],
  )
  const configuredPreviewColorId = palette
    ? meta.previewColorByPalette[palette.id]
    : undefined
  const previewColorId = palette?.colors.some(
    (color) => color.id === configuredPreviewColorId,
  )
    ? configuredPreviewColorId
    : palette?.colors[0]?.id
  const themeColor =
    palette?.colors.find((color) => color.id === previewColorId)?.value ??
    palette?.colors[0]?.value ??
    '#000000'

  const selectedSvg = selected?.svg
  const fillParts = useMemo(
    () => (selectedSvg ? getSvgFillParts(selectedSvg) : []),
    [selectedSvg],
  )
  const activeFillCustomization =
    selected && fillCustomization?.assetId === selected.id
      ? fillCustomization
      : null
  const customizingParts = activeFillCustomization
    ? fillParts.filter((part) =>
        activeFillCustomization.fillIndices.includes(part.index),
      )
    : []

  const updateFillBindings = (
    indices: number[],
    binding: ThemeFillBinding | null,
  ) => {
    if (!selected) return
    updateAsset(selected.id, {
      themeFillBindings: setThemeFillBindings(
        selected.themeFillBindings,
        indices,
        binding,
      ),
    })
  }

  const startFillCustomization = (parts: SvgFillPart[]) => {
    if (!selected || parts.length === 0) return
    onHighlightChange(null)
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

  const resetFillCustomization = () => {
    if (!activeFillCustomization) return
    const target =
      customizingParts.length === 1
        ? customizingParts[0].label
        : `${customizingParts.length} paths in this color group`
    if (!window.confirm(`Reset customization for ${target}?`)) return
    updateFillBindings(activeFillCustomization.fillIndices, { type: 'primary' })
    setFillCustomization(null)
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
      <PaletteColors
        builder={builder}
        palette={palette}
        previewColorId={previewColorId}
        colorSource={colorSource === selCat ? undefined : colorSource}
      />

      {selected && activeFillCustomization && customizingParts.length > 0 ? (
        <FillCustomizer
          customization={activeFillCustomization}
          parts={customizingParts}
          themeColor={themeColor}
          onChange={setFillCustomization}
          onSave={saveFillCustomization}
          onReset={resetFillCustomization}
        />
      ) : selected ? (
        <OverrideColors
          // Remounts per asset, so its groups start collapsed on every switch.
          key={selected.id}
          asset={selected}
          fillParts={fillParts}
          updateAsset={updateAsset}
          onUpdateFillBindings={updateFillBindings}
          onCustomize={startFillCustomization}
          onHighlightChange={onHighlightChange}
        />
      ) : (
        <div
          style={{
            minWidth: 0,
            borderLeft: '1px solid #efece6',
            paddingLeft: 18,
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Override colors
          </div>
          <div style={{ fontSize: 12, color: '#a5a19a', lineHeight: 1.5 }}>
            Select an asset to override the colors of its individual paths.
          </div>
        </div>
      )}
    </div>
  )
}
