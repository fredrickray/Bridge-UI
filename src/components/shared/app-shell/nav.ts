import {
  FlagIcon,
  FolderKanbanIcon,
  SettingsIcon,
  UnlockIcon,
  UsersIcon,
} from 'lucide-react'

export const PAGE_SLUGS = [
  'agreements',
  'parties',
  'milestones',
  'releases',
  'settings',
] as const

export type PageSlug = (typeof PAGE_SLUGS)[number]

export const NAV_ITEMS = [
  { slug: 'agreements', label: 'Agreements', icon: FolderKanbanIcon },
  { slug: 'parties', label: 'Parties', icon: UsersIcon },
  { slug: 'milestones', label: 'Milestones', icon: FlagIcon },
  { slug: 'releases', label: 'Releases', icon: UnlockIcon },
  { slug: 'settings', label: 'Profile', icon: SettingsIcon },
] as const

export function isPageSlug(value: string): value is PageSlug {
  return PAGE_SLUGS.some((slug) => slug === value)
}

export function pageLabel(slug: string) {
  return NAV_ITEMS.find((item) => item.slug === slug)?.label ?? 'Agreements'
}

export const DEMO_USER = {
  name: 'Ada Okonkwo',
  email: 'ada@bridge.escrow',
}

export const PAGE_INTRO: Record<
  PageSlug,
  { title: string; description: string }
> = {
  agreements: {
    title: 'Agreements',
    description: 'Escrow deals in flight. This is demo content for layout testing.',
  },
  parties: {
    title: 'Parties',
    description: 'Payers and providers on the current workspace.',
  },
  milestones: {
    title: 'Milestones',
    description: 'Work held in escrow until evidence is accepted.',
  },
  releases: {
    title: 'Releases',
    description: 'Funds unlocked after inspection.',
  },
  settings: {
    title: 'Profile & account',
    description: 'Manage your profile, sign-in details, and notification preferences.',
  },
}
