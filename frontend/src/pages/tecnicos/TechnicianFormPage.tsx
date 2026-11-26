import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, HardHat, UserRound, Mail, Phone,
  LockKeyhole, ShieldCheck, Info, Save, Eye, EyeOff,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import type { TechnicianInput } from '../../types/technician'
import { createTechnician } from '../../services/technicianService'
import { validEmail } from '../../utils/validators'

type Field = keyof TechnicianInput

export function TechnicianFormPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<TechnicianInput>({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [errors, setErrors] =
    useState<Partial<Record<Field, string>>>({})

  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  function update(field: Field, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Partial<Record<Field, string>> = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Informe o nome completo.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Informe o telefone.'
    }

    if (!validEmail(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Informe pelo menos oito caracteres.'
    }

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

    try {
      createTechnician(form)

      navigate('/admin/tecnicos', {
        replace: true,
        state: {
          success: 'Técnico cadastrado com sucesso!',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar o técnico.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/tecnicos"
        className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <PageHeader
        title="Cadastrar técnico"
        description="Adicione um profissional à sua equipe."
        icon={<HardHat size={28} />}
      />

      <form noValidate onSubmit={handleSubmit}
        className="space-y-7 rounded-xl border border-border
          bg-white p-6 shadow-sm md:p-8">

        <h2 className="flex items-center gap-2 border-b
          border-border pb-4 font-semibold text-primary">
          <UserRound size={20} />
          Dados pessoais
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nome completo"
            icon={<UserRound size={18} />}
            value={form.name}
            error={errors.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            icon={<Phone size={18} />}
            value={form.phone}
            error={errors.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
          />
        </div>

        <h2 className="flex items-center gap-2 border-b
          border-border pb-4 font-semibold text-primary">
          <ShieldCheck size={20} />
          Credenciais de acesso
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="E-mail de acesso"
            type="email"
            icon={<Mail size={18} />}
            value={form.email}
            error={errors.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />

          <Input
            label="Senha inicial"
            type={visible ? 'text' : 'password'}
            autoComplete="new-password"
            icon={<LockKeyhole size={18} />}
            value={form.password}
            error={errors.password}
            onChange={(e) => update('password', e.target.value)}
            action={
              <button
                type="button"
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setVisible(!visible)}
                className="text-gray-400 hover:text-primary"
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />
        </div>

        <div className="flex items-center gap-3 rounded-lg
          bg-accent/60 p-4 text-sm">
          <Info size={20} className="shrink-0 text-primary" />
          O técnico terá acesso apenas aos atendimentos atribuídos a ele.
        </div>

        <Feedback message={message} type="error" />

        <div className="flex justify-end gap-3 border-t
          border-border pt-5">
          <Button variant="ghost"
            onClick={() => navigate('/admin/tecnicos')}>
            Cancelar
          </Button>
          <Button type="submit" icon={<Save size={18} />}>
            Cadastrar técnico
          </Button>
        </div>
      </form>
    </div>
  )
}
