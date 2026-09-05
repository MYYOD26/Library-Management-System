import { authStorage } from './authStorage'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = authStorage.getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      ...options
    })
  } catch {
    throw new ApiError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า API ทำงานอยู่', 0)
  }

  // Token หมดอายุหรือไม่ถูกต้อง (ไม่ใช่กรณี login ผิด) → เคลียร์ session และแจ้ง AuthContext
  if (response.status === 401 && authStorage.getToken()) {
    authStorage.clear()
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  }

  if (!response.ok) {
    let message = 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง'
    try {
      const problem = await response.json()
      message = problem.detail || problem.message || problem.title || message
    } catch {
      // ไม่สามารถ parse body ได้ ใช้ข้อความ default
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' })
}
