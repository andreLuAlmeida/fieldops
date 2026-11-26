export type UserRole = 'ADMIN' | 'TECNICO'

export interface Company {
  id: string
  name: string
  cnpj: string
  phone: string
}

export interface User {
  id: string
  companyId: string
  name: string
  email: string
  role: UserRole
  active: boolean
  avatar?: string
}

export interface MockUser extends User {
  password: string
}

export interface CompanyRegistration {
  companyName: string
  cnpj: string
  phone: string
  adminName: string
  email: string
  password: string
}
