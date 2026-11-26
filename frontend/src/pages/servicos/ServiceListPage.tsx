import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Wrench, Plus, Search, Eye, Clock } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import { getServices } from '../../services/catalogService'
import {
  formatCurrency,
  formatDuration,
} from '../../utils/formatters'

export function ServiceListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [services] = useState(getServices)
  const [search, setSearch] = useState('')

  const filtered = services.filter((item) => {
    const query = search.trim().toLowerCase()

    return item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Serviços"
        description="Organize seu catálogo de serviços."
        icon={<Wrench size={28} />}
        action={
          <Button
            icon={<Plus size={18} />}
            onClick={() => navigate('/admin/servicos/novo')}
          >
            Novo serviço
          </Button>
        }
      />

      <Feedback
        message={location.state?.success ?? ''}
        type="success"
      />

      <section className="overflow-hidden rounded-xl border
        border-border bg-white shadow-sm">

        <div className="border-b border-border p-5">
          <div className="relative">
            <Search size={18} className="absolute left-3
              top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              aria-label="Buscar serviço"
              placeholder="Buscar por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300
                py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase
              text-muted">
              <tr>
                <th className="px-5 py-4">Serviço</th>
                <th className="px-5 py-4">Duração estimada</th>
                <th className="px-5 py-4">Valor de referência</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary-soft
                        p-2.5 text-primary">
                        <Wrench size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="max-w-xs truncate text-xs text-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      {formatDuration(item.durationMinutes)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium">
                    {formatCurrency(item.referencePrice)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      title="Consultar serviço"
                      aria-label={`Consultar ${item.name}`}
                      className="rounded-lg p-2 text-primary
                        hover:bg-primary-soft"
                      onClick={() => navigate(
                        `/admin/servicos/${item.id}`,
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
              <Wrench size={32} />
            </div>
            <p className="mt-4 font-medium">
              Nenhum serviço encontrado
            </p>
            <p className="mt-2 text-sm text-muted">
              Cadastre um serviço ou altere sua pesquisa.
            </p>
          </div>
        )}

        <footer className="border-t border-border
          px-5 py-4 text-xs text-muted">
          {filtered.length} de {services.length} serviços cadastrados
        </footer>
      </section>
    </div>
  )
}
