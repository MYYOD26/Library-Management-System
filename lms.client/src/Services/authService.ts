import { apiClient } from './apiClient'
import type { AuthUser } from './authStorage'

export interface LoginResponse {
  token: string
  expiresAt: string
  user: AuthUser
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', { username, password })
  },

  /** ตรวจสอบ token ที่บันทึกไว้ยังใช้ได้อยู่หรือไม่ พร้อมข้อมูลผู้ใช้ล่าสุด */
  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me')
  }
}
