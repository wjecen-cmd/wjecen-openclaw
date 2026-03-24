'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { userApi } from '@/lib/api'

interface User {
  id: string
  phone: string
  nickname?: string
  avatar?: string
  balance?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (!token) {
      setLoading(false)
      return
    }

    // 如果有保存的用户信息，直接使用
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // ignore
      }
    }
    
    setLoading(false)
    
    // TODO: 后续恢复 token 验证
    // try {
    //   const profile = await userApi.getProfile()
    //   setUser(profile)
    // } catch (error) {
    //   localStorage.removeItem('token')
    //   localStorage.removeItem('user')
    // } finally {
    //   setLoading(false)
    // }
  }

  const login = async (phone: string, code: string) => {
    try {
      const result = await userApi.login(phone, code)
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      setUser(result.user)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  const refreshUser = async () => {
    try {
      const profile = await userApi.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}