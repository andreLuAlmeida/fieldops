import { useState } from 'react'
import type { ReactNode } from 'react'

import { AuthContext } from './AuthContext'
import {
  login,
  logout,
  getSession,
} from '../services/authService'

import type { User } from '../types/auth'

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(
    () => getSession(),
  )

  function signIn(email: string, password: string) {
    const authenticatedUser = login(email, password)

    setUser(authenticatedUser)

    return authenticatedUser
  }

  function signOut() {
    logout()
    setUser(null)
  }

  function refreshUser() {
    setUser(getSession())
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
