import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { AuthBrandPanel } from '@/components/auth/auth-brand-panel'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden lg:block">
        <AuthBrandPanel />
      </aside>

      <main className="relative flex flex-col justify-center px-5 py-10 sm:px-8 md:px-12">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <Link to="/login" className="font-serif text-xl text-foreground">
            Relay
          </Link>
        </div>

        <motion.div
          className="mx-auto w-full max-w-[400px]"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-[1.75rem]">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
          </div>

          {children}

          {footer ? <div className="mt-8">{footer}</div> : null}
        </motion.div>
      </main>
    </div>
  )
}
