import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-signal/20 ring-1 ring-signal/35">
        <span className="size-2 rounded-full bg-signal" />
      </span>
      <span
        data-slot="logo-wordmark"
        className="font-serif text-xl tracking-tight group-data-[collapsible=icon]:hidden"
      >
        Bridge
      </span>
    </span>
  )
}
