import { useCallback, useEffect, useState } from 'react'
import type { UserDto } from './Interface.Users'
import { usersService } from './usersService'

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

  const fetchUsers = useCallback(async (searchTerm?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await usersService.getUsers({ search: searchTerm || undefined })
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('ไม่สามารถโหลดรายชื่อผู้ใช้ระบบได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    fetchUsers(searchTerm)
  }

  return {
    users,
    isLoading,
    error,
    search,
    handleSearch,
    fetchUsers
  }
}
