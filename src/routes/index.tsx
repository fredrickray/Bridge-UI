import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthState } from '@/lib/auth/session'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { token } = getAuthState()
    throw redirect({ to: token ? '/workspace' : '/login' })
  },
})
