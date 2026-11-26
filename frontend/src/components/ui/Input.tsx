import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
  action?: ReactNode
}

export function Input({
  label,
  error,
  icon,
  action,
  id,
  required,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute
            inset-y-0 left-3 flex items-center text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={fieldId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={`w-full rounded-lg border bg-white
            py-3 text-sm outline-none transition-colors
            placeholder:text-gray-400
            ${icon ? 'pl-10' : 'pl-3'}
            ${action ? 'pr-11' : 'pr-3'}
            ${error
              ? 'border-danger'
              : 'border-gray-300 focus:border-primary'}
            ${className}`}
          {...props}
        />

        {action && (
          <div className="absolute inset-y-0 right-3
            flex items-center">
            {action}
          </div>
        )}
      </div>

      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
