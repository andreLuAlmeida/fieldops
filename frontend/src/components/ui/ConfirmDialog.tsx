import { useEffect, useId, useRef } from 'react'
import { TriangleAlert, Trash2, X } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()

    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md
        rounded-2xl bg-white p-6 shadow-xl
        backdrop:bg-black/50"
    >

      <div className="flex items-start gap-4">

        <div className="rounded-full bg-red-100
          p-3 text-danger">
          <TriangleAlert size={24} />
        </div>

        <div className="flex-1">

          <h2 id={titleId} className="text-xl font-semibold">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed
            text-muted">
            {description}
          </p>

        </div>

        <button
          aria-label="Fechar"
          onClick={onCancel}
          className="text-gray-400 hover:text-foreground"
        >
          <X size={20} />
        </button>

      </div>

      <div className="mt-7 flex flex-wrap justify-end gap-3">

        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          variant="danger"
          icon={<Trash2 size={18} />}
          onClick={onConfirm}
        >
          Confirmar exclusão
        </Button>

      </div>
    </dialog>
  )
}
