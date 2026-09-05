import { apiClient } from '../../Services/apiClient'
import type { BookDto, BookListResponse, BookRequest } from './Interface.Books'

export const booksService = {
  async getBooks(
    params: { search?: string; categoryId?: string; status?: string; page?: number; pageSize?: number } = {}
  ): Promise<BookListResponse> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.categoryId) query.set('categoryId', params.categoryId)
    if (params.status) query.set('status', params.status)
    query.set('page', String(params.page ?? 1))
    query.set('pageSize', String(params.pageSize ?? 12))
    return apiClient.get<BookListResponse>(`/books?${query.toString()}`)
  },

  async createBook(data: BookRequest): Promise<BookDto> {
    return apiClient.post<BookDto>('/books', data)
  },

  async updateBook(id: string, data: BookRequest): Promise<void> {
    return apiClient.put<void>(`/books/${id}`, data)
  },

  async deleteBook(id: string): Promise<void> {
    return apiClient.delete<void>(`/books/${id}`)
  }
}
