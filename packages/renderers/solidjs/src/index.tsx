import type {
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
  SolidJsAvatarItem,
  SolidJsTheme,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'
import type { JSX } from 'solid-js'
import { createMemo, For, Show, splitProps } from 'solid-js'

const uid = () => Math.random().toString(36).slice(2, 9)

export type AvatarProps<T extends SolidJsTheme = SolidJsTheme> = AvatarConfig<
  SolidJsAvatarItem,
  T
> & {
  theme: T
  size?: number
  class?: string
  style?: JSX.CSSProperties | string
  predictions?: Predictions
}

export function Avatar<T extends SolidJsTheme = SolidJsTheme>(
  props: AvatarProps<T>,
) {
  const [local, restConfig] = splitProps(props, [
    'theme',
    'size',
    'class',
    'style',
    'predictions',
  ])

  const config = restConfig as AvatarConfig<SolidJsAvatarItem, T>

  const size = createMemo(() => local.size ?? local.theme.style.size)

  const result = createMemo(() =>
    selectItems(config, local.theme, local.predictions),
  )

  const sortedItems = createMemo(
    () =>
      Object.entries(result().selected)
        .filter(([, item]) => item != null)
        .sort(([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0)) as [
        AvatarPartCategory,
        SolidJsAvatarItem,
      ][],
  )

  const clipId = uid()
  const uidValue = uid()

  const scaleFactor = createMemo(() => size() / local.theme.style.size)
  const borderRadius = createMemo(() =>
    parseBorderRadius(
      result().style?.borderRadius ?? local.theme.style.borderRadius,
      size(),
    ),
  )
  const backgroundColor = createMemo(
    () => result().style?.backgroundColor || local.theme.style.backgroundColor,
  )
  const borderColor = createMemo(() => local.theme.style.borderColor)
  const borderWidth = createMemo(() =>
    parseBorderWidth(local.theme.style.borderWidth),
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
      width={size()}
      height={size()}
      viewBox={`0 0 ${size()} ${size()}`}
      class={local.class}
      style={local.style}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={0}
            y={0}
            width={size()}
            height={size()}
            rx={borderRadius()}
            ry={borderRadius()}
          />
        </clipPath>
      </defs>

      <Show when={backgroundColor()}>
        <rect
          x={0}
          y={0}
          width={size()}
          height={size()}
          rx={borderRadius()}
          ry={borderRadius()}
          fill={backgroundColor()}
        />
      </Show>

      <g clip-path={`url(#${clipId})`}>
        <For each={sortedItems()}>
          {([category, item]) => {
            const position = createMemo(() =>
              typeof item.position === 'function'
                ? item.position(size())
                : item.position,
            )
            const color = createMemo(
              () => result().colors[category as AvatarPartCategory],
            )
            const Component = item.Component

            return (
              <g
                data-testid={`avatar-item-${category}-${item.layer}`}
                transform={`translate(${position().x}, ${position().y}) scale(${scaleFactor()})`}
              >
                <Component color={color()} uid={uidValue} />
              </g>
            )
          }}
        </For>
      </g>

      <Show when={borderColor() && borderWidth() > 0}>
        <rect
          x={borderWidth() / 2}
          y={borderWidth() / 2}
          width={size() - borderWidth()}
          height={size() - borderWidth()}
          rx={borderRadius()}
          ry={borderRadius()}
          fill="none"
          stroke={borderColor()}
          stroke-width={borderWidth()}
        />
      </Show>
    </svg>
  )
}
