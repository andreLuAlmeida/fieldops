import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  HardHat, Plus, Search, Eye,
  CircleCheck, CircleX,
} from 'lucide-react'

import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import { getTechnicians } from '../../services/technicianService'
import { getUsers } from '../../services/authService'

export function TechnicianListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [technicians] = useState(getTechnicians)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')

  const filtered = technicians.filter((item) => {
    const query = search.trim().toLowerCase()

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)

    const matchesStatus =
      status === 'ALL' ||
      (status === 'ACTIVE' && item.active) ||
      (status === 'INACTIVE' && !item.active)

    return matchesSearch && matchesStatus
  })

  const users = getUsers()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Técnicos"
        description="Gerencie sua equipe de atendimento."
        icon={<HardHat size={28} />}
        action={
          <Button
            icon={<Plus size={18} />}
            onClick={() => navigate('/admin/tecnicos/novo')}
          >
            Novo técnico
          </Button>
        }
      />

      <Feedback
        message={location.state?.success ?? ''}
        type="success"
      />

      <section className="overflow-hidden rounded-xl border
        border-border bg-white shadow-sm">

        <div className="flex flex-wrap gap-3 border-b
          border-border p-5">

          <div className="relative min-w-48 flex-1">
            <Search size={18} className="absolute left-3
              top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              aria-label="Buscar técnico"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full rounded-lg border border-gray-300
                py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select
            aria-label="Filtrar situação"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300
              bg-white px-3 py-2.5 text-sm"
          >
            <option value="ALL">Todas as situações</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-xs
              uppercase text-muted">
              <tr>
                <th className="px-5 py-4">Técnico</th>
                <th className="px-5 py-4">Telefone</th>
                <th className="px-5 py-4">Situação</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.name}
                        src={users.find(
                          (user) => user.id === item.userId,
                        )?.avatar}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted">{item.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    {item.phone}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center
                      gap-1.5 rounded-md px-2.5 py-1 text-xs ${
                        item.active
                          ? 'bg-green-50 text-success'
                          : 'bg-gray-100 text-muted'
                      }`}>
                      {item.active
                        ? <CircleCheck size={14} />
                        : <CircleX size={14} />}
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      title="Consultar técnico"
                      aria-label={`Consultar ${item.name}`}
                      className="rounded-lg p-2 text-primary
                        hover:bg-primary-soft"
                      onClick={() => navigate(
                        `/admin/tecnicos/${item.id}`,
                      )}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-14 text-center">
            <div className="rounded-full bg-primary-soft
              p-4 text-primary">
              <HardHat size={32} />
            </div>
            <p className="mt-4 font-medium">
              Nenhum técnico encontrado
            </p>
            <p className="mt-2 text-sm text-muted">
              Cadastre um técnico ou altere os filtros.
            </p>
          </div>
        )}

        <footer className="border-t border-border
          px-5 py-4 text-xs text-muted">
          {filtered.length} de {technicians.length} técnicos cadastrados
        </footer>
      </section>
    </div>
  )
}
