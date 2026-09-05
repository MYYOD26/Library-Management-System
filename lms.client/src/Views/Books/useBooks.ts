import { useCallback, useEffect, useState } from 'react'
import type { BookFilters, BookListResponse } from './Interface.Books'
import { booksService } from './booksService'

export function useBooks() {
  const [books, setBooks] = useState<BookListResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookFilters>({ search: '', categoryId: '', status: '', page: 1 })

  const fetchBooks = useCallback(async (currentFilters: BookFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await booksService.getBooks({
        search: currentFilters.search || undefined,
        categoryId: currentFilters.categoryId || undefined,
        status: currentFilters.status || undefined,
        page: currentFilters.page
      })
      setBooks(data)
    } catch (err) {
      console.error('Error fetching books:', err)
      setError('ไม่สามารถโหลดรายการหนังสือได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks(filters)
  }, [fetchBooks, filters])

  // เปลี่ยนเงื่อนไขค้นหา/ตัวกรอง แล้วกลับไปที่หน้าแรกเสมอ
  const updateFilters = useCallback((partial: Partial<Omit<BookFilters, 'page'>>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const refresh = useCallback(() => {
    fetchBooks(filters)
  }, [fetchBooks, filters])

  return {
    books,
    isLoading,
    error,
    filters,
    updateFilters,
    setPage,
    refresh
  }
}
