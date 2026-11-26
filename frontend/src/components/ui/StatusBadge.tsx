import {
  CalendarClock,
  Timer,
  CircleCheck,
} from 'lucide-react'

export type OrderStatus =
  | 'Agendada'
  | 'Em andamento'
  | 'Concluída'

const statusConfig = {
  Agendada: {
    icon: CalendarClock,
    style: 'bg-accent text-yellow-900',
  },
  'Em andamento': {
    icon: Timer,
    style: 'bg-primary-soft text-primary',
  },
  Concluída: {
    icon: CircleCheck,
    style: 'bg-secondary/30 text-olive-900',
  },
}

export function StatusBadge({
  status,
}: {
  status: OrderStatus
}) {
  const { icon: Icon, style } = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5
        whitespace-nowrap rounded-md px-2.5 py-1
        text-xs font-medium ${style}`}
    >
      <Icon size={14} />
      {status}
    </span>
  )
}
