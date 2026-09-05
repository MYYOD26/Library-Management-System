export type BorrowingStatus = 'active' | 'overdue' | 'returned'

export interface BorrowingDto {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  memberId: string
  memberName: string
  memberCode: string
  borrowedAt: string
  dueDate: string
  returnedAt?: string | null
  status: BorrowingStatus
}

export interface BorrowRequest {
  bookId: string
  memberId: string
}

export type BorrowingsTab = 'active' | 'overdue' | 'returned'
