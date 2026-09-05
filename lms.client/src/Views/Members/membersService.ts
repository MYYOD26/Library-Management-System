import { apiClient } from '../../Services/apiClient'
import type { MemberDto, MemberRequest } from './Interface.Members'

export const membersService = {
  async getMembers(params: { search?: string } = {}): Promise<MemberDto[]> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<MemberDto[]>(`/members${suffix}`)
  },

  async createMember(data: MemberRequest): Promise<MemberDto> {
    return apiClient.post<MemberDto>('/members', data)
  },

  async updateMember(id: string, data: MemberRequest): Promise<void> {
    return apiClient.put<void>(`/members/${id}`, data)
  },

  async deleteMember(id: string): Promise<void> {
    return apiClient.delete<void>(`/members/${id}`)
  }
}
