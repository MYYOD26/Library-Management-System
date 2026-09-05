import type { RouteObject } from 'react-router-dom'
import BooksPage from './BooksPage'

export const booksRoute: RouteObject = {
  path: '/books',
  element: <BooksPage />
}

export default BooksPage
export * from './Interface.Books'
export * from './booksService'
export * from './useBooks'
