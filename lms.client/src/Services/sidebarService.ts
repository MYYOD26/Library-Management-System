export interface MenuItemDto {
  id: string
  label: string
  iconName: string
  route?: string
  badge?: string
  /** role ที่มีสิทธิ์เห็นเมนูนี้ (ไม่ระบุ = ทุก role) */
  roles?: string[]
}

export interface MenuSectionDto {
  id?: string
  title?: string
  items: MenuItemDto[]
}

// Initial default menu configuration (simulating data stored in Database)
const defaultMenuSections: MenuSectionDto[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'หน้าหลัก', iconName: 'Home', route: '/' },
      { id: 'books', label: 'สำรวจหนังสือ', iconName: 'BookOpen', route: '/books' },
      { id: 'categories', label: 'หมวดหมู่หนังสือ', iconName: 'Layers', route: '/categories' },
    ]
  },
  {
    id: 'library',
    title: 'การยืม-คืน',
    items: [
      { id: 'borrowings', label: 'รายการยืม-คืน', iconName: 'BookMarked', route: '/borrowings' },
    ]
  },
  {
    id: 'admin',
    title: 'การจัดการ (Admin)',
    items: [
      { id: 'members', label: 'จัดการสมาชิก', iconName: 'Users', route: '/members', roles: ['Admin', 'Librarian'] },
      { id: 'users', label: 'ผู้ใช้ระบบ', iconName: 'UserCog', route: '/users', roles: ['Admin'] },
    ]
  },
  // {
  //   id: 'reports',
  //   title: 'รายงานและระบบ',
  //   items: [
  //     { id: 'reports', label: 'รายงานและสถิติ', iconName: 'BarChart3', route: '/reports' },
  //     { id: 'settings', label: 'ตั้งค่าระบบ', iconName: 'Settings', route: '/settings' },
  //     { id: 'help', label: 'ช่วยเหลือ & คำแนะนำ', iconName: 'HelpCircle', route: '/help' },
  //   ]
  // }
]

const defaultMiniSidebarItems: MenuItemDto[] = [
  { id: 'home', label: 'หน้าหลัก', iconName: 'Home', route: '/' },
  { id: 'books', label: 'หนังสือ', iconName: 'BookOpen', route: '/books' },
  { id: 'borrowings', label: 'ยืม-คืน', iconName: 'BookMarked', route: '/borrowings' },
  { id: 'members', label: 'สมาชิก', iconName: 'Users', route: '/members', roles: ['Admin', 'Librarian'] },
]

/** กรองเมนูตาม role ของผู้ใช้ (item ที่ไม่ระบุ roles เห็นได้ทุก role) */
function filterByRole(items: MenuItemDto[], role?: string): MenuItemDto[] {
  return items.filter((item) => !item.roles || (role !== undefined && item.roles.includes(role)))
}

export const sidebarService = {
  async getMenuSections(role?: string): Promise<MenuSectionDto[]> {
    return new Promise((resolve) => {
      const sections = defaultMenuSections
        .map((section) => ({ ...section, items: filterByRole(section.items, role) }))
        .filter((section) => section.items.length > 0)
      setTimeout(() => resolve(sections), 100)
    })
  },

  async getMiniSidebarItems(role?: string): Promise<MenuItemDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(filterByRole(defaultMiniSidebarItems, role)), 100)
    })
  }
}
