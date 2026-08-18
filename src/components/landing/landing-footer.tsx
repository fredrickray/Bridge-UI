import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/shared/logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          Escrow as a service — hold funds until the work clears.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/login"
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Get started
          </Link>
        </div>
      </div>
    </footer>
  )
}
