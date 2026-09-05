import { apiClient } from '../../Services/apiClient'
import type { BorrowingDto, BorrowRequest } from './Interface.Borrowings'

export const borrowingsService = {
  async getBorrowings(
    params: { status?: string; search?: string; limit?: number } = {}
  ): Promise<BorrowingDto[]> {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    query.set('limit', String(params.limit ?? 200))
    return apiClient.get<BorrowingDto[]>(`/borrowings?${query.toString()}`)
  },

  async borrowBook(data: BorrowRequest): Promise<BorrowingDto> {
    return apiClient.post<BorrowingDto>('/borrowings/borrow', data)
  },

  async returnBook(id: string): Promise<BorrowingDto> {
    return apiClient.post<BorrowingDto>(`/borrowings/${id}/return`)
  }
}
