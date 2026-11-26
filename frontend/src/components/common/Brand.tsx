import { Layers3 } from 'lucide-react'

interface BrandProps {
  light?: boolean
}

export function Brand({ light = false }: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center
          rounded-xl ${
            light
              ? 'bg-accent text-primary'
              : 'bg-primary text-accent'
          }`}
      >
        <Layers3 size={26} strokeWidth={2} />
      </div>

      <span
        className={`text-2xl font-bold tracking-tight ${
          light ? 'text-white' : 'text-foreground'
        }`}
      >
        Field
        <span className={light ? 'text-accent' : 'text-primary'}>
          Ops
        </span>
      </span>
    </div>
  )
}
