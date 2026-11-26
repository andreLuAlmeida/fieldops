import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  Users,
  UserRound,
  Building2,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ListFilter,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Feedback } from '../../components/ui/Feedback'

import {
  getClients,
  deleteClient,
} from '../../services/clientService'

import type { Client } from '../../types/client'

export function ClientListPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [clients, setClients] = useState(getClients)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('ALL')

  const [selected, setSelected] = useState<Client | null>(null)

  const [success, setSuccess] = useState<string>(
    location.state?.success ?? '',
  )

  const [error, setError] = useState('')

  const filtered = clients.filter((client) => {
    const query = search.trim().toLowerCase()

    const matchesSearch =
      client.name.toLowerCase().includes(query) ||
      client.document.includes(query) ||
      client.email.toLowerCase().includes(query)

    const matchesType = type === 'ALL' || client.type === type

    return matchesSearch && matchesType
  })

  function handleDelete() {
    if (!selected) return

    setError('')
    setSuccess('')

    try {
      deleteClient(selected.id)
      setClients(getClients())
      setSuccess('Cliente excluído com sucesso!')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o cliente.',
      )
    } finally {
      setSelected(null)
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Clientes"
        description="Gerencie sua carteira de clientes."
        icon={<Users size={28} />}
        action={
          <Button
            icon={<Plus size={18} />}
            onClick={() => navigate('/admin/clientes/novo')}
          >
            Novo cliente
          </Button>
        }
      />

      <Feedback message={success} type="success" />
      <Feedback message={error} type="error" />

      <section className="overflow-hidden rounded-xl
        border border-border bg-white shadow-sm">

        <div className="flex flex-wrap gap-3
          border-b border-border p-5">

          <div className="relative min-w-48 flex-1">

            <Search size={18} className="absolute left-3
              top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              aria-label="Buscar cliente"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, documento ou e-mail..."
              className="w-full rounded-lg border border-gray-300
                py-2.5 pl-10 pr-3 text-sm focus:border-primary"
            />

          </div>

          <div className="flex items-center gap-2 rounded-lg
            border border-gray-300 px-3 text-sm">

            <ListFilter size={18} className="text-primary" />

            <select
              aria-label="Filtrar por tipo de pessoa"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="bg-white py-2.5"
            >
              <option value="ALL">Todos os tipos</option>
              <option value="PF">Pessoa física</option>
              <option value="PJ">Pessoa jurídica</option>
            </select>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-background text-xs
              font-medium uppercase text-muted">

              <tr>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">CPF/CNPJ</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Telefone</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>

            </thead>

            <tbody className="divide-y divide-border">

              {filtered.map((client) => {
                const Icon = client.type === 'PF'
                  ? UserRound
                  : Building2

                return (
                  <tr key={client.id} className="hover:bg-gray-50">

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-primary-soft
                          p-2.5 text-primary">
                          <Icon size={20} />
                        </div>

                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-muted">
                            {client.email}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {client.document}
                    </td>

                    <td className="px-5 py-4">

                      <span className="whitespace-nowrap
                        rounded-md bg-primary-soft px-2 py-1
                        text-xs text-primary">
                        {client.type === 'PF'
                          ? 'Pessoa física'
                          : 'Pessoa jurídica'}
                      </span>

                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {client.phone}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          title="Consultar cliente"
                          aria-label={`Consultar ${client.name}`}
                          className="rounded-lg p-2 text-primary
                            hover:bg-primary-soft"
                          onClick={() => navigate(
                            `/admin/clientes/${client.id}`,
                          )}
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          title="Alterar cliente"
                          aria-label={`Alterar ${client.name}`}
                          className="rounded-lg p-2 text-primary
                            hover:bg-primary-soft"
                          onClick={() => navigate(
                            `/admin/clientes/${client.id}/editar`,
                          )}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          title="Excluir cliente"
                          aria-label={`Excluir ${client.name}`}
                          className="rounded-lg p-2 text-danger
                            hover:bg-red-50"
                          onClick={() => setSelected(client)}
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center
            px-6 py-14 text-center">

            <div className="rounded-full bg-primary-soft
              p-4 text-primary">
              <Users size={32} />
            </div>

            <p className="mt-4 font-medium">
              Nenhum cliente encontrado
            </p>

            <p className="mt-2 text-sm text-muted">
              Cadastre um cliente ou altere os filtros.
            </p>

          </div>
        )}

        <footer className="border-t border-border
          px-5 py-4 text-xs text-muted">
          {filtered.length} de {clients.length} clientes cadastrados
        </footer>

      </section>

      {selected && (
        <ConfirmDialog
          title="Excluir cliente?"
          description={`Deseja excluir ${selected.name}? Esta operação não poderá ser desfeita.`}
          onCancel={() => setSelected(null)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  )
}
