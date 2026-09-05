import { apiClient } from '../../Services/apiClient'
import type { DashboardStats, BookItemDto } from './Interface.Dashboard'

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats')
  },

  async getRecentBooks(): Promise<BookItemDto[]> {
    return apiClient.get<BookItemDto[]>('/dashboard/recent-books')
  }
}
