import { useState } from 'react'
import { Bell, LogOut, Menu, User } from 'lucide-react'
import type { NavbarProps } from '../../types/layout'
import { useAuth } from '../../Context/AuthContext'
import reactLogo from '../../assets/react.svg'

const roleLabels: Record<string, string> = {
  Admin: 'ผู้ดูแลระบบ',
  Librarian: 'บรรณารักษ์',
  Member: 'สมาชิก'
}

const roleBadgeStyles: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Librarian: 'bg-blue-100 text-blue-700',
  Member: 'bg-emerald-100 text-emerald-700'
}

export default function Navbar({
  onToggleSidebar,
  onToggleMobileSidebar
}: NavbarProps) {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleMenuClick = () => {
    // Check window size to toggle desktop vs mobile
    if (window.innerWidth < 768) {
      onToggleMobileSidebar()
    } else {
      onToggleSidebar()
    }
  }

  const handleLogout = () => {
    setIsProfileOpen(false)
    logout()
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

        <div className="relative pl-1 border-l border-gray-200 ml-1">
          <button
            title="โปรไฟล์ผู้ใช้"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm">
              <User size={18} />
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">@{user?.username} • {user?.email}</p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      roleBadgeStyles[user?.role ?? ''] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {roleLabels[user?.role ?? ''] ?? user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> ออกจากระบบ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
