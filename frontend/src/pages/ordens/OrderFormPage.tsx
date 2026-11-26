import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ClipboardList, ListChecks,
  CalendarClock, MapPin, Plus, Trash2, Save, Info,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import { getClients } from '../../services/clientService'
import { getTechnicians } from '../../services/technicianService'
import { getServices } from '../../services/catalogService'

import {
  getOrder, createOrder, updateOrder,
} from '../../services/orderService'

import type {
  OrderDetails, OrderInput,
} from '../../types/order'

import {
  formatCurrency, toLocalDateTime,
} from '../../utils/formatters'

const selectStyle =
  'w-full rounded-lg border border-gray-300 bg-white p-3 text-sm'

function OrderForm({ order }: { order?: OrderDetails }) {
  const navigate = useNavigate()

  const [clients] = useState(getClients)

  const [technicians] = useState(
    () => getTechnicians().filter((item) => item.active),
  )

  const [services] = useState(getServices)

  const [form, setForm] = useState<OrderInput>(() => ({
    clientId: order?.clientId ?? '',
    address: order?.address ?? '',
    notes: order?.notes ?? '',
    technicianId: order?.reservation.technicianId ?? '',
    start: order ? toLocalDateTime(order.reservation.start) : '',
    end: order ? toLocalDateTime(order.reservation.end) : '',
    items: order ? order.items.map((item) => ({
      serviceId: item.serviceId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) : [],
  }))

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')

  function update(
    key: Exclude<keyof OrderInput, 'items'>,
    value: string,
  ) {
    setForm((old) => ({ ...old, [key]: value }))
    setErrors((old) => ({ ...old, [key]: '' }))
    setMessage('')
  }

  function addItem() {
    const service = services[0]

    if (!service) return

    setForm((old) => ({
      ...old,
      items: [...old.items, {
        serviceId: service.id,
        quantity: 1,
        unitPrice: service.referencePrice,
      }],
    }))

    setErrors((old) => ({ ...old, items: '' }))
    setMessage('')
  }

  function changeItem(
    index: number,
    changes: Partial<OrderInput['items'][number]>,
  ) {
    setForm((old) => ({
      ...old,
      items: old.items.map((item, i) =>
        i === index ? { ...item, ...changes } : item,
      ),
    }))

    setErrors((old) => ({
      ...old,
      [`quantity-${index}`]: '',
      [`price-${index}`]: '',
    }))

    setMessage('')
  }

  function removeItem(index: number) {
    setForm((old) => ({
      ...old,
      items: old.items.filter((_, i) => i !== index),
    }))

    setErrors({})
    setMessage('')
  }

  const total = form.items.reduce(
    (sum, item) =>
      sum + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  ) / 100

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: Record<string, string> = {}

    if (!form.clientId) {
      next.clientId = 'Selecione um cliente.'
    }

    if (!form.address.trim()) {
      next.address = 'Informe o endereço.'
    }

    if (!form.technicianId) {
      next.technicianId = 'Selecione um técnico.'
    }

    if (!form.start) {
      next.start = 'Informe o horário inicial.'
    }

    if (!form.end) {
      next.end = 'Informe o horário final.'
    }

    if (form.start && form.end && form.end <= form.start) {
      next.end = 'O horário final deve ser posterior ao inicial.'
    }

    if (!form.items.length) {
      next.items = 'Adicione pelo menos um item.'
    }

    form.items.forEach((item, index) => {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        next[`quantity-${index}`] = 'Informe um inteiro positivo.'
      }

      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        next[`price-${index}`] = 'Informe um valor não negativo.'
      }
    })

    setErrors(next)
    setMessage('')

    if (Object.keys(next).length) return

    try {
      const saved = order
        ? updateOrder(order.id, form)
        : createOrder(form)

      navigate(`/admin/ordens/${saved.id}`, {
        replace: true,
        state: {
          success: order
            ? 'Ordem de serviço alterada com sucesso!'
            : 'Ordem de serviço cadastrada com sucesso!',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a ordem.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      <Link
        to="/admin/ordens"
        className="inline-flex items-center gap-2 text-sm text-primary"
      >
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <PageHeader
        title={order ? 'Alterar ordem de serviço' : 'Nova ordem de serviço'}
        description="Organize os serviços e o agendamento do atendimento."
        icon={<ClipboardList size={28} />}
      />

      <form noValidate onSubmit={handleSubmit} className="space-y-6">

        <section className="space-y-5 rounded-xl border
          border-border bg-white p-6 shadow-sm">

          <h2 className="flex items-center gap-2 border-b
            border-border pb-4 font-semibold text-primary">
            <ClipboardList size={20} />
            01. Dados da ordem
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-1.5">
              <label htmlFor="client" className="text-sm font-medium">
                Cliente *
              </label>

              <select
                id="client"
                value={form.clientId}
                required
                aria-invalid={Boolean(errors.clientId)}
                onChange={(e) => update('clientId', e.target.value)}
                className={`${selectStyle} ${errors.clientId ? 'border-danger' : ''}`}
              >
                <option value="">Selecione o cliente</option>

                {clients.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-danger">{errors.clientId}</p>

              {!clients.length && (
                <Link
                  to="/admin/clientes/novo"
                  className="text-xs text-primary hover:underline"
                >
                  Cadastre um cliente primeiro.
                </Link>
              )}
            </div>

            <Input
              label="Endereço do atendimento"
              icon={<MapPin size={18} />}
              value={form.address}
              error={errors.address}
              onChange={(e) => update('address', e.target.value)}
              required
            />

          </div>

          <div className="space-y-1.5">

            <label htmlFor="notes" className="text-sm font-medium">
              Observações
            </label>

            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Informações complementares sobre o atendimento..."
              className={selectStyle}
            />

          </div>

        </section>

        <section className="space-y-5 rounded-xl border
          border-border bg-white p-6 shadow-sm">

          <div className="flex flex-wrap items-center
            justify-between gap-3 border-b border-border pb-4">

            <h2 className="flex items-center gap-2 font-semibold text-primary">
              <ListChecks size={20} />
              02. Itens da ordem
            </h2>

            <Button
              variant="secondary"
              icon={<Plus size={18} />}
              disabled={!services.length}
              onClick={addItem}
            >
              Adicionar item
            </Button>

          </div>

          {!services.length && (
            <Feedback
              message="Cadastre serviços antes de criar uma ordem."
              type="error"
            />
          )}

          {!form.items.length && (
            <p className="py-5 text-center text-sm text-muted">
              Nenhum item adicionado.
            </p>
          )}

          {form.items.map((item, index) => (

            <div
              key={index}
              className="grid items-start gap-3
                rounded-lg bg-background p-4 md:grid-cols-12"
            >

              <div className="space-y-1.5 md:col-span-5">

                <label
                  htmlFor={`service-${index}`}
                  className="text-sm font-medium"
                >
                  Serviço
                </label>

                <select
                  id={`service-${index}`}
                  value={item.serviceId}
                  className={selectStyle}
                  onChange={(e) => {
                    const selected = services.find(
                      (service) => service.id === e.target.value,
                    )

                    if (selected) {
                      changeItem(index, {
                        serviceId: selected.id,
                        unitPrice: selected.referencePrice,
                      })
                    }
                  }}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="md:col-span-2">

                <Input
                  label="Quantidade"
                  type="number"
                  min={1}
                  step={1}
                  value={Number.isNaN(item.quantity) ? '' : item.quantity}
                  error={errors[`quantity-${index}`]}
                  onChange={(e) => changeItem(index, {
                    quantity: e.target.valueAsNumber,
                  })}
                  required
                />

              </div>

              <div className="md:col-span-3">

                <Input
                  label="Valor unitário"
                  type="number"
                  min={0}
                  step="0.01"
                  value={Number.isNaN(item.unitPrice) ? '' : item.unitPrice}
                  error={errors[`price-${index}`]}
                  onChange={(e) => changeItem(index, {
                    unitPrice: e.target.valueAsNumber,
                  })}
                  required
                />

              </div>

              <div className="flex items-center justify-between
                gap-2 md:col-span-2 md:pt-7">

                <span className="text-sm font-medium">
                  {Number.isFinite(item.quantity * item.unitPrice)
                    ? formatCurrency(
                        Math.round(item.unitPrice * 100)
                        * item.quantity / 100,
                      )
                    : '—'}
                </span>

                <button
                  type="button"
                  aria-label={`Remover item ${index + 1}`}
                  title="Remover item"
                  onClick={() => removeItem(index)}
                  className="rounded p-2 text-danger hover:bg-red-100"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))}

          <p className="text-sm text-danger">{errors.items}</p>

          <div className="flex items-center justify-end gap-4
            border-t border-border pt-4">

            <span className="text-sm text-muted">
              Total da ordem
            </span>

            <span className="text-xl font-bold text-primary">
              {Number.isFinite(total)
                ? formatCurrency(total)
                : '—'}
            </span>

          </div>

        </section>

        <section className="space-y-5 rounded-xl border
          border-border bg-white p-6 shadow-sm">

          <h2 className="flex items-center gap-2 border-b
            border-border pb-4 font-semibold text-primary">
            <CalendarClock size={20} />
            03. Reserva de agenda
          </h2>

          <div className="grid gap-4 lg:grid-cols-3">

            <div className="space-y-1.5">

              <label htmlFor="technician" className="text-sm font-medium">
                Técnico *
              </label>

              <select
                id="technician"
                value={form.technicianId}
                required
                aria-invalid={Boolean(errors.technicianId)}
                onChange={(e) => update('technicianId', e.target.value)}
                className={`${selectStyle} ${errors.technicianId ? 'border-danger' : ''}`}
              >
                <option value="">Selecione um técnico</option>

                {technicians.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-danger">
                {errors.technicianId}
              </p>

            </div>

            <Input
              label="Início previsto"
              type="datetime-local"
              value={form.start}
              error={errors.start}
              onChange={(e) => update('start', e.target.value)}
              required
            />

            <Input
              label="Fim previsto"
              type="datetime-local"
              value={form.end}
              error={errors.end}
              onChange={(e) => update('end', e.target.value)}
              required
            />

          </div>

          <div className="flex items-center gap-3 rounded-lg
            bg-accent/60 p-4 text-sm">

            <Info size={20} className="shrink-0 text-primary" />

            A disponibilidade do técnico será validada ao salvar.

          </div>

        </section>

        <Feedback message={message} type="error" />

        <div className="flex flex-wrap justify-end gap-3">

          <Button
            variant="ghost"
            onClick={() => navigate('/admin/ordens')}
          >
            Cancelar
          </Button>

          <Button type="submit" icon={<Save size={18} />}>
            {order ? 'Salvar alterações' : 'Cadastrar ordem'}
          </Button>

        </div>

      </form>
    </div>
  )
}

export function OrderFormPage() {
  const { id } = useParams()

  let order: OrderDetails | undefined

  try {
    order = id ? getOrder(id) : undefined

    if (order && order.status !== 'Agendada') {
      throw new Error(
        'Somente ordens agendadas podem ser alteradas.',
      )
    }
  } catch (error) {
    return (
      <div className="space-y-4">

        <Feedback
          type="error"
          message={
            error instanceof Error
              ? error.message
              : 'Ordem não encontrada.'
          }
        />

        <Link to="/admin/ordens" className="text-primary">
          Voltar à listagem
        </Link>

      </div>
    )
  }

  return <OrderForm key={id ?? 'new'} order={order} />
}
