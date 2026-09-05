import { apiClient } from '../../Services/apiClient'
import type { CategoryDto, CategoryRequest } from './Interface.Categories'

export const categoriesService = {
  async getCategories(): Promise<CategoryDto[]> {
    return apiClient.get<CategoryDto[]>('/categories')
  },

  async createCategory(data: CategoryRequest): Promise<CategoryDto> {
    return apiClient.post<CategoryDto>('/categories', data)
  },

  async updateCategory(id: string, data: CategoryRequest): Promise<void> {
    return apiClient.put<void>(`/categories/${id}`, data)
  },

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`)
  }
}
