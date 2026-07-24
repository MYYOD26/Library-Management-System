import type { RouteObject } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import { dashboardRoute } from '../Views/Dashboard'

export const appRoutes: RouteObject[] = [
  dashboardRoute,

  {
    path: '*',
    element: dashboardRoute.element
  }
]

export default function AppRoutes() {
  return useRoutes(appRoutes)
}
