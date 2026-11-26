import type { Client } from '../types/client'

export const mockClients: Client[] = [
  {
    id: 'client-001',
    companyId: 'company-001',
    type: 'PJ',
    name: 'Comercial Alfa',
    document: '12.345.678/0001-95',
    email: 'contato@alfa.example',
    phone: '(35) 3333-1001',
  },
  {
    id: 'client-002',
    companyId: 'company-001',
    type: 'PF',
    name: 'Mariana Costa',
    document: '529.982.247-25',
    email: 'mariana@example.com',
    phone: '(35) 99999-1002',
  },
  {
    id: 'client-003',
    companyId: 'company-001',
    type: 'PJ',
    name: 'Mercado Central',
    document: '11.444.777/0001-61',
    email: 'contato@mercado.example',
    phone: '(35) 3333-1003',
  },
]
