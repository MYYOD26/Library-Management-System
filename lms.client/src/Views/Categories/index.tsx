import type { RouteObject } from 'react-router-dom'
import CategoriesPage from './CategoriesPage'

export const categoriesRoute: RouteObject = {
  path: '/categories',
  element: <CategoriesPage />
}

export default CategoriesPage
export * from './Interface.Categories'
export * from './categoriesService'
export * from './useCategories'
