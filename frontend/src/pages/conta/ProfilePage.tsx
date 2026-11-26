import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  Trash2,
  UserRound,
  Mail,
  Building2,
  ShieldCheck,
  LockKeyhole,
  ChevronRight,
  CircleCheck,
  CircleAlert,
} from 'lucide-react'

import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import {
  getCompanies,
  updateAvatar,
} from '../../services/authService'

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!user) return null

  const company = getCompanies().find(
    (item) => item.id === user.companyId,
  )

  const role = user.role === 'ADMIN'
    ? 'Administrador'
    : 'Técnico'

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || !user) return

    setError('')
    setMessage('')
    event.target.value = ''

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Selecione uma imagem JPG, PNG ou WebP.')
      return
    }

    if (file.size > 1024 * 1024) {
      setError('A imagem deve possuir no máximo 1 MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        updateAvatar(user.id, String(reader.result))
        refreshUser()
        setMessage('Foto de perfil atualizada.')
      } catch {
        setError('Não foi possível armazenar a imagem.')
      }
    }

    reader.onerror = () => {
      setError('Não foi possível ler a imagem.')
    }

    reader.readAsDataURL(file)
  }

  function removePhoto() {
    if (!user) return

    try {
      updateAvatar(user.id)
      refreshUser()
      setError('')
      setMessage('Foto de perfil removida.')
    } catch {
      setError('Não foi possível remover a foto.')
    }
  }

  const fields = [
    { label: 'Nome completo', value: user.name, icon: UserRound },
    { label: 'E-mail', value: user.email, icon: Mail },
    { label: 'Empresa', value: company?.name ?? '-', icon: Building2 },
    { label: 'Perfil de acesso', value: role, icon: ShieldCheck },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Minha conta</h1>
        <p className="mt-2 text-sm text-muted">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      <section className="rounded-xl border border-border
        bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-wrap items-center gap-6">

          <Avatar
            name={user.name}
            src={user.avatar}
            size="xl"
          />

          <div className="space-y-3">

            <div>
              <h2 className="text-xl font-semibold">
                {user.name}
              </h2>
              <p className="text-sm text-muted">
                {role} · {company?.name}
              </p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
              className="hidden"
            />

            <div className="flex flex-wrap gap-2">

              <Button
                icon={<Camera size={18} />}
                onClick={() => fileRef.current?.click()}
              >
                Alterar foto
              </Button>

              {user.avatar && (
                <Button
                  variant="ghost"
                  icon={<Trash2 size={18} />}
                  onClick={removePhoto}
                >
                  Remover
                </Button>
              )}

            </div>

            <p className="text-xs text-muted">
              JPG, PNG ou WebP. Máximo de 1 MB.
            </p>

          </div>
        </div>

        {message && (
          <div role="status" className="mt-5 flex items-center
            gap-2 rounded-lg bg-green-50 p-3 text-sm text-success">
            <CircleCheck size={18} />
            {message}
          </div>
        )}

        {error && (
          <div role="alert" className="mt-5 flex items-center
            gap-2 rounded-lg bg-red-50 p-3 text-sm text-danger">
            <CircleAlert size={18} />
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 border-t
          border-border pt-6 sm:grid-cols-2">

          {fields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">

              <div className="rounded-lg bg-primary-soft
                p-3 text-primary">
                <Icon size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted">{label}</p>
                <p className="break-all text-sm font-medium">
                  {value}
                </p>
              </div>

            </div>
          ))}

        </div>
      </section>

      <button
        onClick={() => navigate('/conta/senha')}
        className="flex w-full items-center gap-4 rounded-xl
          border border-border bg-white p-6 text-left shadow-sm
          hover:border-primary"
      >
        <div className="rounded-xl bg-primary-soft
          p-4 text-primary">
          <LockKeyhole size={24} />
        </div>

        <div className="flex-1">
          <h2 className="font-semibold">Segurança da conta</h2>
          <p className="mt-1 text-sm text-muted">
            Altere sua senha de acesso.
          </p>
        </div>

        <ChevronRight className="text-primary" />
      </button>

    </div>
  )
}
