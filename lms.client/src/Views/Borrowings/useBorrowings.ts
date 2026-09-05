import { useCallback, useEffect, useState } from 'react'
import type { BorrowingsTab, BorrowingDto } from './Interface.Borrowings'
import { borrowingsService } from './borrowingsService'

export function useBorrowings() {
  const [borrowings, setBorrowings] = useState<BorrowingDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<BorrowingsTab>('active')
  const [search, setSearch] = useState<string>('')

  const fetchBorrowings = useCallback(async (currentTab: BorrowingsTab, searchTerm?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await borrowingsService.getBorrowings({
        status: currentTab,
        search: searchTerm || undefined
      })
      setBorrowings(data)
    } catch (err) {
      console.error('Error fetching borrowings:', err)
      setError('ไม่สามารถโหลดรายการยืม-คืนได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBorrowings(tab, search)
    // จงใจไม่รวม search เพราะการค้นหาจะ trigger ผ่าน handleSearch เท่านั้น
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, fetchBorrowings])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    fetchBorrowings(tab, searchTerm)
  }

  const changeTab = (newTab: BorrowingsTab) => {
    setTab(newTab)
  }

  return {
    borrowings,
    isLoading,
    error,
    tab,
    search,
    changeTab,
    handleSearch,
    fetchBorrowings
  }
}
