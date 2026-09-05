import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import type { SidebarProps } from '../../types/layout'
import { sidebarService, type MenuSectionDto, type MenuItemDto } from '../../Services/sidebarService'
import { renderMenuIcon } from '../../Services/iconMapper'
import { useAuth } from '../../Context/AuthContext'

export default function Sidebar({
  isExpanded,
  isMobileOpen,
  onCloseMobile
}: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [sections, setSections] = useState<MenuSectionDto[]>([])
  const [miniItems, setMiniItems] = useState<MenuItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadSidebarMenu() {
      try {
        const [fetchedSections, fetchedMiniItems] = await Promise.all([
          sidebarService.getMenuSections(user?.role),
          sidebarService.getMiniSidebarItems(user?.role)
        ])
        if (isMounted) {
          setSections(fetchedSections)
          setMiniItems(fetchedMiniItems)
        }
      } catch (error) {
        console.error('Failed to load sidebar menu data from service:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSidebarMenu()

    return () => {
      isMounted = false
    }
  }, [])

  const handleItemClick = (item: MenuItemDto) => {
    if (item.route) {
      navigate(item.route)
    }
    if (isMobileOpen) {
      onCloseMobile()
    }
  }

  // Helper to determine if a menu item is currently active based on current URL path
  const checkIsActive = (item: MenuItemDto) => {
    if (!item.route) return false
    if (item.route === '/' && location.pathname === '/') return true
    if (item.route !== '/' && location.pathname.startsWith(item.route)) return true
    return false
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200
          transition-all duration-200 ease-in-out select-none overflow-y-auto overflow-x-hidden
          custom-scrollbar
          /* Desktop Width */
          ${isExpanded ? 'md:w-60' : 'md:w-[72px]'}
          /* Mobile Drawer */
          ${isMobileOpen ? 'translate-x-0 w-60' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Drawer Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100 md:hidden">
          <span className="font-bold text-gray-800 text-sm">เมนูหลัก</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-100 rounded-lg w-full" />
            <div className="h-8 bg-gray-100 rounded-lg w-full" />
            <div className="h-8 bg-gray-100 rounded-lg w-full" />
          </div>
        ) : (isExpanded || isMobileOpen) ? (
          /* EXPANDED MODE (or Mobile Drawer) */
          <div className="py-2 px-2 space-y-4">
            {sections.map((section, idx) => (
              <div key={section.id || idx} className="space-y-1">
                {section.title && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item) => {
                  const isActive = checkIsActive(item)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-150 group cursor-pointer
                        ${isActive
                          ? 'bg-red-50 text-red-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`transition-colors ${isActive ? 'text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {renderMenuIcon(item.iconName, 20)}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}

                {idx < sections.length - 1 && (
                  <div className="my-2 border-t border-gray-100" />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* COLLAPSED MINI MODE (YouTube Mini Sidebar) */
          <div className="py-2 px-1 flex flex-col items-center space-y-1">
            {miniItems.map((item) => {
              const isActive = checkIsActive(item)
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  title={item.label}
                  className={`
                    w-full py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5
                    transition-all duration-150 group cursor-pointer
                    ${isActive
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className={`transition-colors ${isActive ? 'text-red-600' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {renderMenuIcon(item.iconName, 22)}
                  </span>
                  <span className="text-[10px] leading-none truncate max-w-[64px] font-medium text-center">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </aside>
    </>
  )
}
