import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'small'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'inline-flex items-center justify-center rounded-full bg-pink-400 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-pink-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
  secondary:
    'inline-flex items-center justify-center rounded-full bg-slate-700 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-slate-600 hover:scale-105',
  ghost:
    'inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10',
  small:
    'px-4 py-2 rounded-md text-sm bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all',
}

const Button = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
