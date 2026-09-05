/** จัดเก็บ JWT token และข้อมูลผู้ใช้ปัจจุบันใน localStorage */

export type AppRole = 'Admin' | 'Librarian' | 'Member'

export interface AuthUser {
  id: string
  username: string
  email: string
  fullName: string
  role: AppRole
  isActive: boolean
}

const TOKEN_KEY = 'lms.auth.token'
const USER_KEY = 'lms.auth.user'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },

  save(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}
