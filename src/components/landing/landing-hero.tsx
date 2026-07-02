import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { EscrowHeroVisual } from '@/components/landing/escrow-hero-visual'
import { fadeUp, staggerContainer } from '@/components/landing/motion'
import { Button } from '@/components/ui/button'

export function LandingHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:justify-center lg:pb-28 lg:pt-24">
      <EscrowHeroVisual className="absolute inset-0 -z-10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          className="flex max-w-xl flex-col gap-6 lg:max-w-lg"
          variants={staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="font-serif text-5xl tracking-tight text-harbor-foreground sm:text-6xl lg:text-7xl"
          >
            Relay
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl leading-[1.15] font-medium tracking-tight text-balance text-harbor-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            Hold the money. Unlock the work.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-md text-base leading-relaxed text-pretty text-harbor-foreground/70 sm:text-lg"
          >
            Milestone escrow that keeps payers and providers aligned from invite
            to release.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="lg"
              className="h-11 bg-signal px-5 text-harbor hover:bg-signal/90 active:scale-[0.97]"
              asChild
            >
              <Link to="/signup">
                Start escrow
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/20 bg-transparent px-5 text-harbor-foreground hover:bg-white/10 hover:text-harbor-foreground active:scale-[0.97]"
              asChild
            >
              <Link to="/login">Sign in</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
