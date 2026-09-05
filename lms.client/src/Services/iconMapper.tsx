import {
  Home,
  BookOpen,
  Layers,
  BookMarked,
  History,
  Heart,
  FileSpreadsheet,
  Users,
  UserCog,
  BarChart3,
  Settings,
  HelpCircle,
  HelpCircle as DefaultIcon
} from 'lucide-react'
import type { JSX } from 'react'

const iconMap: Record<string, (size?: number) => JSX.Element> = {
  Home: (size = 20) => <Home size={size} />,
  BookOpen: (size = 20) => <BookOpen size={size} />,
  Layers: (size = 20) => <Layers size={size} />,
  BookMarked: (size = 20) => <BookMarked size={size} />,
  History: (size = 20) => <History size={size} />,
  Heart: (size = 20) => <Heart size={size} />,
  FileSpreadsheet: (size = 20) => <FileSpreadsheet size={size} />,
  Users: (size = 20) => <Users size={size} />,
  UserCog: (size = 20) => <UserCog size={size} />,
  BarChart3: (size = 20) => <BarChart3 size={size} />,
  Settings: (size = 20) => <Settings size={size} />,
  HelpCircle: (size = 20) => <HelpCircle size={size} />
}

export function renderMenuIcon(iconName: string, size = 20): JSX.Element {
  const iconRenderer = iconMap[iconName]
  return iconRenderer ? iconRenderer(size) : <DefaultIcon size={size} />
}
