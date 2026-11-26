import { createMockOperations } from '../mocks/orders'
import type {
  Order,
  OrderItem,
  Reservation,
} from '../types/order'

interface Operations {
  orders: Order[]
  items: OrderItem[]
  reservations: Reservation[]
}

const KEY = 'fieldops:operations'

export function readOperations(): Operations {
  const raw = localStorage.getItem(KEY)

  const data: Operations = raw
    ? JSON.parse(raw) as Operations
    : { orders: [], items: [], reservations: [] }

  const seedKey = 'fieldops:demo-orders-v1'

  if (!localStorage.getItem(seedKey)) {
    const demo = createMockOperations()

    const existingIds = new Set(
      data.orders.map((order) => order.id),
    )

    const newOrders = demo.orders.filter(
      (order) => !existingIds.has(order.id),
    )

    const newIds = new Set(
      newOrders.map((order) => order.id),
    )

    const merged: Operations = {
      orders: [...data.orders, ...newOrders],
      items: [
        ...data.items,
        ...demo.items.filter(
          (item) => newIds.has(item.orderId),
        ),
      ],
      reservations: [
        ...data.reservations,
        ...demo.reservations.filter(
          (item) => newIds.has(item.orderId),
        ),
      ],
    }

    localStorage.setItem(KEY, JSON.stringify(merged))
    localStorage.setItem(seedKey, 'true')

    return merged
  }

  return data
}

export function saveOperations(data: Operations) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function hasClientOrders(clientId: string): boolean {
  return readOperations().orders.some(
    (order) => order.clientId === clientId,
  )
}
