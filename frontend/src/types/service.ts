export interface Service {
  id: string
  companyId: string
  name: string
  description: string
  durationMinutes: number
  referencePrice: number
}

export type ServiceInput = Omit<Service, 'id' | 'companyId'>
