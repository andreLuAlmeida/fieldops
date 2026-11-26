import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ClipboardList,
  Users,
  CalendarCheck,
  CircleAlert,
} from 'lucide-react'

import { Brand } from '../../components/common/Brand'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (!email.trim() || !password) {
      setMessage('')
      return
    }

    setMessage(
      'Protótipo visual: a autenticação ainda será integrada.'
    )
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">

      <section className="relative hidden flex-col
        justify-between overflow-hidden bg-primary
        p-12 text-white lg:flex">

        <Brand light />

        <div className="relative z-10 max-w-xl">
          <span className="mb-6 inline-flex items-center
            gap-2 rounded-full border border-white/30
            bg-white/10 px-4 py-2 text-sm text-accent">
            <ClipboardList size={16} />
            Gestão inteligente de serviços
          </span>

          <h1 className="text-5xl font-bold leading-tight
            tracking-tight xl:text-6xl">
            Gestão de campo.
            <br />
            <span className="text-accent">
              Sem complicações.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg
            leading-relaxed text-white/80">
            Organize suas equipes, serviços e atendimentos
            em uma única plataforma.
          </p>

          <div className="mt-12 space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-3">
                <Users className="text-accent" />
              </div>
              <span>Gerencie clientes e equipes</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-3">
                <ClipboardList className="text-accent" />
              </div>
              <span>Controle suas ordens de serviço</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-3">
                <CalendarCheck className="text-accent" />
              </div>
              <span>Organize seus atendimentos</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © 2026 FieldOps — Gestão de serviços em campo.
        </div>

        <div className="pointer-events-none absolute
          -bottom-48 -right-32 h-[500px] w-[500px]
          rounded-full bg-primary-hover" />

        <div className="pointer-events-none absolute
          -bottom-72 -right-12 h-[450px] w-[450px]
          rounded-full bg-primary-light" />
      </section>

      <section className="flex min-h-screen items-center
        justify-center bg-background px-6 py-12">

        <div className="w-full max-w-md">

          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <div className="mb-8">
            <span className="text-xs font-semibold uppercase
              tracking-widest text-primary">
              Bem-vindo ao FieldOps
            </span>

            <h2 className="mt-3 text-3xl font-bold
              tracking-tight text-foreground">
              Acesse sua conta
            </h2>

            <p className="mt-2 text-sm text-muted">
              Informe suas credenciais para continuar.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="usuario@empresa.com.br"
              icon={<Mail size={18} />}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setMessage('')
              }}
              error={
                submitted && !email.trim()
                  ? 'Informe seu e-mail.'
                  : undefined
              }
              required
            />

            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              icon={<LockKeyhole size={18} />}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setMessage('')
              }}
              error={
                submitted && !password
                  ? 'Informe sua senha.'
                  : undefined
              }
              action={
                <button
                  type="button"
                  className="text-gray-400 hover:text-primary"
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              }
              required
            />

            {message && (
              <div
                role="status"
                className="flex items-center gap-2
                  rounded-lg bg-primary-soft p-3
                  text-sm text-primary"
              >
                <CircleAlert size={18} />
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full min-h-12"
            >
              Entrar
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="my-7 border-t border-border" />

          <p className="text-center text-sm text-muted">
            Primeiro acesso?{' '}
            <span className="font-semibold text-primary">
              Cadastrar empresa
            </span>
          </p>

          <p className="mt-10 text-center text-xs text-gray-400">
            FieldOps • Protótipo acadêmico
          </p>
        </div>
      </section>
    </main>
  )
}
