import type { RouteObject } from 'react-router-dom'
import DashboardPage from './DashboardPage'

export const dashboardRoute: RouteObject = {
  path: '/',
  element: <DashboardPage />
}

export default DashboardPage
export * from './Interface.Dashboard'
export * from './dashboardService'
export * from './useDashboard'
