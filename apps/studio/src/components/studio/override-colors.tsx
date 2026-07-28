import { colord } from 'colord'
import { useMemo, useState } from 'react'
import type { Builder, BuilderAsset } from '../../hooks/use-builder'
import type { ThemeFillBinding } from '../../types'
import type { SvgFillPart } from '../../utils/svgColors'
import { replaceSvgFillSource } from '../../utils/svgColors'
import { ChevronIcon, CustomizeIcon } from './icons'

interface FillColorGroup {
  key: string
  value: string
  parts: SvgFillPart[]
}

const groupPartsByColor = (parts: SvgFillPart[]): FillColorGroup[] => {
  const groups: FillColorGroup[] = []
  const groupsByColor = new Map<string, FillColorGroup>()

  for (const part of parts) {
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
}

interface OverrideColorsProps {
  asset: BuilderAsset
  fillParts: SvgFillPart[]
  updateAsset: Builder['updateAsset']
  onUpdateFillBindings: (
    indices: number[],
    binding: ThemeFillBinding | null,
  ) => void
  onCustomize: (parts: SvgFillPart[]) => void
  /** Highlights the matching paths on the preview while hovered or focused. */
  onHighlightChange: (indices: number[] | null) => void
}

export const OverrideColors = ({
  asset,
  fillParts,
  updateAsset,
  onUpdateFillBindings,
  onCustomize,
  onHighlightChange,
}: OverrideColorsProps) => {
  const [expandedKeys, setExpandedKeys] = useState<ReadonlySet<string>>(
    new Set(),
  )
  const groups = useMemo(() => groupPartsByColor(fillParts), [fillParts])

  const toggleGroup = (key: string) =>
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (!next.delete(key)) next.add(key)
      return next
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
      <div className="eyebrow">Override colors</div>

      {fillParts.length === 0 ? (
        <div style={{ fontSize: 11.5, color: '#a5a19a', lineHeight: 1.5 }}>
          This SVG has no explicit color fill attributes to override.
        </div>
      ) : (
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
              maxHeight: 256,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              paddingRight: 4,
            }}
          >
            {groups.map((group) => {
              const expanded = expandedKeys.has(group.key)
              const groupIndices = group.parts.map(({ index }) => index)
              const boundIndices = groupIndices.filter(
                (index) => asset.themeFillBindings[index],
              )
              const allBound = boundIndices.length === groupIndices.length
              const someBound = boundIndices.length > 0

              return (
                <div
                  key={group.key}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: passive hover highlight over the whole row — every action inside it is a real control, and onFocus covers keyboard users */}
                  <div
                    className="fill-group-header"
                    onMouseEnter={() => onHighlightChange(groupIndices)}
                    onMouseLeave={() => onHighlightChange(null)}
                    onFocus={() => onHighlightChange(groupIndices)}
                    onBlur={() => onHighlightChange(null)}
                  >
                    <input
                      type="checkbox"
                      aria-label={`Use theme color for every ${group.value} path`}
                      title={
                        allBound
                          ? 'Clear the theme color from this group'
                          : 'Use the theme color for this group'
                      }
                      checked={allBound}
                      ref={(node) => {
                        if (node) node.indeterminate = someBound && !allBound
                      }}
                      onChange={() =>
                        // Selecting only fills the gaps, so paths with a custom
                        // chain keep it.
                        allBound
                          ? onUpdateFillBindings(groupIndices, null)
                          : onUpdateFillBindings(
                              groupIndices.filter(
                                (index) => !asset.themeFillBindings[index],
                              ),
                              { type: 'primary' },
                            )
                      }
                    />
                    <button
                      type="button"
                      className="fill-group-toggle"
                      aria-expanded={expanded}
                      onClick={() => toggleGroup(group.key)}
                    >
                      <ChevronIcon open={expanded} />
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
                    </button>
                    <button
                      type="button"
                      className="chip-btn icon-btn"
                      title="Customize color group"
                      aria-label={`Customize the ${group.value} color group`}
                      onClick={() => onCustomize(group.parts)}
                    >
                      <CustomizeIcon />
                    </button>
                  </div>

                  {expanded && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 7,
                        paddingLeft: 14,
                      }}
                    >
                      {group.parts.map((part) => {
                        const binding = asset.themeFillBindings[part.index]

                        return (
                          // biome-ignore lint/a11y/noStaticElementInteractions: passive hover highlight over the whole row — every action inside it is a real control, and onFocus covers keyboard users
                          <div
                            key={part.index}
                            onMouseEnter={() => onHighlightChange([part.index])}
                            onMouseLeave={() => onHighlightChange(null)}
                            onFocus={() => onHighlightChange([part.index])}
                            onBlur={() => onHighlightChange(null)}
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'auto 22px minmax(72px, 1fr) auto',
                              alignItems: 'center',
                              gap: 7,
                              fontSize: 12,
                              color: '#6b675f',
                              padding: '4px 5px',
                              borderRadius: 6,
                            }}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Use theme color for ${part.label}`}
                              checked={Boolean(binding)}
                              onChange={() =>
                                onUpdateFillBindings(
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
                                updateAsset(asset.id, {
                                  svg: replaceSvgFillSource(
                                    asset.svg,
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
                              className="chip-btn icon-btn"
                              title="Customize fill"
                              aria-label={`Customize ${part.label}`}
                              onClick={() => onCustomize([part])}
                            >
                              <CustomizeIcon />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
