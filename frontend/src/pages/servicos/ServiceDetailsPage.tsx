import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Wrench, Clock, Banknote } from 'lucide-react'

import { Feedback } from '../../components/ui/Feedback'
import { getService } from '../../services/catalogService'
import type { Service } from '../../types/service'

import {
  formatCurrency,
  formatDuration,
} from '../../utils/formatters'

export function ServiceDetailsPage() {
  const { id } = useParams()

  let service: Service

  try {
    service = getService(id ?? '')
  } catch {
    return (
      <div className="space-y-4">
        <Feedback message="Serviço não encontrado." type="error" />
        <Link to="/admin/servicos" className="text-primary">
          Voltar à listagem
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/servicos"
        className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <h1 className="text-3xl font-bold">Detalhes do serviço</h1>

      <section className="space-y-7 rounded-xl border border-border
        bg-white p-6 shadow-sm md:p-8">

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary-soft
            p-5 text-primary">
            <Wrench size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{service.name}</h2>
            <p className="mt-1 text-sm text-muted">
              Serviço cadastrado
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold">Descrição</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm
            leading-relaxed text-muted">
            {service.description || 'Nenhuma descrição informada.'}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-xl bg-primary-soft
            p-6 text-primary">
            <Clock size={28} />
            <p className="mt-4 text-sm">Duração estimada</p>
            <p className="mt-2 text-3xl font-bold">
              {formatDuration(service.durationMinutes)}
            </p>
            <p className="mt-2 text-xs">
              {service.durationMinutes} minutos
            </p>
          </article>

          <article className="rounded-xl bg-accent/70
            p-6 text-foreground">
            <Banknote size={28} className="text-[#555519]" />
            <p className="mt-4 text-sm">Valor de referência</p>
            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(service.referencePrice)}
            </p>
            <p className="mt-2 text-xs text-muted">
              Por unidade de serviço
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
