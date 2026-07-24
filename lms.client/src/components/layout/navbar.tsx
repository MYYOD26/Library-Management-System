import { Menu, Bell, User } from 'lucide-react'
import type { NavbarProps } from '../../types/layout'
import reactLogo from '../../assets/react.svg'

export default function Navbar({
  onToggleSidebar,
  onToggleMobileSidebar
}: NavbarProps) {
  const handleMenuClick = () => {
    // Check window size to toggle desktop vs mobile
    if (window.innerWidth < 768) {
      onToggleMobileSidebar()
    } else {
      onToggleSidebar()
    }
  }

  return (
    <header className="sticky top-0 z-50 h-14 w-full bg-white border-b border-gray-200 px-3 md:px-4 flex items-center justify-between gap-2 md:gap-4 select-none">
      {/* LEFT SECTION: Menu Button & Brand Logo */}
      <div className="flex items-center gap-3 min-w-max">
        <button
          onClick={handleMenuClick}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-full text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <a href="/" className="flex items-center gap-2.5 text-decoration-none group">
          {/* *** จุดนี้คือโลโก้ไอคอนใน Navbar (เปลี่ยนเป็น react.svg แล้ว) *** */}
          <img
            src={reactLogo}
            alt="React logo"
            className="w-8 h-8 group-hover:rotate-45 transition-transform duration-300"
          />

          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-gray-900 leading-tight">
              LMS<span className="text-red-600 font-extrabold ml-1">Library</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium leading-none hidden sm:inline">
              Management System
            </span>
          </div>
        </a>
      </div>

      {/* RIGHT SECTION: Notifications & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          title="การแจ้งเตือน"
          className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="pl-1 border-l border-gray-200 ml-1">
          <button
            title="โปรไฟล์ผู้ใช้"
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
