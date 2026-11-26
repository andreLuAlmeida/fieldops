import { mockServices } from '../mocks/services'
import type { Service, ServiceInput } from '../types/service'
import { getSession } from './authService'

const STORAGE_KEY = 'fieldops:services'

function requireAdmin() {
  const user = getSession()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Operação não autorizada.')
  }

  return user
}

function readServices(): Service[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)

    return data
      ? JSON.parse(data) as Service[]
      : mockServices
  } catch {
    return mockServices
  }
}

export function getServices(): Service[] {
  const user = requireAdmin()

  return readServices().filter(
    (item) => item.companyId === user.companyId,
  )
}

export function getService(id: string): Service {
  const service = getServices().find(
    (item) => item.id === id,
  )

  if (!service) {
    throw new Error('Serviço não encontrado.')
  }

  return service
}

export function createService(data: ServiceInput): Service {
  const user = requireAdmin()
  const name = data.name.trim()

  if (!name) {
    throw new Error('Informe o nome do serviço.')
  }

  if (
    !Number.isInteger(data.durationMinutes) ||
    data.durationMinutes <= 0
  ) {
    throw new Error('Informe uma duração válida em minutos.')
  }

  if (
    !Number.isFinite(data.referencePrice) ||
    data.referencePrice < 0
  ) {
    throw new Error('Informe um valor de referência válido.')
  }

  const duplicate = getServices().some(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  )

  if (duplicate) {
    throw new Error('Já existe um serviço com este nome.')
  }

  const service: Service = {
    ...data,
    name,
    description: data.description.trim(),
    referencePrice: Math.round(data.referencePrice * 100) / 100,
    id: crypto.randomUUID(),
    companyId: user.companyId,
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...readServices(), service]),
  )

  return service
}
