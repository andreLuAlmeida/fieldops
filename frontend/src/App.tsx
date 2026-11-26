import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { Construction } from 'lucide-react'

import { AuthProvider } from './contexts/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterCompanyPage } from './pages/auth/RegisterCompanyPage'
import { Dashboard } from './components/common/Dashboard'
import { ProfilePage } from './pages/conta/ProfilePage'
import { ChangePasswordPage } from './pages/conta/ChangePasswordPage'
import { ClientListPage } from './pages/clientes/ClientListPage'
import { ClientFormPage } from './pages/clientes/ClientFormPage'
import { ClientDetailsPage } from './pages/clientes/ClientDetailsPage'

function ModulePlaceholder({ title }: { title: string }) {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex flex-col items-center
        rounded-xl border border-border bg-white
        p-16 text-center">

        <div className="rounded-xl bg-primary-soft
          p-4 text-primary">
          <Construction size={32} />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          Módulo em desenvolvimento
        </h2>

        <p className="mt-2 text-sm text-muted">
          Esta interface será implementada na próxima etapa.
        </p>

      </div>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/cadastro-empresa"
            element={<RegisterCompanyPage />}
          />

          <Route element={<ProtectedRoute role="ADMIN" />}>

            <Route path="/admin" element={<AppLayout />}>

              <Route index element={<Dashboard />} />

              <Route path="clientes"
                element={<ClientListPage />}
              />

              <Route path="clientes/novo"
                element={<ClientFormPage />}
              />

              <Route path="clientes/:id"
                element={<ClientDetailsPage />}
              />

              <Route path="clientes/:id/editar"
                element={<ClientFormPage />}
              />

              <Route path="tecnicos"
                element={<ModulePlaceholder title="Técnicos" />}
              />

              <Route path="servicos"
                element={<ModulePlaceholder title="Serviços" />}
              />

              <Route path="ordens"
                element={<ModulePlaceholder title="Ordens de serviço" />}
              />

              <Route path="ordens/novo"
                element={<ModulePlaceholder title="Nova ordem de serviço" />}
              />

            </Route>

          </Route>

          <Route element={<ProtectedRoute role="TECNICO" />}>

            <Route path="/tecnico" element={<AppLayout />}>

              <Route index element={<Dashboard />} />

              <Route path="ordens"
                element={<ModulePlaceholder title="Meus atendimentos" />}
              />

            </Route>

          </Route>

          <Route element={<ProtectedRoute />}>

            <Route element={<AppLayout />}>

              <Route path="/conta"
                element={<ProfilePage />}
              />

              <Route path="/conta/senha"
                element={<ChangePasswordPage />}
              />

            </Route>

          </Route>

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  )
}
