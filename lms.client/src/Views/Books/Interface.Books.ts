export type BookStatus = 'available' | 'borrowed' | 'reserved'

export interface BookDto {
  id: string
  title: string
  author: string
  isbn?: string | null
  publisher?: string | null
  publishedYear?: number | null
  description?: string | null
  coverUrl?: string | null
  categoryId: string
  categoryName: string
  totalCopies: number
  availableCopies: number
  status: BookStatus
  createdAt: string
}

export interface BookListResponse {
  items: BookDto[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface BookRequest {
  title: string
  author: string
  categoryId: string
  isbn?: string
  publisher?: string
  publishedYear?: number | null
  description?: string
  coverUrl?: string
  totalCopies: number
}

export interface BookFilters {
  search: string
  categoryId: string
  status: string
  page: number
}
