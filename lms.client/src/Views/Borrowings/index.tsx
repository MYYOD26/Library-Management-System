import type { RouteObject } from 'react-router-dom'
import BorrowingsPage from './BorrowingsPage'

export const borrowingsRoute: RouteObject = {
  path: '/borrowings',
  element: <BorrowingsPage />
}

export default BorrowingsPage
export * from './Interface.Borrowings'
export * from './borrowingsService'
export * from './useBorrowings'
