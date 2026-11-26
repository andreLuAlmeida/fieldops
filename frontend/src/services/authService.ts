import { mockCompanies, mockUsers } from '../mocks/auth'

import type {
  Company,
  User,
  MockUser,
  CompanyRegistration,
} from '../types/auth'

const USERS_KEY = 'fieldops:users'
const COMPANIES_KEY = 'fieldops:companies'
const SESSION_KEY = 'fieldops:session'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export function getUsers(): MockUser[] {
  return readStorage(USERS_KEY, mockUsers)
}

export function getCompanies(): Company[] {
  return readStorage(COMPANIES_KEY, mockCompanies)
}

export function saveUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(user: MockUser): User {
  return {
    id: user.id,
    companyId: user.companyId,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    avatar: user.avatar,
  }
}

export function login(email: string, password: string): User {
  const user = getUsers().find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase()
      && item.password === password,
  )

  if (!user) {
    throw new Error('E-mail ou senha inválidos.')
  }

  if (!user.active) {
    throw new Error('Esta conta está inativa.')
  }

  sessionStorage.setItem(SESSION_KEY, user.id)

  return publicUser(user)
}

export function getSession(): User | null {
  const userId = sessionStorage.getItem(SESSION_KEY)

  const user = getUsers().find(
    (item) => item.id === userId && item.active,
  )

  return user ? publicUser(user) : null
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function registerCompany(data: CompanyRegistration) {
  const users = getUsers()
  const companies = getCompanies()

  if (
    users.some(
      (user) => user.email.toLowerCase() ===
        data.email.trim().toLowerCase(),
    )
  ) {
    throw new Error('Este e-mail já está cadastrado.')
  }

  const cnpj = data.cnpj.replace(/\D/g, '')

  if (
    companies.some(
      (company) => company.cnpj.replace(/\D/g, '') === cnpj,
    )
  ) {
    throw new Error('Este CNPJ já está cadastrado.')
  }

  const company: Company = {
    id: crypto.randomUUID(),
    name: data.companyName.trim(),
    cnpj: data.cnpj,
    phone: data.phone,
  }

  const admin: MockUser = {
    id: crypto.randomUUID(),
    companyId: company.id,
    name: data.adminName.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    role: 'ADMIN',
    active: true,
  }

  localStorage.setItem(
    COMPANIES_KEY,
    JSON.stringify([...companies, company]),
  )

  saveUsers([...users, admin])
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const users = getUsers()
  const user = users.find((item) => item.id === userId)

  if (!user || user.password !== currentPassword) {
    throw new Error('A senha atual está incorreta.')
  }

  if (newPassword.length < 8) {
    throw new Error('A senha deve ter pelo menos oito caracteres.')
  }

  if (currentPassword === newPassword) {
    throw new Error('A nova senha deve ser diferente da atual.')
  }

  saveUsers(
    users.map((item) =>
      item.id === userId
        ? { ...item, password: newPassword }
        : item,
    ),
  )
}

export function updateAvatar(
  userId: string,
  avatar?: string,
) {
  saveUsers(
    getUsers().map((user) =>
      user.id === userId
        ? { ...user, avatar }
        : user,
    ),
  )

  return getSession()
}
