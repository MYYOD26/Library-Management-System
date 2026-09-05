import { useCallback, useEffect, useState } from 'react'
import type { MemberDto } from './Interface.Members'
import { membersService } from './membersService'

export function useMembers() {
  const [members, setMembers] = useState<MemberDto[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

  const fetchMembers = useCallback(async (searchTerm?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await membersService.getMembers({ search: searchTerm || undefined })
      setMembers(data)
    } catch (err) {
      console.error('Error fetching members:', err)
      setError('ไม่สามารถโหลดรายชื่อสมาชิกได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    fetchMembers(searchTerm)
  }

  return {
    members,
    isLoading,
    error,
    search,
    handleSearch,
    fetchMembers
  }
}
