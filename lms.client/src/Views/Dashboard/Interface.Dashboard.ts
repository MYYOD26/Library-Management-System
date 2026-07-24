export interface DashboardStats {
  totalBooks: number
  activeLoans: number
  dueToday: number
  totalMembers: number
}

export interface BookItemDto {
  id: string
  title: string
  author: string
  category: string
  coverUrl?: string
  status: 'available' | 'borrowed' | 'reserved'
}
