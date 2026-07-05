import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { getAuthState, logout } from '@/lib/auth/session'

export const Route = createFileRoute('/workspace')({
  beforeLoad: () => {
    const { token } = getAuthState()
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
  component: WorkspacePage,
})

function WorkspacePage() {
  const navigate = useNavigate()
  const { user } = getAuthState()

  function handleLogout() {
    logout()
    void navigate({ to: '/login' })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-2xl">Bridge</p>
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            Welcome{user?.fullName ? `, ${user.fullName}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground">
            Auth is ready. Agreement flows come next.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Sign out
        </Button>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-medium">Signed in as</h2>
        <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
      </section>
    </div>
  )
}
