import type {
  Company,
  MockUser,
} from '../types/auth'

export const mockCompanies: Company[] = [
  {
    id: 'company-001',
    name: 'FieldOps Demonstração',
    cnpj: '11.222.333/0001-81',
    phone: '(35) 3333-0000',
  },
]

export const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    companyId: 'company-001',
    name: 'Alex Martins',
    email: 'admin@fieldops.com',
    password: 'Admin123!',
    role: 'ADMIN',
    active: true,
  },
  {
    id: 'user-002',
    companyId: 'company-001',
    name: 'Marcos Silva',
    email: 'tecnico@fieldops.com',
    password: 'Tecnico123!',
    role: 'TECNICO',
    active: true,
  },
  {
    id: 'user-003',
    companyId: 'company-001',
    name: 'Pedro Lima',
    email: 'inativo@fieldops.com',
    password: 'Inativo123!',
    role: 'TECNICO',
    active: false,
  },
]
