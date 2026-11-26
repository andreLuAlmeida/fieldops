import { mockTechnicians } from '../mocks/technicians'
import type {
  Technician,
  TechnicianInput,
} from '../types/technician'
import type { MockUser } from '../types/auth'

import {
  getSession,
  getUsers,
  saveUsers,
} from './authService'

import { validEmail } from '../utils/validators'

const STORAGE_KEY = 'fieldops:technicians'

function requireAdmin() {
  const user = getSession()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Operação não autorizada.')
  }

  return user
}

function readTechnicians(): Technician[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)

    return data
      ? JSON.parse(data) as Technician[]
      : mockTechnicians
  } catch {
    return mockTechnicians
  }
}

function saveTechnicians(technicians: Technician[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(technicians),
  )
}

export function getTechnicians(): Technician[] {
  const user = requireAdmin()

  const users = getUsers()

  return readTechnicians()
    .filter((item) => item.companyId === user.companyId)
    .map((item) => ({
      ...item,
      active: users.find(
        (account) => account.id === item.userId,
      )?.active ?? false,
    }))
}

export function getTechnician(id: string): Technician {
  const technician = getTechnicians().find(
    (item) => item.id === id,
  )

  if (!technician) {
    throw new Error('Técnico não encontrado.')
  }

  return technician
}

export function createTechnician(
  data: TechnicianInput,
): Technician {
  const admin = requireAdmin()
  const users = getUsers()
  const technicians = readTechnicians()

  const name = data.name.trim()
  const email = data.email.trim().toLowerCase()
  const phone = data.phone.trim()

  if (!name) {
    throw new Error('Informe o nome do técnico.')
  }

  if (!validEmail(email)) {
    throw new Error('Informe um e-mail válido.')
  }

  if (!phone) {
    throw new Error('Informe o telefone.')
  }

  if (data.password.length < 8) {
    throw new Error('A senha deve possuir pelo menos oito caracteres.')
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error('Este e-mail já está cadastrado.')
  }

  const account: MockUser = {
    id: crypto.randomUUID(),
    companyId: admin.companyId,
    name,
    email,
    password: data.password,
    role: 'TECNICO',
    active: true,
  }

  const technician: Technician = {
    id: crypto.randomUUID(),
    userId: account.id,
    companyId: admin.companyId,
    name,
    email,
    phone,
    active: true,
  }

  saveUsers([...users, account])

  try {
    saveTechnicians([...technicians, technician])
  } catch {
    saveUsers(users)
    throw new Error('Não foi possível salvar o técnico.')
  }

  return technician
}
