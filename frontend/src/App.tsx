import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'



import { AuthProvider } from './contexts/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterCompanyPage } from './pages/auth/RegisterCompanyPage'
import { Dashboard } from './components/common/Dashboard'
import { OrderListPage } from './pages/ordens/OrderListPage'
import { OrderFormPage } from './pages/ordens/OrderFormPage'
import { OrderDetailsPage } from './pages/ordens/OrderDetailsPage'
import { TechnicianListPage } from './pages/tecnicos/TechnicianListPage'
import { TechnicianFormPage } from './pages/tecnicos/TechnicianFormPage'
import { TechnicianDetailsPage } from './pages/tecnicos/TechnicianDetailsPage'
import { ServiceListPage } from './pages/servicos/ServiceListPage'
import { ServiceFormPage } from './pages/servicos/ServiceFormPage'
import { ServiceDetailsPage } from './pages/servicos/ServiceDetailsPage'
import { ProfilePage } from './pages/conta/ProfilePage'
import { ChangePasswordPage } from './pages/conta/ChangePasswordPage'
import { ClientListPage } from './pages/clientes/ClientListPage'
import { ClientFormPage } from './pages/clientes/ClientFormPage'
import { ClientDetailsPage } from './pages/clientes/ClientDetailsPage'

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
                element={<TechnicianListPage />}
              />

              <Route path="tecnicos/novo"
                element={<TechnicianFormPage />}
              />

              <Route path="tecnicos/:id"
                element={<TechnicianDetailsPage />}
              />

              <Route path="servicos"
                element={<ServiceListPage />}
              />

              <Route path="servicos/novo"
                element={<ServiceFormPage />}
              />

              <Route path="servicos/:id"
                element={<ServiceDetailsPage />}
              />

              <Route path="ordens"
                element={<OrderListPage />}
              />

              <Route path="ordens/:id"
                element={<OrderDetailsPage />}
              />

              <Route path="ordens/:id/editar"
                element={<OrderFormPage />}
              />

              <Route path="ordens/novo"
                element={<OrderFormPage />}
              />

            </Route>

          </Route>

          <Route element={<ProtectedRoute role="TECNICO" />}>

            <Route path="/tecnico" element={<AppLayout />}>

              <Route index element={<Dashboard />} />

              <Route path="ordens"
                element={<OrderListPage />}
              />

              <Route path="ordens/:id"
                element={<OrderDetailsPage />}
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
