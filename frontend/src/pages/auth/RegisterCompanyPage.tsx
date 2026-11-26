import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  UserRound,
  ShieldCheck,
  IdCard,
  Phone,
  Mail,
  LockKeyhole,
  CircleAlert,
  Info,
  Check,
} from 'lucide-react'

import { Brand } from '../../components/common/Brand'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { registerCompany } from '../../services/authService'

const initialForm = {
  companyName: '',
  cnpj: '',
  phone: '',
  adminName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

type Field = keyof typeof initialForm

function validCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '')

  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
    return false
  }

  function calculate(base: string) {
    const weights = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    const sum = [...base].reduce(
      (total, digit, index) =>
        total + Number(digit) * weights[index],
      0,
    )

    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const base = digits.slice(0, 12)
  const first = calculate(base)
  const second = calculate(base + first)

  return digits === base + first + second
}

export function RegisterCompanyPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)

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

    if (!form.companyName.trim()) {
      nextErrors.companyName = 'Informe a razão social.'
    }

    if (!validCnpj(form.cnpj)) {
      nextErrors.cnpj = 'Informe um CNPJ válido.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Informe o telefone.'
    }

    if (!form.adminName.trim()) {
      nextErrors.adminName = 'Informe o nome completo.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Informe pelo menos oito caracteres.'
    }

    if (
      !form.confirmPassword
      || form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword = 'As senhas devem ser iguais.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      registerCompany(form)

      navigate('/login', {
        replace: true,
        state: {
          success: 'Empresa cadastrada com sucesso!',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar a empresa.',
      )
    }
  }

  return (
    <main className="min-h-screen bg-background">

      <header className="bg-primary px-6 py-5 text-white">
        <div className="mx-auto flex max-w-6xl
          items-center justify-between">
          <Brand light />

          <Link
            to="/login"
            className="flex items-center gap-2
              text-sm hover:text-accent"
          >
            <ArrowLeft size={18} />
            Voltar ao login
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10">

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-8 rounded-2xl border
            border-border bg-white p-6 shadow-sm md:p-10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary-soft
              p-4 text-primary">
              <Building2 size={32} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase
                tracking-wider text-primary">
                Primeiro acesso
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Cadastre sua empresa
              </h1>

              <p className="mt-2 text-sm text-muted">
                Crie sua organização e a primeira
                conta administrativa.
              </p>
            </div>
          </div>

          <section className="space-y-5">

            <h2 className="flex items-center gap-2
              border-b border-border pb-3
              font-semibold text-primary">
              <Building2 size={20} />
              Dados da empresa
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Razão social"
                icon={<Building2 size={18} />}
                value={form.companyName}
                onChange={(e) =>
                  update('companyName', e.target.value)}
                error={errors.companyName}
                required
              />

              <Input
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                icon={<IdCard size={18} />}
                value={form.cnpj}
                onChange={(e) =>
                  update('cnpj', e.target.value)}
                error={errors.cnpj}
                required
              />

              <Input
                label="Telefone"
                type="tel"
                icon={<Phone size={18} />}
                value={form.phone}
                onChange={(e) =>
                  update('phone', e.target.value)}
                error={errors.phone}
                required
              />
            </div>
          </section>

          <section className="space-y-5">

            <h2 className="flex items-center gap-2
              border-b border-border pb-3
              font-semibold text-primary">
              <ShieldCheck size={20} />
              Dados do administrador
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Nome completo"
                icon={<UserRound size={18} />}
                value={form.adminName}
                onChange={(e) =>
                  update('adminName', e.target.value)}
                error={errors.adminName}
                required
              />

              <Input
                label="E-mail"
                type="email"
                icon={<Mail size={18} />}
                value={form.email}
                onChange={(e) =>
                  update('email', e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Senha"
                type="password"
                autoComplete="new-password"
                icon={<LockKeyhole size={18} />}
                value={form.password}
                onChange={(e) =>
                  update('password', e.target.value)}
                error={errors.password}
                required
              />

              <Input
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                icon={<LockKeyhole size={18} />}
                value={form.confirmPassword}
                onChange={(e) =>
                  update('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />

            </div>
          </section>

          <div className="flex items-center gap-3
            rounded-lg bg-accent/60 p-4 text-sm">
            <Info size={20} className="shrink-0 text-primary" />
            Esta conta será responsável pela administração
            da empresa.
          </div>

          {message && (
            <div role="alert" className="flex items-center
              gap-2 rounded-lg bg-red-50 p-4
              text-sm text-danger">
              <CircleAlert size={18} />
              {message}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3
            border-t border-border pt-5">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              icon={<Check size={18} />}
            >
              Cadastrar empresa
            </Button>
          </div>

        </form>

      </section>
    </main>
  )
}
