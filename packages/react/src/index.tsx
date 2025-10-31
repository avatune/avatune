import type {
  AvatarConfig,
  AvatarPartCategory,
  ReactTheme,
  TypedAvatarConfig,
} from '@avatune/types'
import {
  AVATAR_CATEGORIES,
  BASE_AVATAR_SIZE,
  selectItemFromConfig,
} from '@avatune/utils'
import { type CSSProperties, useMemo } from 'react'

export type AvatarProps<T extends ReactTheme = ReactTheme> =
  TypedAvatarConfig<T> & {
    /** Theme to use for rendering */
    theme: T
    /** Width of the avatar (default: 400) */
    width?: number
    /** Height of the avatar (default: 400) */
    height?: number
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
  width = BASE_AVATAR_SIZE,
  height = BASE_AVATAR_SIZE,
  className,
  style,
  ...config
}: AvatarProps<T>) {
  const configDep = AVATAR_CATEGORIES.flatMap((category) => [
    config[category],
    config[`${category}Color`],
  ]).join(',')
  // biome-ignore lint/correctness/useExhaustiveDependencies: configDep is enough
  const result = useMemo(
    () => selectItemFromConfig(config as AvatarConfig, theme),
    [theme, configDep],
  )

  const sortedItems = useMemo(
    () =>
      Object.entries(result.selected).sort(
        ([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0),
      ),
    [result.selected],
  )

  const scaleFactor = width / BASE_AVATAR_SIZE

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
    >
      {sortedItems.map(([category, item]) => {
        if (!item) {
          return null
        }

        const Component = item.Component

        // Convert percentage positions to pixel coordinates
        const transformX = width * item.position.x
        const transformY = height * item.position.y

        const configColor = config.seed
          ? undefined
          : config[`${category}Color` as `${AvatarPartCategory}Color`]

        return (
          <g
            key={category}
            transform={`translate(${transformX}, ${transformY}) scale(${scaleFactor})`}
            style={{ color: configColor || item.color }}
          >
            <Component />
          </g>
        )
      })}
    </svg>
  )
}
