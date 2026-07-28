import type { CSSProperties, ReactNode } from 'react'

interface IconProps {
  size?: number
}

const Icon = ({
  size,
  style,
  children,
}: {
  size: number
  style?: CSSProperties
  children: ReactNode
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={style}
  >
    {children}
  </svg>
)

export const PencilIcon = ({ size = 12 }: IconProps) => (
  <Icon size={size}>
    <path d="M11.9 1.6a1.4 1.4 0 0 1 2 2L5.2 12.3l-3 .7.7-3 9-8.4Z" />
  </Icon>
)

/** Sliders — opens the fill transform editor. */
export const CustomizeIcon = ({ size = 13 }: IconProps) => (
  <Icon size={size}>
    <path d="M2 4.5h6M11 4.5h3M2 11.5h3M8 11.5h6" />
    <circle cx="9.5" cy="4.5" r="1.6" />
    <circle cx="6.5" cy="11.5" r="1.6" />
  </Icon>
)

/** Eye — previews the avatar with a color. */
export const EyeIcon = ({ size = 13 }: IconProps) => (
  <Icon size={size}>
    <path d="M1 8s2.6-4.2 7-4.2S15 8 15 8s-2.6 4.2-7 4.2S1 8 1 8Z" />
    <circle cx="8" cy="8" r="1.9" />
  </Icon>
)

export const ChevronIcon = ({
  size = 11,
  open = false,
}: IconProps & { open?: boolean }) => (
  <Icon
    size={size}
    style={{
      flexShrink: 0,
      transform: open ? 'rotate(90deg)' : 'none',
      transition: 'transform 120ms ease',
    }}
  >
    <path d="M6 3.5 10.5 8 6 12.5" />
  </Icon>
)
