export type { MenuItemDto, MenuSectionDto } from '../Services/sidebarService'

export interface SidebarProps {
  isExpanded: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
  activeItem?: string
  onSelectItem?: (id: string) => void
}

export interface NavbarProps {
  onToggleSidebar: () => void
  onToggleMobileSidebar: () => void
}
