import type {
  Order,
  OrderItem,
  Reservation,
} from '../types/order'

import { mockClients } from './clients'
import { mockServices } from './services'
import { mockTechnicians } from './technicians'

interface SeedDefinition {
  client: number
  service: number
  quantity: number
  status: Order['status']
  start: string
  end: string
}

const definitions: SeedDefinition[] = [
  {
    client: 0,
    service: 0,
    quantity: 1,
    status: 'Agendada',
    start: '2026-11-27T09:00:00-03:00',
    end: '2026-11-27T11:00:00-03:00',
  },
  {
    client: 1,
    service: 2,
    quantity: 2,
    status: 'Agendada',
    start: '2026-11-27T14:00:00-03:00',
    end: '2026-11-27T16:00:00-03:00',
  },
  {
    client: 2,
    service: 1,
    quantity: 1,
    status: 'Em andamento',
    start: '2026-11-26T08:00:00-03:00',
    end: '2026-11-26T09:30:00-03:00',
  },
  {
    client: 0,
    service: 2,
    quantity: 1,
    status: 'Em andamento',
    start: '2026-11-26T10:00:00-03:00',
    end: '2026-11-26T11:00:00-03:00',
  },
  {
    client: 1,
    service: 0,
    quantity: 1,
    status: 'Concluída',
    start: '2026-11-25T08:00:00-03:00',
    end: '2026-11-25T10:00:00-03:00',
  },
  {
    client: 2,
    service: 1,
    quantity: 2,
    status: 'Concluída',
    start: '2026-11-25T13:00:00-03:00',
    end: '2026-11-25T16:00:00-03:00',
  },
]

export function createMockOperations() {
  const orders: Order[] = []
  const items: OrderItem[] = []
  const reservations: Reservation[] = []

  const technician = mockTechnicians[0]

  definitions.forEach((definition, index) => {
    const number = String(index + 1).padStart(7, '0')
    const id = `D${number}`

    const client = mockClients[definition.client]
    const service = mockServices[definition.service]

    const start = new Date(definition.start).toISOString()
    const end = new Date(definition.end).toISOString()

    orders.push({
      id,
      companyId: 'company-001',
      clientId: client.id,
      clientName: client.name,
      address: `Rua Exemplo, ${100 + index * 20} — Lavras, MG`,
      notes: 'Ordem demonstrativa com dados sintéticos.',
      status: definition.status,
      createdAt: new Date(
        Date.parse(start) - 86400000,
      ).toISOString(),
      startedAt:
        definition.status !== 'Agendada'
          ? start
          : undefined,
      finishedAt:
        definition.status === 'Concluída'
          ? end
          : undefined,
    })

    items.push({
      id: `demo-item-${number}`,
      orderId: id,
      serviceId: service.id,
      serviceName: service.name,
      quantity: definition.quantity,
      unitPrice: service.referencePrice,
    })

    reservations.push({
      id: `demo-reservation-${number}`,
      orderId: id,
      technicianId: technician.id,
      technicianUserId: technician.userId,
      technicianName: technician.name,
      start,
      end,
    })
  })

  return { orders, items, reservations }
}
