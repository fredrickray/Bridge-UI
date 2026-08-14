import { Link } from '@tanstack/react-router'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15">
            <span className="size-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-serif text-lg">Relay</span>
        </div>
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
