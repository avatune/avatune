import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  ReactAvatarItem,
  ReactTheme,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'
import { type CSSProperties, memo, useRef } from 'react'

export type AvatarProps<T extends ReactTheme = ReactTheme> = AvatarConfig<
  ReactAvatarItem,
  T
> & {
  /** Theme to use for rendering */
  theme: T
  /** Size of the avatar (default: 400) */
  size?: number
  /** Optional className for the SVG container */
  className?: string
  /** Optional style for the SVG container */
  style?: CSSProperties
  /** Optional ML predictor results for avatar generation */
  predictions?: Predictions
}

function AvatarComponent<T extends ReactTheme = ReactTheme>({
  theme,
  size = theme.style.size,
  className,
  style = {},
  predictions,
  ...restConfig
}: AvatarProps<T>) {
  const config = restConfig as AvatarConfig<ReactAvatarItem, T>
  const result = selectItems(config, theme, predictions)
  const sortedItems = Object.entries(result.selected).sort(
    ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
  )
  const clipIdRef = useRef<string>(Math.random().toString(36).slice(2, 9))

  const scaleFactor = size / theme.style.size
  const borderRadius = parseBorderRadius(theme.style.borderRadius, size)
  const backgroundColor =
    result.style?.backgroundColor || theme.style.backgroundColor
  const borderColor = theme.style.borderColor
  const borderWidth = parseBorderWidth(theme.style.borderWidth)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
    >
      <defs>
        <clipPath id={clipIdRef.current}>
          <rect
            x={0}
            y={0}
            width={size}
            height={size}
            rx={borderRadius}
            ry={borderRadius}
          />
        </clipPath>
      </defs>

      {/* Background */}
      {backgroundColor && (
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          rx={borderRadius}
          ry={borderRadius}
          fill={backgroundColor}
        />
      )}

      {/* Avatar content with clipping */}
      <g clipPath={`url(#${clipIdRef.current})`}>
        {sortedItems.map(([category, item]) => {
          if (!item) {
            return null
          }

          const Component = item.Component

          const position =
            typeof item.position === 'function'
              ? item.position(size)
              : item.position

          const color = result.colors[category as AvatarPartCategory]

          return (
            <g
              key={category}
              transform={`translate(${position.x}, ${position.y}) scale(${scaleFactor})`}
            >
              <Component color={color} />
            </g>
          )
        })}
      </g>

      {/* Border (rendered on top) */}
      {borderColor && borderWidth > 0 && (
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={size - borderWidth}
          height={size - borderWidth}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
      )}
    </svg>
  )
}

/**
 * Memoized Avatar component for optimal performance
 */
export const Avatar = memo(AvatarComponent) as typeof AvatarComponent
