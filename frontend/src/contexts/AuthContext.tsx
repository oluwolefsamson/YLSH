import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { logout as apiLogout, getMe, type AuthUser } from '@/services/endpoints/auth/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const ROLE_REDIRECTS: Record<string, string> = {
  participant: '/dashboard',
  mentor: '/mentor',
  admin: '/admin',
  'super-admin': '/super-admin',
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setIsLoading(false); return }
    getMe()
      .then(({ user: u }) => setUser(u))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [])

  const logout = useCallback(async () => {
    await apiLogout().catch(() => {})
    localStorage.removeItem('token')
    setUser(null)
    router.push('/signin')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: Boolean(user), logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
