import type { RouteObject } from 'react-router-dom'
import MembersPage from './MembersPage'

export const membersRoute: RouteObject = {
  path: '/members',
  element: <MembersPage />
}

export default MembersPage
export * from './Interface.Members'
export * from './membersService'
export * from './useMembers'
