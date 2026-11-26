import { Link } from 'react-router-dom'

import {
  CalendarClock,
  Timer,
  CircleCheck,
  Users,
  HardHat,
  Wrench,
  ClipboardList,
  ArrowRight,
  Plus,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

export function Dashboard() {
  const { user } = useAuth()

  const isAdmin = user?.role === 'ADMIN'

  const indicators = [
    {
      label: 'Agendadas',
      icon: CalendarClock,
      style: 'bg-accent text-yellow-900',
    },
    {
      label: 'Em andamento',
      icon: Timer,
      style: 'bg-primary-soft text-primary',
    },
    {
      label: 'Concluídas',
      icon: CircleCheck,
      style: 'bg-secondary/40 text-[#45451B]',
    },
  ]

  const modules = [
    {
      label: 'Clientes',
      description: 'Gerencie sua carteira de clientes.',
      icon: Users,
      to: '/admin/clientes',
    },
    {
      label: 'Técnicos',
      description: 'Consulte e cadastre sua equipe.',
      icon: HardHat,
      to: '/admin/tecnicos',
    },
    {
      label: 'Serviços',
      description: 'Organize seu catálogo de serviços.',
      icon: Wrench,
      to: '/admin/servicos',
    },
    {
      label: 'Ordens de serviço',
      description: 'Controle e acompanhe os atendimentos.',
      icon: ClipboardList,
      to: '/admin/ordens',
    },
  ]

  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-center
        justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin
              ? 'Dashboard'
              : `Olá, ${user?.name.split(' ')[0]}!`}
          </h1>

          <p className="mt-2 text-sm text-muted">
            {isAdmin
              ? 'Acompanhe as operações da sua empresa.'
              : 'Confira seus próximos atendimentos.'}
          </p>
        </div>

        <Link
          to={isAdmin
            ? '/admin/ordens/novo'
            : '/tecnico/ordens'}
          className="flex items-center gap-2 rounded-lg
            bg-primary px-4 py-3 text-sm font-medium
            text-white hover:bg-primary-hover"
        >
          {isAdmin
            ? <Plus size={18} />
            : <ClipboardList size={18} />}

          {isAdmin ? 'Nova ordem' : 'Meus atendimentos'}
        </Link>

      </div>

      <section className="grid gap-5 md:grid-cols-3">

        {indicators.map(({ label, icon: Icon, style }) => (
          <article
            key={label}
            className="rounded-xl border border-border
              bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">

              <div className={`rounded-xl p-4 ${style}`}>
                <Icon size={28} />
              </div>

              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-3xl font-bold">0</p>
              </div>

            </div>

            <p className="mt-4 text-xs text-muted">
              Ordens de serviço
            </p>
          </article>
        ))}

      </section>

      <section className="rounded-xl border border-border
        bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <h2 className="flex items-center gap-2 font-semibold">
            <ClipboardList size={20} className="text-primary" />
            {isAdmin
              ? 'Ordens de serviço recentes'
              : 'Próximos atendimentos'}
          </h2>

          <Link
            to={isAdmin ? '/admin/ordens' : '/tecnico/ordens'}
            className="text-sm font-medium text-primary"
          >
            Ver todas
          </Link>

        </div>

        <div className="flex flex-col items-center
          py-12 text-center">

          <div className="rounded-full bg-primary-soft
            p-4 text-primary">
            <ClipboardList size={32} />
          </div>

          <p className="mt-4 font-medium">
            Nenhuma ordem disponível
          </p>

          <p className="mt-1 text-sm text-muted">
            Os registros serão apresentados aqui.
          </p>

        </div>
      </section>

      {isAdmin && (
        <section>

          <h2 className="mb-4 text-lg font-semibold">
            Acesso rápido
          </h2>

          <div className="grid gap-4 sm:grid-cols-2
            xl:grid-cols-4">

            {modules.map(({ label, description, icon: Icon, to }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border
                  border-border bg-white p-5 transition-all
                  hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary-soft
                    p-3 text-primary">
                    <Icon size={24} />
                  </div>
                  <ArrowRight size={18}
                    className="text-primary opacity-0
                      group-hover:opacity-100" />
                </div>

                <h3 className="mt-4 font-semibold">{label}</h3>

                <p className="mt-2 text-xs text-muted">
                  {description}
                </p>
              </Link>
            ))}

          </div>

        </section>
      )}
    </div>
  )
}
