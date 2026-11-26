import type { Service } from '../types/service'

export const mockServices: Service[] = [
  {
    id: 'service-001',
    companyId: 'company-001',
    name: 'Manutenção preventiva',
    description: 'Inspeção e manutenção programada de equipamentos.',
    durationMinutes: 120,
    referencePrice: 250,
  },
  {
    id: 'service-002',
    companyId: 'company-001',
    name: 'Instalação de equipamento',
    description: 'Instalação e configuração de equipamentos.',
    durationMinutes: 90,
    referencePrice: 180,
  },
  {
    id: 'service-003',
    companyId: 'company-001',
    name: 'Inspeção técnica',
    description: 'Avaliação das condições de funcionamento.',
    durationMinutes: 60,
    referencePrice: 120,
  },
]
