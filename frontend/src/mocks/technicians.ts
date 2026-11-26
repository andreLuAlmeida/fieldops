import type { Technician } from '../types/technician'

export const mockTechnicians: Technician[] = [
  {
    id: 'technician-001',
    userId: 'user-002',
    companyId: 'company-001',
    name: 'Marcos Silva',
    email: 'tecnico@fieldops.com',
    phone: '(35) 99999-2001',
    active: true,
  },
  {
    id: 'technician-002',
    userId: 'user-003',
    companyId: 'company-001',
    name: 'Pedro Lima',
    email: 'inativo@fieldops.com',
    phone: '(35) 99999-2002',
    active: false,
  },
]
