import type { RouteObject } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import { dashboardRoute } from '../Views/Dashboard'
import { booksRoute } from '../Views/Books'
import { categoriesRoute } from '../Views/Categories'
import { borrowingsRoute } from '../Views/Borrowings'
import { membersRoute } from '../Views/Members'
import { usersRoute } from '../Views/Users'

export const appRoutes: RouteObject[] = [
  dashboardRoute,
  booksRoute,
  categoriesRoute,
  borrowingsRoute,
  membersRoute,
  usersRoute,

  {
    path: '*',
    element: dashboardRoute.element
  }
]

export default function AppRoutes() {
  return useRoutes(appRoutes)
}
