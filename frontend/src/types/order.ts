import type { OrderStatus } from '../components/ui/StatusBadge'

export interface Order {
  id: string
  companyId: string
  clientId: string
  clientName: string
  address: string
  notes: string
  status: OrderStatus
  createdAt: string
  startedAt?: string
  finishedAt?: string
}

export interface OrderItem {
  id: string
  orderId: string
  serviceId: string
  serviceName: string
  quantity: number
  unitPrice: number
}

export interface Reservation {
  id: string
  orderId: string
  technicianId: string
  technicianUserId: string
  technicianName: string
  start: string
  end: string
}

export interface OrderDetails extends Order {
  items: OrderItem[]
  reservation: Reservation
}

export interface OrderInput {
  clientId: string
  address: string
  notes: string
  technicianId: string
  start: string
  end: string
  items: {
    serviceId: string
    quantity: number
    unitPrice: number
  }[]
}
