import { useCallback, useEffect, useState } from 'react'
import type { CategoryDto } from './Interface.Categories'
import { categoriesService } from './categoriesService'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await categoriesService.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('ไม่สามารถโหลดหมวดหมู่หนังสือได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    fetchCategories
  }
}
