import {
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboardIcon },
  { to: '/agreements', label: 'Agreements', icon: FolderKanbanIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
] as const

export type NavTo = (typeof NAV_ITEMS)[number]['to']

export function isNavPathActive(to: NavTo, pathname: string) {
  if (to === '/agreements') {
    return pathname === '/agreements' || pathname.startsWith('/agreements/')
  }
  return pathname === to
}

export function navLabelForPath(pathname: string) {
  if (pathname === '/create-agreement') return 'New agreement'
  const item = NAV_ITEMS.find((nav) => isNavPathActive(nav.to, pathname))
  return item?.label ?? 'Overview'
}
