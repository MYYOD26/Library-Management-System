import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../Services/authService'
import { authStorage } from '../Services/authStorage'
import type { AuthUser } from '../Services/authStorage'

interface AuthContextValue {
  user: AuthUser | null
  /** true ระหว่างกู้คืน session จาก localStorage ตอนเปิดหน้าเว็บครั้งแรก */
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  /** Admin หรือ Librarian — มีสิทธิ์เพิ่ม/แก้ไข/ลบข้อมูลและบันทึกยืม-คืน */
  canManage: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // กู้คืน session ตอนเปิดหน้าเว็บ: เช็ค token กับ backend (/auth/me) ทุกครั้ง
  useEffect(() => {
    const restoreSession = async () => {
      const token = authStorage.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const me = await authService.getMe()
        authStorage.save(token, me)
        setUser(me)
      } catch {
        authStorage.clear()
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  // API ตอบ 401 (token หมดอายุ/ถูกยกเลิก) → logout อัตโนมัติ
  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login(username, password)
    authStorage.save(response.token, response.user)
    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    authStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    login,
    logout,
    canManage: user?.role === 'Admin' || user?.role === 'Librarian',
    isAdmin: user?.role === 'Admin'
  }), [user, isLoading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
