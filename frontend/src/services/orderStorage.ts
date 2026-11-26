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
  const data = localStorage.getItem(KEY)

  return data
    ? JSON.parse(data) as Operations
    : {
        orders: [],
        items: [],
        reservations: [],
      }
}

export function saveOperations(data: Operations) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function hasClientOrders(clientId: string): boolean {
  return readOperations().orders.some(
    (order) => order.clientId === clientId,
  )
}
