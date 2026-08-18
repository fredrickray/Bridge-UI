import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { Logo } from '@/components/shared/logo'
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
        <Link to="/" className="text-harbor-foreground">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            href="/login"
            className="text-harbor-foreground/80 hover:bg-white/10 hover:text-harbor-foreground"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            href="/signup"
            className="bg-signal text-harbor hover:bg-signal/90"
          >
            Get started
          </Button>
        </nav>
      </div>
    </motion.header>
  )
}
