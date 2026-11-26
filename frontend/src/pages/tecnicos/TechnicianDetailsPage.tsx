import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, ShieldCheck,
  Building2, CircleCheck, CircleX,
} from 'lucide-react'

import { Avatar } from '../../components/ui/Avatar'
import { Feedback } from '../../components/ui/Feedback'

import { getTechnician } from '../../services/technicianService'
import { getCompanies, getUsers } from '../../services/authService'
import type { Technician } from '../../types/technician'

export function TechnicianDetailsPage() {
  const { id } = useParams()

  let technician: Technician

  try {
    technician = getTechnician(id ?? '')
  } catch {
    return (
      <div className="space-y-4">
        <Feedback message="Técnico não encontrado." type="error" />
        <Link to="/admin/tecnicos" className="text-primary">
          Voltar à listagem
        </Link>
      </div>
    )
  }

  const company = getCompanies().find(
    (item) => item.id === technician.companyId,
  )

  const account = getUsers().find(
    (item) => item.id === technician.userId,
  )

  const fields = [
    { label: 'E-mail', value: technician.email, icon: Mail },
    { label: 'Telefone', value: technician.phone, icon: Phone },
    { label: 'Perfil', value: 'Técnico', icon: ShieldCheck },
    { label: 'Empresa', value: company?.name ?? '-', icon: Building2 },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/tecnicos"
        className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <h1 className="text-3xl font-bold">Detalhes do técnico</h1>

      <section className="rounded-xl border border-border
        bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            name={technician.name}
            src={account?.avatar}
            size="xl"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{technician.name}</h2>
            <p className="text-sm text-muted">Técnico de campo</p>
          </div>

          <span className={`inline-flex items-center gap-2
            rounded-lg px-3 py-2 text-sm ${
              technician.active
                ? 'bg-green-50 text-success'
                : 'bg-gray-100 text-muted'
            }`}>
            {technician.active
              ? <CircleCheck size={18} />
              : <CircleX size={18} />}
            {technician.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="mt-8 grid gap-6 border-t
          border-border pt-7 sm:grid-cols-2">
          {fields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-soft
                p-3 text-primary">
                <Icon size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted">{label}</p>
                <p className="break-all text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
