import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function PageHeader({
  title,
  description,
  icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center
      justify-between gap-4">

      <div className="flex items-center gap-4">

        {icon && (
          <div className="rounded-xl bg-primary-soft
            p-3 text-primary">
            {icon}
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-1 text-sm text-muted">
            {description}
          </p>
        </div>

      </div>

      {action}

    </div>
  )
}
