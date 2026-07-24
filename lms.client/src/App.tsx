import { useState } from 'react'
import Navbar from './components/layout/navbar'
import Sidebar from './components/layout/sidebar'
import AppRoutes from './routes'

export default function App() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev)
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
