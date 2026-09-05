import { apiClient } from '../../Services/apiClient'
import type { CreateUserRequest, UpdateUserRequest, UserDto } from './Interface.Users'

export const usersService = {
  async getUsers(params: { search?: string } = {}): Promise<UserDto[]> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<UserDto[]>(`/users${suffix}`)
  },

  async createUser(data: CreateUserRequest): Promise<UserDto> {
    return apiClient.post<UserDto>('/users', data)
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
    return apiClient.put<void>(`/users/${id}`, data)
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`/users/${id}/reset-password`, { newPassword })
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`)
  }
}
