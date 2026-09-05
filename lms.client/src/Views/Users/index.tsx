import type { RouteObject } from 'react-router-dom'
import UsersPage from './UsersPage'

export const usersRoute: RouteObject = {
  path: '/users',
  element: <UsersPage />
}

export default UsersPage
export * from './Interface.Users'
export * from './usersService'
export * from './useUsers'
