import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  UserRound,
  Building2,
  IdCard,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Feedback } from '../../components/ui/Feedback'

import {
  getClient,
  deleteClient,
} from '../../services/clientService'

import type { Client } from '../../types/client'

export function ClientDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  let client: Client

  try {
    client = getClient(id ?? '')
  } catch {
    return (
      <div className="space-y-4">
        <Feedback message="Cliente não encontrado." type="error" />
        <Link to="/admin/clientes" className="text-primary">
          Voltar à listagem
        </Link>
      </div>
    )
  }

  const Icon = client.type === 'PF'
    ? UserRound
    : Building2

  const fields = [
    {
      label: client.type === 'PF' ? 'CPF' : 'CNPJ',
      value: client.document,
      icon: IdCard,
    },
    { label: 'E-mail', value: client.email, icon: Mail },
    { label: 'Telefone', value: client.phone, icon: Phone },
    {
      label: 'Tipo de pessoa',
      value: client.type === 'PF' ? 'Pessoa física' : 'Pessoa jurídica',
      icon: Icon,
    },
  ]

  function handleDelete() {
    try {
      deleteClient(client.id)

      navigate('/admin/clientes', {
        replace: true,
        state: {
          success: 'Cliente excluído com sucesso!',
        },
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o cliente.',
      )

      setConfirming(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <Link
        to="/admin/clientes"
        className="inline-flex items-center gap-2
          text-sm font-medium text-primary"
      >
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <h1 className="text-3xl font-bold">Detalhes do cliente</h1>

      <Feedback message={error} type="error" />

      <section className="rounded-xl border border-border
        bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-wrap items-center gap-4">

          <div className="rounded-2xl bg-primary-soft
            p-5 text-primary">
            <Icon size={36} />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {client.type === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'}
            </p>
          </div>

        </div>

        <div className="mt-8 grid gap-7 border-t
          border-border pt-7 sm:grid-cols-2">

          {fields.map(({ label, value, icon: FieldIcon }) => (
            <div key={label} className="flex items-center gap-3">

              <div className="rounded-lg bg-primary-soft
                p-3 text-primary">
                <FieldIcon size={20} />
              </div>

              <div>
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 break-all text-sm font-medium">
                  {value}
                </p>
              </div>

            </div>
          ))}

        </div>

        <div className="mt-8 flex flex-wrap justify-end
          gap-3 border-t border-border pt-5">

          <Button
            variant="danger"
            icon={<Trash2 size={18} />}
            onClick={() => setConfirming(true)}
          >
            Excluir cliente
          </Button>

          <Button
            icon={<Pencil size={18} />}
            onClick={() => navigate(
              `/admin/clientes/${client.id}/editar`,
            )}
          >
            Editar cliente
          </Button>

        </div>

      </section>

      {confirming && (
        <ConfirmDialog
          title="Excluir cliente?"
          description={`Deseja excluir ${client.name}? Esta operação não poderá ser desfeita.`}
          onCancel={() => setConfirming(false)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  )
}
