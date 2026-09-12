"use client"

import * as React from "react"
import { User, getToken, setToken, removeToken, apiFetch } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; full_name: string; password: string; role?: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [token, setTokenState] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)

  const fetchCurrentUser = React.useCallback(async () => {
    const savedToken = getToken()
    if (!savedToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    setTokenState(savedToken)
    try {
      const userData = await apiFetch<User>("/auth/me")
      setUser(userData)
    } catch {
      // Token expired or invalid on real backend
      removeToken()
      setTokenState(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await apiFetch<{ access_token: string; token_type: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      setToken(data.access_token)
      setTokenState(data.access_token)
      setUser(data.user)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: { email: string; full_name: string; password: string; role?: string }) => {
    setIsLoading(true)
    try {
      await apiFetch<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })
      // Automatically log in after registration
      await login(userData.email, userData.password)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
