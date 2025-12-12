import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardSection = ({
  children,
  className = '',
  ...props
}: CardSectionProps) => {
  return (
    <div
      className={`p-6 bg-white/5 rounded-lg border border-white/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardSection }
