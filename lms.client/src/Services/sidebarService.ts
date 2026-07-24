export interface MenuItemDto {
  id: string
  label: string
  iconName: string
  route?: string
  badge?: string
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
  // {
  //   id: 'library',
  //   title: 'คลังหนังสือของฉัน',
  //   items: [
  //     { id: 'borrowed', label: 'รายการยืม-คืน', iconName: 'BookMarked', route: '/borrowed' },
  //     { id: 'history', label: 'ประวัติการยืม', iconName: 'History', route: '/history' },
  //     { id: 'favorites', label: 'หนังสือโปรด', iconName: 'Heart', route: '/favorites' },
  //   ]
  // },
  // {
  //   id: 'admin',
  //   title: 'การจัดการ (Admin)',
  //   items: [
  //     { id: 'manage-books', label: 'จัดการรายการหนังสือ', iconName: 'FileSpreadsheet', route: '/manage-books' },
  //     { id: 'members', label: 'จัดการสมาชิก', iconName: 'Users', route: '/members' },
  //     { id: 'reports', label: 'รายงานและสถิติ', iconName: 'BarChart3', route: '/reports' },
  //   ]
  // },
  // {
  //   id: 'system',
  //   title: 'ตั้งค่าและช่วยเหลือ',
  //   items: [
  //     { id: 'settings', label: 'ตั้งค่าระบบ', iconName: 'Settings', route: '/settings' },
  //     { id: 'help', label: 'ช่วยเหลือ & คำแนะนำ', iconName: 'HelpCircle', route: '/help' },
  //   ]
  // }
]

const defaultMiniSidebarItems: MenuItemDto[] = [
  { id: 'home', label: 'หน้าหลัก', iconName: 'Home', route: '/' },
  // { id: 'books', label: 'หนังสือ', iconName: 'BookOpen', route: '/books' },
  // { id: 'borrowed', label: 'รายการยืม', iconName: 'BookMarked', route: '/borrowed' },
  // { id: 'history', label: 'ประวัติ', iconName: 'History', route: '/history' },
  // { id: 'settings', label: 'ตั้งค่า', iconName: 'Settings', route: '/settings' },
]

export const sidebarService = {
  async getMenuSections(): Promise<MenuSectionDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(defaultMenuSections), 100)
    })
  },

  async getMiniSidebarItems(): Promise<MenuItemDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(defaultMiniSidebarItems), 100)
    })
  }
}
