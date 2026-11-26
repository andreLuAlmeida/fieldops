import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  UserRound,
  Building2,
  IdCard,
  Mail,
  Phone,
  Save,
  CircleCheck,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import type { Client, ClientInput } from '../../types/client'

import {
  getClient,
  createClient,
  updateClient,
} from '../../services/clientService'

import {
  validCpf,
  validCnpj,
  validEmail,
} from '../../utils/validators'

const initialForm: ClientInput = {
  type: 'PF',
  name: '',
  document: '',
  email: '',
  phone: '',
}

type Field = keyof ClientInput

function ClientForm({ client }: { client?: Client }) {
  const navigate = useNavigate()

  const editing = Boolean(client)

  const [form, setForm] = useState<ClientInput>(() =>
    client ? {
      type: client.type,
      name: client.name,
      document: client.document,
      email: client.email,
      phone: client.phone,
    } : initialForm,
  )

  const [errors, setErrors] =
    useState<Partial<Record<Field, string>>>({})

  const [message, setMessage] = useState('')

  function update(field: Field, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }))

    setMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Partial<Record<Field, string>> = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Informe o nome do cliente.'
    }

    if (form.type === 'PF' && !validCpf(form.document)) {
      nextErrors.document = 'Informe um CPF válido.'
    }

    if (form.type === 'PJ' && !validCnpj(form.document)) {
      nextErrors.document = 'Informe um CNPJ válido.'
    }

    if (!validEmail(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Informe o telefone.'
    }

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

    try {
      if (client) {
        updateClient(client.id, form)
      } else {
        createClient(form)
      }

      navigate('/admin/clientes', {
        replace: true,
        state: {
          success: editing
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente cadastrado com sucesso!',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o cliente.',
      )
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

      <PageHeader
        title={editing ? 'Alterar cliente' : 'Cadastrar cliente'}
        description={
          editing
            ? 'Atualize as informações cadastrais.'
            : 'Adicione um novo cliente à sua empresa.'
        }
        icon={<UserRound size={28} />}
      />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-7 rounded-xl border
          border-border bg-white p-6 shadow-sm md:p-8"
      >

        <h2 className="border-b border-border pb-4
          font-semibold text-primary">
          Dados cadastrais
        </h2>

        <div>
          <p className="mb-3 text-sm font-medium">
            Tipo de pessoa
          </p>

          <div className="grid gap-3 sm:grid-cols-2">

            {([
              { value: 'PF', label: 'Pessoa física', icon: UserRound },
              { value: 'PJ', label: 'Pessoa jurídica', icon: Building2 },
            ] as const).map(({ value, label, icon: Icon }) => (

              <button
                key={value}
                type="button"
                disabled={editing}
                aria-pressed={form.type === value}
                onClick={() => {
                  setForm((previous) => ({
                    ...previous,
                    type: value,
                    document: '',
                  }))

                  setErrors((previous) => ({
                    ...previous,
                    document: undefined,
                  }))

                  setMessage('')
                }}
                className={`flex items-center gap-3 rounded-xl
                  border p-4 text-left text-sm ${
                    form.type === value
                      ? 'border-primary bg-primary-soft text-primary'
                      : 'border-border bg-white hover:border-primary'
                  }`}
              >
                <Icon size={22} />

                <span className="flex-1 font-medium">
                  {label}
                </span>

                {form.type === value && (
                  <CircleCheck size={18} />
                )}

              </button>
            ))}

          </div>

          {editing && (
            <p className="mt-2 text-xs text-muted">
              O tipo de pessoa não pode ser alterado.
            </p>
          )}

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label={form.type === 'PF' ? 'Nome completo' : 'Razão social'}
            icon={
              form.type === 'PF'
                ? <UserRound size={18} />
                : <Building2 size={18} />
            }
            value={form.name}
            error={errors.name}
            onChange={(event) => update('name', event.target.value)}
            required
          />

          <Input
            label={form.type === 'PF' ? 'CPF' : 'CNPJ'}
            placeholder={
              form.type === 'PF'
                ? '000.000.000-00'
                : '00.000.000/0000-00'
            }
            icon={<IdCard size={18} />}
            value={form.document}
            error={errors.document}
            onChange={(event) => update('document', event.target.value)}
            required
          />

          <Input
            label="E-mail"
            type="email"
            icon={<Mail size={18} />}
            value={form.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            icon={<Phone size={18} />}
            value={form.phone}
            error={errors.phone}
            onChange={(event) => update('phone', event.target.value)}
            required
          />

        </div>

        <Feedback message={message} type="error" />

        <div className="flex justify-end gap-3
          border-t border-border pt-5">

          <Button
            variant="ghost"
            onClick={() => navigate('/admin/clientes')}
          >
            Cancelar
          </Button>

          <Button type="submit" icon={<Save size={18} />}>
            {editing ? 'Salvar alterações' : 'Cadastrar cliente'}
          </Button>

        </div>
      </form>
    </div>
  )
}

export function ClientFormPage() {
  const { id } = useParams()

  let client: Client | undefined

  try {
    client = id ? getClient(id) : undefined
  } catch {
    return (
      <div className="space-y-4">
        <Feedback
          message="Cliente não encontrado."
          type="error"
        />

        <Link to="/admin/clientes" className="text-primary">
          Voltar à listagem
        </Link>
      </div>
    )
  }

  return <ClientForm key={id ?? 'new'} client={client} />
}
