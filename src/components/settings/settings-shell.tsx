import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const easeOut = [0.23, 1, 0.32, 1] as const

type SettingsIdentityProps = {
  name: string
  email: string
  company?: string
  verified: boolean
  initials: string
}

export function SettingsIdentity({
  name,
  email,
  company,
  verified,
  initials,
}: SettingsIdentityProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl bg-harbor text-harbor-foreground"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 80% at 0% 0%, oklch(0.45 0.09 180 / 0.45), transparent 55%),
            radial-gradient(ellipse 50% 60% at 100% 100%, oklch(0.55 0.1 85 / 0.22), transparent 50%),
            linear-gradient(135deg, transparent 40%, oklch(0.18 0.03 240 / 0.5) 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.9 0.02 180 / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.9 0.02 180 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 20% 40%, black, transparent 70%)',
        }}
      />

      <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-signal/20 font-heading text-xl font-medium text-signal ring-1 ring-signal/40 sm:size-20 sm:text-2xl">
              {initials}
            </div>
            <span className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-signal ring-2 ring-harbor" />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              {name || 'Your profile'}
            </p>
            <p className="truncate text-sm text-harbor-foreground/70">{email}</p>
            {company ? (
              <p className="text-xs tracking-wide text-harbor-foreground/45 uppercase">
                {company}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-white/10 bg-white/10 text-harbor-foreground hover:bg-white/15">
            {verified ? 'Verified account' : 'Email unverified'}
          </Badge>
          <Badge className="border-signal/30 bg-signal/15 text-signal hover:bg-signal/20">
            Escrow party
          </Badge>
        </div>
      </div>
    </motion.section>
  )
}

type SettingsPanelProps = {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  tone?: 'default' | 'danger'
}

export function SettingsPanel({
  icon,
  title,
  description,
  children,
  footer,
  className,
  tone = 'default',
}: SettingsPanelProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10',
        tone === 'danger' && 'ring-destructive/25',
        className,
      )}
    >
      <header
        className={cn(
          'flex items-start gap-3 border-b px-5 py-4 sm:px-6',
          tone === 'danger' ? 'border-destructive/15 bg-destructive/5' : 'bg-muted/40',
        )}
      >
        <span
          className={cn(
            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl',
            tone === 'danger'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary',
          )}
        >
          {icon}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2
            className={cn(
              'font-heading text-base font-medium tracking-tight',
              tone === 'danger' && 'text-destructive',
            )}
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
      </header>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      {footer ? (
        <footer className="flex items-center justify-end gap-2 border-t bg-muted/30 px-5 py-3.5 sm:px-6">
          {footer}
        </footer>
      ) : null}
    </section>
  )
}

export function SettingsTabMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}
