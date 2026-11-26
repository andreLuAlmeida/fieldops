export interface Technician {
  id: string
  userId: string
  companyId: string
  name: string
  email: string
  phone: string
  active: boolean
}

export interface TechnicianInput {
  name: string
  email: string
  phone: string
  password: string
}
