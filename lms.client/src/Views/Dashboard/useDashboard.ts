import { useState, useEffect, useCallback } from 'react'
import type { DashboardStats, BookItemDto } from './Interface.Dashboard'
import { dashboardService } from './dashboardService'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBooks, setRecentBooks] = useState<BookItemDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsData, booksData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentBooks()
      ])
      setStats(statsData)
      setRecentBooks(booksData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = () => {
    fetchDashboardData()
  }

  return {
    stats,
    recentBooks,
    isLoading,
    error,
    handleRefresh
  }
}
