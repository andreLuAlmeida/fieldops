import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: ReactNode
}

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover',
  secondary:
    'border border-primary bg-white text-primary hover:bg-primary-soft',
  danger:
    'bg-danger text-white hover:bg-red-700',
  ghost:
    'text-muted hover:bg-gray-100 hover:text-foreground',
}

export function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center
        justify-center gap-2 rounded-lg px-4 py-2.5
        text-sm font-medium transition-colors
        ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
