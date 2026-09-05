export interface CategoryDto {
  id: string
  name: string
  description?: string | null
  bookCount: number
}

export interface CategoryRequest {
  name: string
  description?: string
}
