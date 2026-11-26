import { createContext } from 'react'
import type { User } from '../types/auth'

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => User
  signOut: () => void
  refreshUser: () => void
}

export const AuthContext =
  createContext<AuthContextData | null>(null)
