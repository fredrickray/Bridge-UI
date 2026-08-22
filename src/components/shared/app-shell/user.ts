import { getAuthState } from '@/lib/auth/session'

const DEMO_USER = {
  name: 'Ada Okonkwo',
  email: 'ada@bridge.escrow',
}

export function getShellUser() {
  const { user } = getAuthState()
  if (user) {
    return {
      name: user.fullName || DEMO_USER.name,
      email: user.email,
      signedIn: true,
    }
  }

  return { ...DEMO_USER, signedIn: false }
}

export function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  return parts
    .slice(0, 2)
    .map((part) => (part[0] || '').toUpperCase())
    .join('')
}
