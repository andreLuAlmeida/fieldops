import { CircleAlert, CircleCheck } from 'lucide-react'

interface FeedbackProps {
  message: string
  type: 'error' | 'success'
}

export function Feedback({ message, type }: FeedbackProps) {
  if (!message) return null

  const isError = type === 'error'
  const Icon = isError ? CircleAlert : CircleCheck

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-center gap-3 rounded-lg
        p-4 text-sm ${
          isError
            ? 'bg-red-50 text-danger'
            : 'bg-green-50 text-success'
        }`}
    >
      <Icon size={20} className="shrink-0" />
      {message}
    </div>
  )
}
