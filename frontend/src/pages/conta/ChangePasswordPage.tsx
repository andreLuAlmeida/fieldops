import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  Info,
  CircleAlert,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { changePassword } from '../../services/authService'

const initialForm = {
  currentPassword: '',
  newPassword: '',
  confirmation: '',
}

type Field = keyof typeof initialForm

export function ChangePasswordPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)

  const [errors, setErrors] =
    useState<Partial<Record<Field, string>>>({})

  const [visible, setVisible] =
    useState<Partial<Record<Field, boolean>>>({})

  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) return

    const nextErrors: Partial<Record<Field, string>> = {}

    if (!form.currentPassword) {
      nextErrors.currentPassword = 'Informe a senha atual.'
    }

    if (form.newPassword.length < 8) {
      nextErrors.newPassword = 'Informe pelo menos oito caracteres.'
    } else if (form.newPassword === form.currentPassword) {
      nextErrors.newPassword = 'A nova senha deve ser diferente da atual.'
    }

    if (
      !form.confirmation ||
      form.confirmation !== form.newPassword
    ) {
      nextErrors.confirmation = 'As senhas devem ser iguais.'
    }

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

    try {
      changePassword(
        user.id,
        form.currentPassword,
        form.newPassword,
      )

      signOut()

      navigate('/login', {
        replace: true,
        state: {
          success: 'Senha alterada com sucesso! Entre novamente.',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível alterar a senha.',
      )
    }
  }

  const fields: { key: Field; label: string }[] = [
    { key: 'currentPassword', label: 'Senha atual' },
    { key: 'newPassword', label: 'Nova senha' },
    { key: 'confirmation', label: 'Confirmar nova senha' },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      <Link
        to="/conta"
        className="inline-flex items-center gap-2
          text-sm font-medium text-primary"
      >
        <ArrowLeft size={18} />
        Voltar à minha conta
      </Link>

      <h1 className="text-3xl font-bold">Alterar senha</h1>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border
          border-border bg-white p-6 shadow-sm md:p-8"
      >

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-primary-soft
            p-4 text-primary">
            <LockKeyhole size={28} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Segurança da conta
            </h2>
            <p className="text-sm text-muted">
              Mantenha sua conta protegida.
            </p>
          </div>

        </div>

        {fields.map(({ key, label }) => (
          <Input
            key={key}
            label={label}
            type={visible[key] ? 'text' : 'password'}
            autoComplete={
              key === 'currentPassword'
                ? 'current-password'
                : 'new-password'
            }
            icon={<LockKeyhole size={18} />}
            value={form[key]}
            error={errors[key]}
            required
            onChange={(event) => {
              setForm((previous) => ({
                ...previous,
                [key]: event.target.value,
              }))

              setErrors((previous) => ({
                ...previous,
                [key]: undefined,
              }))

              setMessage('')
            }}
            action={
              <button
                type="button"
                aria-label={
                  visible[key] ? 'Ocultar senha' : 'Mostrar senha'
                }
                onClick={() => setVisible((previous) => ({
                  ...previous,
                  [key]: !previous[key],
                }))}
                className="text-gray-400 hover:text-primary"
              >
                {visible[key]
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            }
          />
        ))}

        <div className="flex items-center gap-3
          rounded-lg bg-accent/60 p-4 text-sm">
          <Info className="shrink-0 text-primary" size={20} />
          A nova senha deve possuir pelo menos oito caracteres.
        </div>

        {message && (
          <div role="alert" className="flex items-center
            gap-2 rounded-lg bg-red-50 p-3 text-sm text-danger">
            <CircleAlert size={18} />
            {message}
          </div>
        )}

        <div className="flex justify-end gap-3
          border-t border-border pt-5">

          <Button
            variant="ghost"
            onClick={() => navigate('/conta')}
          >
            Cancelar
          </Button>

          <Button type="submit" icon={<Save size={18} />}>
            Salvar senha
          </Button>

        </div>
      </form>
    </div>
  )
}
