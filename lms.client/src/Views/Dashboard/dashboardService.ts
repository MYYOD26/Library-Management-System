import type { DashboardStats, BookItemDto } from './Interface.Dashboard'

const mockStats: DashboardStats = {
  totalBooks: 12450,
  activeLoans: 142,
  dueToday: 18,
  totalMembers: 850
}

const mockRecentBooks: BookItemDto[] = [
  { id: '1', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', category: 'Software Development', status: 'available' },
  { id: '2', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma et al.', category: 'Software Engineering', status: 'borrowed' },
  { id: '3', title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler', category: 'Software Development', status: 'available' },
  { id: '4', title: 'The Pragmatic Programmer: Your Journey To Mastery', author: 'Andrew Hunt & David Thomas', category: 'Career & Tech', status: 'available' },
  { id: '5', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', status: 'reserved' },
]

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // TODO: Replace with backend API call (e.g. fetch('/api/dashboard/stats'))
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStats), 200)
    })
  },

  async getRecentBooks(): Promise<BookItemDto[]> {
    // TODO: Replace with backend API call (e.g. fetch('/api/dashboard/recent-books'))
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRecentBooks), 200)
    })
  }
}
