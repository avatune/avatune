import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import {
  createSvgFillPickerElement,
  replaceSvgFillParts,
  svgToDataUrl,
} from '../../utils/svgColors'
import { ThemeColors } from './theme-colors'

interface StageProps {
  builder: Builder
}

const getFillIndex = (target: EventTarget | null): number | null => {
  if (!(target instanceof Element)) return null
  const fillElement = target.closest('[data-avatune-fill-index]')
  if (!fillElement) return null
  const index = Number(fillElement.getAttribute('data-avatune-fill-index'))
  return Number.isInteger(index) ? index : null
}

export const Stage = ({ builder }: StageProps) => {
  const {
    meta,
    selected,
    selId,
    dragging,
    visibleLayers,
    stageRef,
    onStageMouseDown,
    onStageKeyDown,
  } = builder
  const [isFillPickerActive, setIsFillPickerActive] = useState(false)
  const [hoveredFillIndex, setHoveredFillIndex] = useState<number | null>(null)
  const [focusedFill, setFocusedFill] = useState<{
    assetId: string
    index: number
  } | null>(null)
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const focusedFillIndex =
    focusedFill && focusedFill.assetId === selected?.id
      ? focusedFill.index
      : null

  const handleFillPickerChange = (active: boolean) => {
    setIsFillPickerActive(active)
    if (!active) setHoveredFillIndex(null)
  }

  const handlePickerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    setHoveredFillIndex(getFillIndex(event.target))
  }

  const handlePickerClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const fillIndex = getFillIndex(event.target)
    if (fillIndex !== null && selected) {
      setFocusedFill({ assetId: selected.id, index: fillIndex })
    }
  }

  const handlePickerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if ((event.key === 'Enter' || event.key === ' ') && selected) {
      event.preventDefault()
      setFocusedFill({
        assetId: selected.id,
        index: hoveredFillIndex ?? focusedFillIndex ?? 0,
      })
    }
  }

  const cursor = isFillPickerActive
    ? 'crosshair'
    : dragging
      ? 'grabbing'
      : selected
        ? 'grab'
        : 'default'
  const paletteById = useMemo(
    () =>
      Object.fromEntries(meta.palettes.map((palette) => [palette.id, palette])),
    [meta.palettes],
  )
  const backgroundPalette = paletteById[meta.paletteByCategory.background ?? '']
  const backgroundColorId = backgroundPalette
    ? meta.previewColorByPalette[backgroundPalette.id]
    : undefined
  const backgroundColor =
    backgroundPalette?.colors.find((color) => color.id === backgroundColorId)
      ?.value ??
    backgroundPalette?.colors[0]?.value ??
    '#ffffff'
  const previewLayers = useMemo(
    () =>
      visibleLayers.map((layer) => {
        const palette =
          paletteById[meta.paletteByCategory[layer.category] ?? '']
        const previewColorId = palette
          ? meta.previewColorByPalette[palette.id]
          : undefined
        const color =
          palette?.colors.find((entry) => entry.id === previewColorId)?.value ??
          palette?.colors[0]?.value ??
          '#000000'
        const previewSvg = replaceSvgFillParts(
          layer.svg,
          layer.themeFillBindings,
          color,
        )
        return {
          ...layer,
          previewSvg,
          previewUrl: svgToDataUrl(previewSvg),
        }
      }),
    [
      meta.paletteByCategory,
      meta.previewColorByPalette,
      paletteById,
      visibleLayers,
    ],
  )
  const pickerLayer = isFillPickerActive
    ? previewLayers.find((layer) => layer.id === selected?.id)
    : undefined
  useEffect(() => {
    const container = pickerRef.current
    if (!container || !pickerLayer) return
    const pickerSvg = createSvgFillPickerElement(pickerLayer.previewSvg)
    if (!pickerSvg) return
    container.replaceChildren(pickerSvg)
    return () => pickerSvg.remove()
  }, [pickerLayer])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 32,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 28,
          right: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 500, color: '#6b675f' }}>
          Preview &amp; Adjust
        </div>
        <div style={{ fontSize: 11.5, color: '#a5a19a' }}>
          {isFillPickerActive
            ? 'Hover a path · click to locate its color'
            : 'Drag to move · arrow keys nudge · ⇧ = ×10 · scroll to scale'}
        </div>
      </div>

      <div
        ref={stageRef}
        role="application"
        aria-label="Avatar preview — drag, nudge with arrow keys, scroll to scale"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: interactive canvas needs focus for keyboard nudge/scale
        tabIndex={0}
        onMouseDown={onStageMouseDown}
        onKeyDown={onStageKeyDown}
        style={{
          width: meta.size,
          height: meta.size,
          position: 'relative',
          background: backgroundColor,
          border: '1px solid #e0dcd4',
          borderRadius: `${meta.radius}%`,
          boxShadow: '0 2px 12px rgba(28,27,25,0.06)',
          outline: 'none',
          cursor,
          overflow: meta.clip ? 'hidden' : 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: '#efece6',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            background: '#efece6',
            pointerEvents: 'none',
          }}
        />
        {previewLayers.map((layer) => (
          <img
            key={layer.id}
            src={layer.previewUrl}
            alt=""
            style={{
              position: 'absolute',
              left: `${layer.x}%`,
              top: `${layer.y}%`,
              width: `${layer.scale}%`,
              transform: `translate(-50%,-50%) rotate(${layer.rotation}deg)`,
              zIndex: layer.layer,
              outline: layer.id === selId ? '1.5px dashed #4a6b5d' : 'none',
              outlineOffset: 2,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ))}
        {pickerLayer && (
          <div
            ref={pickerRef}
            className="svg-fill-picker"
            role="application"
            aria-label="Pick a path from the selected SVG"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: the SVG path picker needs focus for keyboard selection
            tabIndex={0}
            onMouseMove={handlePickerMove}
            onMouseLeave={() => setHoveredFillIndex(null)}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handlePickerClick}
            onKeyDown={handlePickerKeyDown}
            style={{
              position: 'absolute',
              left: `${pickerLayer.x}%`,
              top: `${pickerLayer.y}%`,
              width: `${pickerLayer.scale}%`,
              transform: `translate(-50%,-50%) rotate(${pickerLayer.rotation}deg)`,
              zIndex: pickerLayer.layer,
              cursor: 'crosshair',
            }}
          />
        )}
        {isFillPickerActive && hoveredFillIndex !== null && (
          <div
            aria-live="polite"
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10_000,
              padding: '5px 8px',
              border: '1px solid #b8c9c0',
              borderRadius: 5,
              background: 'rgba(255,255,255,0.96)',
              color: '#33493f',
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 11,
              fontWeight: 600,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(28,27,25,0.1)',
            }}
          >
            Path {hoveredFillIndex}
          </div>
        )}
      </div>

      {previewLayers.length === 0 && (
        <div
          style={{
            fontSize: 13,
            color: '#a5a19a',
            textAlign: 'center',
            maxWidth: 320,
          }}
        >
          Upload SVG assets to a category on the left — the first asset of each
          visible category is composed here.
        </div>
      )}
      <section
        aria-label="Theme colors"
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 18,
          zIndex: 100,
          maxWidth: 860,
          margin: '0 auto',
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid #ddd9d2',
          borderRadius: 10,
          maxHeight: 'calc(100% - 76px)',
          overflowY: 'auto',
          boxShadow: '0 8px 28px rgba(28,27,25,0.12)',
        }}
      >
        <ThemeColors
          builder={builder}
          isFillPickerActive={isFillPickerActive}
          focusedFillIndex={focusedFillIndex}
          onFillPickerActiveChange={handleFillPickerChange}
        />
      </section>
    </main>
  )
}
