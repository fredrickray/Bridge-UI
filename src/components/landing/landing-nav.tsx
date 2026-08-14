import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingNav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 24)
  })

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200',
        scrolled
          ? 'border-b border-white/10 bg-harbor/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-harbor-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg bg-signal/20 ring-1 ring-signal/35">
            <span className="size-2 rounded-full bg-signal" />
          </span>
          <span className="font-serif text-xl tracking-tight">Relay</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-harbor-foreground/80 hover:bg-white/10 hover:text-harbor-foreground"
            asChild
          >
            <Link to="/login">Sign in</Link>
          </Button>
          <Button
            size="sm"
            className="bg-signal text-harbor hover:bg-signal/90"
            asChild
          >
            <Link to="/signup">Get started</Link>
          </Button>
        </nav>
      </div>
    </motion.header>
  )
}
