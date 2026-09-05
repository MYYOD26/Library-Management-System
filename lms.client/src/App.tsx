import { useState } from 'react'
import Navbar from './components/layout/navbar'
import Sidebar from './components/layout/sidebar'
import AppRoutes from './routes'
import LoginPage from './Views/Auth/LoginPage'
import { useAuth } from './Context/AuthContext'
import { BookOpenText } from 'lucide-react'

export default function App() {
  const { user, isLoading } = useAuth()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev)
  }

  // กำลังกู้คืน session จาก token ที่บันทึกไว้
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 select-none">
        <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-md animate-pulse">
          <BookOpenText size={28} />
        </div>
        <p className="text-sm text-gray-500 font-medium">กำลังโหลดระบบ...</p>
      </div>
    )
  }

  // ยังไม่ได้เข้าสู่ระบบ → แสดงหน้า Login เท่านั้น
  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        onToggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Main Container with Sidebar & Content */}
      <div className="flex flex-1 relative">
        {/* YouTube-style Sidebar */}
        <Sidebar
          isExpanded={isExpanded}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Content Area - Automatically adjusts margin based on sidebar state */}
        <main
          className={`
            flex-1 p-4 md:p-6 transition-all duration-200 ease-in-out
            ${isExpanded ? 'md:ml-60' : 'md:ml-[72px]'}
          `}
        >
          {/* Central Modular Router */}
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}
