import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  ReactNativeAvatarItem,
  ReactNativeTheme,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'
import { memo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { ClipPath, Defs, G, Rect, Svg } from 'react-native-svg'

export type AvatarProps<T extends ReactNativeTheme = ReactNativeTheme> =
  AvatarConfig<ReactNativeAvatarItem, T> & {
    /** Theme to use for rendering */
    theme: T
    /** Size of the avatar (default: 400) */
    size?: number
    /** Optional style for the SVG container */
    style?: ViewStyle
    /** Optional ML predictor results for avatar generation */
    predictions?: Predictions
  }

function AvatarComponent<T extends ReactNativeTheme = ReactNativeTheme>({
  theme,
  size = theme.style.size,
  style = {},
  predictions,
  ...restConfig
}: AvatarProps<T>) {
  const config = restConfig as AvatarConfig<ReactNativeAvatarItem, T>
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
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <Defs>
        <ClipPath id={clipIdRef.current}>
          <Rect
            x={0}
            y={0}
            width={size}
            height={size}
            rx={borderRadius}
            ry={borderRadius}
          />
        </ClipPath>
      </Defs>

      {/* Background */}
      {backgroundColor && (
        <Rect
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
      <G clipPath={`url(#${clipIdRef.current})`}>
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
            <G
              key={category}
              transform={`translate(${position.x}, ${position.y}) scale(${scaleFactor})`}
            >
              <Component color={color} />
            </G>
          )
        })}
      </G>

      {/* Border (rendered on top) */}
      {borderColor && borderWidth > 0 && (
        <Rect
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
    </Svg>
  )
}

export const Avatar = memo(AvatarComponent) as typeof AvatarComponent
