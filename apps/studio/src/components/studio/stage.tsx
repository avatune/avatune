import { useEffect, useMemo, useRef, useState } from 'react'
import type { Builder } from '../../hooks/use-builder'
import { resolvePaletteId } from '../../utils/palettes'
import {
  createSvgFillOverlayElement,
  replaceSvgFillParts,
  svgToDataUrl,
} from '../../utils/svgColors'
import { ThemeColors } from './theme-colors'

interface StageProps {
  builder: Builder
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
  const [highlightedFills, setHighlightedFills] = useState<number[] | null>(
    null,
  )
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const cursor = dragging ? 'grabbing' : selected ? 'grab' : 'default'
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
          paletteById[resolvePaletteId(meta, layer.category) ?? '']
        const previewColorId = palette
          ? meta.previewColorByPalette[palette.id]
          : undefined
        const color =
          palette?.colors.find((entry) => entry.id === previewColorId)?.value ??
          palette?.colors[0]?.value
        // Without a palette the asset keeps the colors baked into its own SVG.
        const previewSvg = color
          ? replaceSvgFillParts(layer.svg, layer.themeFillBindings, color)
          : layer.svg
        return {
          ...layer,
          previewSvg,
          previewUrl: svgToDataUrl(previewSvg),
        }
      }),
    [meta, paletteById, visibleLayers],
  )
  const overlayLayer = previewLayers.find((layer) => layer.id === selected?.id)
  // Keyed on the markup, not on the layer — dragging changes the layer object
  // every frame but leaves the SVG (and so the overlay) untouched.
  const overlayMarkup = overlayLayer?.previewSvg
  useEffect(() => {
    const container = overlayRef.current
    if (!container || !overlayMarkup) return
    const overlaySvg = createSvgFillOverlayElement(overlayMarkup)
    if (!overlaySvg) return
    container.replaceChildren(overlaySvg)
    return () => overlaySvg.remove()
  }, [overlayMarkup])

  // The hovered fill lives in the colors panel, so the highlight is driven by
  // class rather than by :hover on the overlay itself. Depends on the markup
  // too, so the classes survive a rebuild by the effect above.
  useEffect(() => {
    const container = overlayRef.current
    if (!container || !overlayMarkup) return
    for (const element of Array.from(
      container.querySelectorAll('[data-avatune-fill-index]'),
    )) {
      const index = Number(element.getAttribute('data-avatune-fill-index'))
      element.classList.toggle(
        'is-highlighted',
        Boolean(highlightedFills?.includes(index)),
      )
    }
  }, [highlightedFills, overlayMarkup])

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
          Drag to move · arrow keys nudge · ⇧ = ×10 · scroll to scale
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
        {overlayLayer && (
          <div
            ref={overlayRef}
            className="svg-fill-overlay"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: `${overlayLayer.x}%`,
              top: `${overlayLayer.y}%`,
              width: `${overlayLayer.scale}%`,
              transform: `translate(-50%,-50%) rotate(${overlayLayer.rotation}deg)`,
              zIndex: 9_999,
            }}
          />
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
          onHighlightChange={setHighlightedFills}
        />
      </section>
    </main>
  )
}
