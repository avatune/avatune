import type { Builder } from '../../hooks/use-builder'

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

  const cursor = dragging ? 'grabbing' : selected ? 'grab' : 'default'

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
          background: '#ffffff',
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
        {visibleLayers.map((layer) => (
          <img
            key={layer.id}
            src={layer.url}
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
      </div>

      {visibleLayers.length === 0 && (
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
    </main>
  )
}
