export type ClientType = 'PF' | 'PJ'

export interface Client {
  id: string
  companyId: string
  type: ClientType
  name: string
  document: string
  email: string
  phone: string
}

export type ClientInput = Omit<Client, 'id' | 'companyId'>
