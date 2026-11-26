import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ClipboardList, Search, Plus, Eye, CalendarClock,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Feedback } from '../../components/ui/Feedback'
import { getOrders, orderTotal } from '../../services/orderService'
import {
  formatCurrency,
  formatDateTime,
} from '../../utils/formatters'

export function OrderListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const admin = user?.role === 'ADMIN'
  const base = admin ? '/admin/ordens' : '/tecnico/ordens'

  const [orders] = useState(getOrders)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [technician, setTechnician] = useState('ALL')

  const technicians = Array.from(
    new Map(orders.map((order) => [
      order.reservation.technicianId,
      order.reservation.technicianName,
    ])),
  )

  const filtered = orders.filter((order) => {
    const query = search.trim().toLowerCase()

    return [
      order.id,
      order.clientName,
      order.address,
      order.reservation.technicianName,
    ].some((value) => value.toLowerCase().includes(query))
      && (status === 'ALL' || order.status === status)
      && (
        technician === 'ALL' ||
        order.reservation.technicianId === technician
      )
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={admin ? 'Ordens de serviço' : 'Meus atendimentos'}
        description={admin
          ? 'Gerencie e acompanhe os atendimentos da empresa.'
          : 'Consulte suas ordens de serviço atribuídas.'}
        icon={<ClipboardList size={28} />}
        action={admin && (
          <Button icon={<Plus size={18} />}
            onClick={() => navigate(`${base}/novo`)}>
            Nova ordem
          </Button>
        )}
      />

      <Feedback
        message={location.state?.success ?? ''}
        type="success"
      />

      <section className="overflow-hidden rounded-xl
        border border-border bg-white shadow-sm">

        <div className="flex flex-wrap gap-3
          border-b border-border p-5">
          <div className="relative min-w-48 flex-1">
            <Search size={18} className="absolute left-3
              top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              aria-label="Buscar ordem"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ordem ou cliente..."
              className="w-full rounded-lg border border-gray-300
                py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select aria-label="Filtrar status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 text-sm">
            <option value="ALL">Todos os status</option>
            <option>Agendada</option>
            <option>Em andamento</option>
            <option>Concluída</option>
          </select>

          {admin && (
            <select aria-label="Filtrar técnico"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="rounded-lg border border-gray-300 p-2 text-sm">
              <option value="ALL">Todos os técnicos</option>
              {technicians.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th className="p-4">Ordem / Cliente</th>
                {admin && <th className="p-4">Técnico</th>}
                <th className="p-4">Agendamento</th>
                <th className="p-4">Status</th>
                {admin && <th className="p-4">Valor</th>}
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-xs font-medium text-primary">
                      OS-{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-1 font-medium">
                      {order.clientName}
                    </p>
                  </td>

                  {admin && (
                    <td className="p-4">
                      {order.reservation.technicianName}
                    </td>
                  )}

                  <td className="whitespace-nowrap p-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock size={16} className="text-primary" />
                      {formatDateTime(order.reservation.start)}
                    </div>
                  </td>

                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>

                  {admin && (
                    <td className="whitespace-nowrap p-4">
                      {formatCurrency(orderTotal(order))}
                    </td>
                  )}

                  <td className="p-4 text-right">
                    <button
                      title="Consultar ordem"
                      aria-label={`Consultar ordem de ${order.clientName}`}
                      onClick={() => navigate(`${base}/${order.id}`)}
                      className="rounded-lg p-2 text-primary
                        hover:bg-primary-soft">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="flex flex-col items-center py-14 text-center">
            <div className="rounded-full bg-primary-soft p-4 text-primary">
              <ClipboardList size={32} />
            </div>
            <p className="mt-4 font-medium">Nenhuma ordem encontrada</p>
            <p className="mt-2 text-sm text-muted">
              {admin
                ? 'Cadastre uma ordem ou altere os filtros.'
                : 'Seus atendimentos aparecerão aqui.'}
            </p>
          </div>
        )}

        <footer className="border-t border-border p-4 text-xs text-muted">
          {filtered.length} de {orders.length} ordens
        </footer>
      </section>
    </div>
  )
}
