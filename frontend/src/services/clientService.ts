import { hasClientOrders } from './orderStorage'
import { mockClients } from '../mocks/clients'
import type { Client, ClientInput } from '../types/client'
import { getSession } from './authService'
import {
  onlyDigits,
  validCpf,
  validCnpj,
  validEmail,
} from '../utils/validators'

const STORAGE_KEY = 'fieldops:clients'

function readClients(): Client[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)

    return data
      ? JSON.parse(data) as Client[]
      : mockClients
  } catch {
    return mockClients
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(clients),
  )
}

function requireAdmin() {
  const user = getSession()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Operação não autorizada.')
  }

  return user
}

export function getClients(): Client[] {
  const user = requireAdmin()

  return readClients().filter(
    (client) => client.companyId === user.companyId,
  )
}

export function getClient(id: string): Client {
  const client = getClients().find((item) => item.id === id)

  if (!client) {
    throw new Error('Cliente não encontrado.')
  }

  return client
}

function validateClient(data: ClientInput, id?: string) {
  if (!data.name.trim()) {
    throw new Error('Informe o nome do cliente.')
  }

  if (data.type === 'PF' && !validCpf(data.document)) {
    throw new Error('Informe um CPF válido.')
  }

  if (data.type === 'PJ' && !validCnpj(data.document)) {
    throw new Error('Informe um CNPJ válido.')
  }

  if (!validEmail(data.email)) {
    throw new Error('Informe um e-mail válido.')
  }

  if (!data.phone.trim()) {
    throw new Error('Informe o telefone.')
  }

  const duplicate = getClients().some(
    (client) =>
      client.id !== id &&
      onlyDigits(client.document) === onlyDigits(data.document),
  )

  if (duplicate) {
    throw new Error('Este CPF/CNPJ já está cadastrado.')
  }
}

export function createClient(data: ClientInput): Client {
  const user = requireAdmin()

  validateClient(data)

  const client: Client = {
    ...data,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    id: crypto.randomUUID(),
    companyId: user.companyId,
  }

  saveClients([...readClients(), client])

  return client
}

export function updateClient(
  id: string,
  data: ClientInput,
): Client {
  const current = getClient(id)

  if (current.type !== data.type) {
    throw new Error('O tipo de pessoa não pode ser alterado.')
  }

  validateClient(data, id)

  const updated: Client = {
    ...current,
    ...data,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    id: current.id,
    companyId: current.companyId,
  }

  saveClients(
    readClients().map((client) =>
      client.id === id ? updated : client,
    ),
  )

  return updated
}

export function deleteClient(id: string) {
  const client = getClient(id)

  if (hasClientOrders(client.id)) {
    throw new Error(
      'Não é possível excluir um cliente vinculado a ordens de serviço.',
    )
  }

  saveClients(
    readClients().filter((item) => item.id !== client.id),
  )
}
