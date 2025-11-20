import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  ReactNativeAvatarItem,
  ReactNativeTheme,
} from '@avatune/types'
import { selectItems, themeStyleToStyleProp } from '@avatune/utils'
import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { G, Svg } from 'react-native-svg'

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

/**
 * React Native component for rendering avatars
 */
export function Avatar<T extends ReactNativeTheme = ReactNativeTheme>({
  theme,
  size = theme.style.size,
  style = {},
  predictions,
  ...restConfig
}: AvatarProps<T>) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: granular tracking needed
  const config = useMemo(
    () => restConfig as AvatarConfig<ReactNativeAvatarItem, T>,
    [
      restConfig.seed,
      restConfig.backgroundColor,
      restConfig.glasses,
      restConfig.glassesColor,
      restConfig.hats,
      restConfig.hatsColor,
      restConfig.hair,
      restConfig.hairColor,
      restConfig.faceDetails,
      restConfig.faceDetailsColor,
      restConfig.body,
      restConfig.bodyColor,
      restConfig.ears,
      restConfig.earsColor,
      restConfig.eyebrows,
      restConfig.eyebrowsColor,
      restConfig.eyes,
      restConfig.eyesColor,
      restConfig.faceHair,
      restConfig.faceHairColor,
      restConfig.forelock,
      restConfig.forelockColor,
      restConfig.head,
      restConfig.headColor,
      restConfig.mouth,
      restConfig.mouthColor,
      restConfig.neck,
      restConfig.neckColor,
      restConfig.noses,
      restConfig.nosesColor,
    ],
  )

  const result = useMemo(
    () => selectItems(config, theme, predictions),
    [config, theme, predictions],
  )

  const sortedItems = useMemo(
    () =>
      Object.entries(result.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    [result.selected],
  )

  const scaleFactor = size / theme.style.size

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        ...(themeStyleToStyleProp(result.style) as ViewStyle),
        ...style,
        overflow: 'hidden',
      }}
    >
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
    </Svg>
  )
}
