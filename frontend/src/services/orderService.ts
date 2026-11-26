import type {
  Order,
  OrderDetails,
  OrderInput,
  OrderItem,
  Reservation,
} from '../types/order'

import { getSession } from './authService'
import { getClient } from './clientService'
import { getTechnician } from './technicianService'
import { getService } from './catalogService'
import {
  readOperations,
  saveOperations,
} from './orderStorage'

function requireUser() {
  const user = getSession()

  if (!user) {
    throw new Error('Operação não autorizada.')
  }

  return user
}

function requireAdmin() {
  const user = requireUser()

  if (user.role !== 'ADMIN') {
    throw new Error('Operação não autorizada.')
  }

  return user
}

export function getOrders(): OrderDetails[] {
  const user = requireUser()
  const data = readOperations()

  return data.orders
    .filter((order) => order.companyId === user.companyId)
    .flatMap((order) => {
      const reservation = data.reservations.find(
        (item) => item.orderId === order.id,
      )

      if (!reservation) {
        throw new Error('Reserva da ordem não encontrada.')
      }

      if (
        user.role === 'TECNICO' &&
        reservation.technicianUserId !== user.id
      ) {
        return []
      }

      return [{
        ...order,
        reservation,
        items: data.items.filter(
          (item) => item.orderId === order.id,
        ),
      }]
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getOrder(id: string): OrderDetails {
  const order = getOrders().find((item) => item.id === id)

  if (!order) {
    throw new Error('Ordem de serviço não encontrada.')
  }

  return order
}

export function orderTotal(order: OrderDetails): number {
  return order.items.reduce(
    (sum, item) =>
      sum + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  ) / 100
}

function prepareOrder(data: OrderInput, id?: string) {
  const user = requireAdmin()
  const client = getClient(data.clientId)
  const technician = getTechnician(data.technicianId)

  if (!data.address.trim()) {
    throw new Error('Informe o endereço do atendimento.')
  }

  if (!technician.active) {
    throw new Error('Selecione um técnico ativo.')
  }

  const start = new Date(data.start).getTime()
  const end = new Date(data.end).getTime()

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start >= end
  ) {
    throw new Error('O horário final deve ser posterior ao inicial.')
  }

  const storage = readOperations()

  const conflict = storage.reservations.some(
    (reservation) =>
      reservation.orderId !== id &&
      reservation.technicianId === technician.id &&
      start < new Date(reservation.end).getTime() &&
      end > new Date(reservation.start).getTime(),
  )

  if (conflict) {
    throw new Error(
      'O técnico está indisponível no intervalo selecionado.',
    )
  }

  if (!data.items.length) {
    throw new Error('Adicione pelo menos um item à ordem.')
  }

  const orderId = id ?? crypto.randomUUID()

  const items: OrderItem[] = data.items.map((item) => {
    const service = getService(item.serviceId)

    if (
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error('Informe uma quantidade inteira positiva.')
    }

    if (
      !Number.isFinite(item.unitPrice) ||
      item.unitPrice < 0
    ) {
      throw new Error('Informe um valor unitário válido.')
    }

    return {
      id: crypto.randomUUID(),
      orderId,
      serviceId: service.id,
      serviceName: service.name,
      quantity: item.quantity,
      unitPrice: Math.round(item.unitPrice * 100) / 100,
    }
  })

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    orderId,
    technicianId: technician.id,
    technicianUserId: technician.userId,
    technicianName: technician.name,
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
  }

  return {
    storage,
    orderId,
    items,
    reservation,
    companyId: user.companyId,
    clientName: client.name,
  }
}

export function createOrder(data: OrderInput): OrderDetails {
  const prepared = prepareOrder(data)

  const order: Order = {
    id: prepared.orderId,
    companyId: prepared.companyId,
    clientId: data.clientId,
    clientName: prepared.clientName,
    address: data.address.trim(),
    notes: data.notes.trim(),
    status: 'Agendada',
    createdAt: new Date().toISOString(),
  }

  saveOperations({
    orders: [...prepared.storage.orders, order],
    items: [...prepared.storage.items, ...prepared.items],
    reservations: [
      ...prepared.storage.reservations,
      prepared.reservation,
    ],
  })

  return {
    ...order,
    items: prepared.items,
    reservation: prepared.reservation,
  }
}

export function updateOrder(
  id: string,
  data: OrderInput,
): OrderDetails {
  requireAdmin()

  const current = getOrder(id)

  if (current.status !== 'Agendada' || current.startedAt) {
    throw new Error('Somente ordens agendadas podem ser alteradas.')
  }

  const prepared = prepareOrder(data, id)

  const order: Order = {
    id: current.id,
    companyId: current.companyId,
    clientId: data.clientId,
    clientName: prepared.clientName,
    address: data.address.trim(),
    notes: data.notes.trim(),
    status: current.status,
    createdAt: current.createdAt,
  }

  saveOperations({
    orders: prepared.storage.orders.map(
      (item) => item.id === id ? order : item,
    ),
    items: [
      ...prepared.storage.items.filter(
        (item) => item.orderId !== id,
      ),
      ...prepared.items,
    ],
    reservations: [
      ...prepared.storage.reservations.filter(
        (item) => item.orderId !== id,
      ),
      {
        ...prepared.reservation,
        id: current.reservation.id,
      },
    ],
  })

  return getOrder(id)
}

export function deleteOrder(id: string) {
  requireAdmin()

  const order = getOrder(id)

  if (order.status !== 'Agendada' || order.startedAt) {
    throw new Error('Somente ordens sem execução podem ser excluídas.')
  }

  const data = readOperations()

  saveOperations({
    orders: data.orders.filter((item) => item.id !== id),
    items: data.items.filter((item) => item.orderId !== id),
    reservations: data.reservations.filter(
      (item) => item.orderId !== id,
    ),
  })
}

export function executeOrder(
  id: string,
  action: 'start' | 'finish',
) {
  const user = requireUser()

  if (user.role !== 'TECNICO') {
    throw new Error('Apenas técnicos podem executar atendimentos.')
  }

  const order = getOrder(id)

  if (action === 'start' && order.status !== 'Agendada') {
    throw new Error('O atendimento não pode ser iniciado.')
  }

  if (
    action === 'finish' &&
    (order.status !== 'Em andamento' || !order.startedAt)
  ) {
    throw new Error('O atendimento precisa estar em andamento.')
  }

  const data = readOperations()
  const now = new Date().toISOString()

  saveOperations({
    ...data,
    orders: data.orders.map((item): Order => {
      if (item.id !== id) return item

      return action === 'start'
        ? {
            ...item,
            status: 'Em andamento',
            startedAt: now,
          }
        : {
            ...item,
            status: 'Concluída',
            finishedAt: now,
          }
    }),
  })

  return getOrder(id)
}
