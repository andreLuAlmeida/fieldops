import { useState } from 'react'
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom'
import {
  ArrowLeft, ClipboardList, MapPin, UserRound,
  CalendarClock, ListChecks, Pencil, Trash2,
  PlayCircle, CircleCheck,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Feedback } from '../../components/ui/Feedback'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

import {
  getOrder, deleteOrder, executeOrder, orderTotal,
} from '../../services/orderService'

import {
  formatCurrency, formatDateTime,
} from '../../utils/formatters'

import type { OrderDetails } from '../../types/order'

function OrderView({ initial }: { initial: OrderDetails }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [order, setOrder] = useState(initial)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string>(
    location.state?.success ?? '',
  )

  const admin = user?.role === 'ADMIN'
  const base = admin ? '/admin/ordens' : '/tecnico/ordens'

  function handleDelete() {
    try {
      deleteOrder(order.id)

      navigate(base, {
        replace: true,
        state: { success: 'Ordem de serviço excluída com sucesso!' },
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha na exclusão.')
      setSuccess('')
      setConfirming(false)
    }
  }

  function handleExecution(action: 'start' | 'finish') {
    setError('')
    setSuccess('')

    try {
      setOrder(executeOrder(order.id, action))

      setSuccess(action === 'start'
        ? 'Atendimento iniciado com sucesso!'
        : 'Atendimento concluído com sucesso!')
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Falha na operação.',
      )
    }
  }

  const fields = [
    { label: 'Cliente', value: order.clientName, icon: UserRound },
    { label: 'Endereço', value: order.address, icon: MapPin },
    {
      label: 'Técnico responsável',
      value: order.reservation.technicianName,
      icon: UserRound,
    },
    {
      label: 'Início previsto',
      value: formatDateTime(order.reservation.start),
      icon: CalendarClock,
    },
    {
      label: 'Fim previsto',
      value: formatDateTime(order.reservation.end),
      icon: CalendarClock,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <Link to={base}
        className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            {admin ? 'Ordem de serviço' : 'Atendimento'}
          </h1>
          <p className="mt-1 text-sm text-primary">
            OS-{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <Feedback message={success} type="success" />
      <Feedback message={error} type="error" />

      <section className="space-y-6 rounded-xl border
        border-border bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-primary">
          <ClipboardList size={20} />
          Dados do atendimento
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-soft p-3 text-primary">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-muted">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted">Observações</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">
            {order.notes || 'Nenhuma observação informada.'}
          </p>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border
        border-border bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-primary">
          <ListChecks size={20} />
          Serviços da ordem
        </h2>

        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id}
              className="flex flex-wrap items-center
                justify-between gap-3 py-4">
              <div>
                <p className="font-medium">{item.serviceName}</p>
                <p className="text-sm text-muted">
                  {item.quantity} unidade(s)
                  {admin && ` × ${formatCurrency(item.unitPrice)}`}
                </p>
              </div>

              {admin && (
                <p className="font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </p>
              )}
            </div>
          ))}
        </div>

        {admin && (
          <div className="flex justify-end gap-4 border-t
            border-border pt-4">
            <span className="text-muted">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(orderTotal(order))}
            </span>
          </div>
        )}
      </section>

      {order.startedAt && (
        <section className="space-y-3 rounded-xl border
          border-border bg-white p-6">
          <h2 className="font-semibold">Registro de execução</h2>
          <p className="text-sm">
            Início real: {formatDateTime(order.startedAt)}
          </p>
          {order.finishedAt && (
            <p className="text-sm">
              Conclusão real: {formatDateTime(order.finishedAt)}
            </p>
          )}
        </section>
      )}

      {admin && order.status === 'Agendada' && (
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="danger" icon={<Trash2 size={18} />}
            onClick={() => setConfirming(true)}>
            Excluir ordem
          </Button>
          <Button icon={<Pencil size={18} />}
            onClick={() => navigate(`${base}/${order.id}/editar`)}>
            Editar ordem
          </Button>
        </div>
      )}

      {!admin && order.status === 'Agendada' && (
        <Button className="w-full" icon={<PlayCircle size={20} />}
          onClick={() => handleExecution('start')}>
          Iniciar atendimento
        </Button>
      )}

      {!admin && order.status === 'Em andamento' && (
        <Button className="w-full" icon={<CircleCheck size={20} />}
          onClick={() => handleExecution('finish')}>
          Concluir atendimento
        </Button>
      )}

      {order.status === 'Concluída' && (
        <div className="flex items-center justify-center gap-2
          rounded-xl bg-secondary/30 p-4 font-medium">
          <CircleCheck size={20} />
          Atendimento finalizado
        </div>
      )}

      {confirming && (
        <ConfirmDialog
          title="Excluir ordem de serviço?"
          description={`Serão excluídos 1 ordem de serviço, ${order.items.length} item(ns) e 1 reserva de agenda. Esta operação não poderá ser desfeita.`}
          onCancel={() => setConfirming(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export function OrderDetailsPage() {
  const { id } = useParams()

  let order: OrderDetails

  try {
    order = getOrder(id ?? '')
  } catch {
    return (
      <div className="space-y-4">
        <Feedback
          type="error"
          message="Ordem de serviço não encontrada ou acesso não autorizado."
        />
        <Link to="/admin/ordens" className="text-primary">
          Voltar
        </Link>
      </div>
    )
  }

  return <OrderView key={id} initial={order} />
}
