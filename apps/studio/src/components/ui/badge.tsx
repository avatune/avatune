import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'inline-block bg-white/10 px-2 py-1 rounded text-xs',
  success:
    'inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs',
  muted:
    'inline-block bg-slate-800/60 text-slate-400 px-2 py-1 rounded text-xs',
}

const Badge = ({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) => {
  return (
    <span className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Badge
