import type {
  AvatarConfig,
  AvatarPartCategory,
  ReactTheme,
  TypedAvatarConfig,
} from '@avatune/types'
import { metadataToStyle, selectItemFromConfig } from '@avatune/utils'
import { type CSSProperties, useMemo } from 'react'

export type AvatarProps<T extends ReactTheme = ReactTheme> =
  TypedAvatarConfig<T> & {
    /** Theme to use for rendering */
    theme: T
    /** Size of the avatar (default: 400) */
    size?: number
    /** Optional className for the SVG container */
    className?: string
    /** Optional style for the SVG container */
    style?: CSSProperties
  }

/**
 * React component for rendering avatars
 */
export function Avatar<T extends ReactTheme = ReactTheme>({
  theme,
  size = theme.metadata.size,
  className,
  style = {},
  ...restConfig
}: AvatarProps<T>) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: granular tracking needed
  const config = useMemo(
    () => restConfig as AvatarConfig,
    [
      restConfig.seed,
      restConfig.body,
      restConfig.bodyColor,
      restConfig.ears,
      restConfig.earsColor,
      restConfig.eyebrows,
      restConfig.eyebrowsColor,
      restConfig.eyes,
      restConfig.eyesColor,
      restConfig.hair,
      restConfig.hairColor,
      restConfig.head,
      restConfig.headColor,
      restConfig.mouth,
      restConfig.mouthColor,
      restConfig.noses,
      restConfig.nosesColor,
    ],
  )

  const result = useMemo(
    () => selectItemFromConfig(config, theme),
    [config, theme],
  )

  const sortedItems = useMemo(
    () =>
      Object.entries(result.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    [result.selected],
  )

  const scaleFactor = size / theme.metadata.size

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{
        ...(metadataToStyle(theme.metadata) as CSSProperties),
        ...style,
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

        const configColor = config.seed
          ? undefined
          : config[`${category as AvatarPartCategory}Color`]

        return (
          <g
            key={category}
            transform={`translate(${position.x}, ${position.y}) scale(${scaleFactor})`}
            style={{ color: configColor || item.color }}
          >
            <Component />
          </g>
        )
      })}
    </svg>
  )
}
