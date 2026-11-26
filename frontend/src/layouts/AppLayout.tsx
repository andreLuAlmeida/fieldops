import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  Users,
  HardHat,
  Wrench,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LockKeyhole,
} from 'lucide-react'

import { Brand } from '../components/common/Brand'
import { Avatar } from '../components/ui/Avatar'
import { useAuth } from '../hooks/useAuth'
import { getCompanies } from '../services/authService'

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Clientes', to: '/admin/clientes', icon: Users },
  { label: 'Técnicos', to: '/admin/tecnicos', icon: HardHat },
  { label: 'Serviços', to: '/admin/servicos', icon: Wrench },
  {
    label: 'Ordens de serviço',
    to: '/admin/ordens',
    icon: ClipboardList,
  },
]

const technicianLinks = [
  {
    label: 'Dashboard',
    to: '/tecnico',
    icon: LayoutDashboard,
  },
  {
    label: 'Meus atendimentos',
    to: '/tecnico/ordens',
    icon: ClipboardList,
  },
]

export function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  if (!user) return null

  const isAdmin = user.role === 'ADMIN'

  const links = isAdmin ? adminLinks : technicianLinks

  const company = getCompanies().find(
    (item) => item.id === user.companyId,
  )

  const roleName = isAdmin
    ? 'Administrador'
    : 'Técnico'

  function handleLogout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">

      {mobileOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40
        flex w-64 flex-col bg-sidebar text-white
        transition-transform lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center
          justify-between px-5 py-7">

          <Brand light />

          <button
            aria-label="Fechar menu"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>

        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">

          <p className="mb-3 px-3 pt-4 text-xs
            font-semibold uppercase tracking-widest
            text-gray-500">
            Gerenciamento
          </p>

          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/tecnico'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg
                px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary font-medium text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={isActive ? 'text-accent' : ''}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="my-6 border-t border-white/10" />

          <p className="mb-3 px-3 text-xs
            uppercase tracking-widest text-gray-500">
            Preferências
          </p>

          <NavLink
            to="/conta"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg
              px-3 py-3 text-sm ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`
            }
          >
            <Settings size={20} />
            Minha conta
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3
              rounded-lg px-3 py-3 text-sm text-gray-300
              hover:bg-white/10"
          >
            <LogOut size={20} />
            Sair
          </button>

        </nav>

        <div className="m-3 flex items-center gap-3
          rounded-xl bg-white/5 p-3">

          <Avatar name={user.name} src={user.avatar} />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>
            <p className="text-xs text-gray-400">
              {roleName}
            </p>
          </div>

        </div>

      </aside>

      <div className="lg:pl-64">

        <header className="sticky top-0 z-20 flex
          h-18 items-center justify-between border-b
          border-border bg-white px-5 md:px-8">

          <div className="flex items-center gap-3">
            <button
              aria-label="Abrir menu"
              className="text-primary lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div>
              <p className="text-sm font-semibold">
                {company?.name ?? 'FieldOps'}
              </p>
              <p className="text-xs text-muted">
                {isAdmin
                  ? 'Área administrativa'
                  : 'Operação de campo'}
              </p>
            </div>
          </div>

          <div className="relative">

            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2
                rounded-lg p-1.5 hover:bg-background"
              aria-label="Menu da conta"
              aria-expanded={accountOpen}
            >
              <Avatar
                name={user.name}
                src={user.avatar}
              />

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">
                  {user.name}
                </p>
                <p className="text-xs text-muted">
                  {roleName}
                </p>
              </div>

              <ChevronDown size={16} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-full
                mt-2 w-52 rounded-xl border border-border
                bg-white p-2 shadow-lg">

                <NavLink
                  to="/conta"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3
                    rounded-lg p-3 text-sm hover:bg-background"
                >
                  <Settings size={18} />
                  Meu perfil
                </NavLink>

                <NavLink
                  to="/conta/senha"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3
                    rounded-lg p-3 text-sm hover:bg-background"
                >
                  <LockKeyhole size={18} />
                  Alterar senha
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3
                    rounded-lg p-3 text-sm text-danger
                    hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Encerrar sessão
                </button>

              </div>
            )}

          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
