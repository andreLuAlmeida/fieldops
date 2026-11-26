export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  if (hours === 0) return `${remainder} min`

  return remainder
    ? `${hours}h ${remainder}min`
    : `${hours}h`
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function toLocalDateTime(value: string): string {
  const date = new Date(value)

  const adjusted = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  )

  return adjusted.toISOString().slice(0, 16)
}
