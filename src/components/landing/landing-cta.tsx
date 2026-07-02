import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { fadeUp, staggerContainer } from '@/components/landing/motion'
import { Button } from '@/components/ui/button'

export function LandingCta() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="border-t border-border bg-background py-20 sm:py-28">
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 text-center sm:px-8"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl"
        >
          Ready to put the next agreement in escrow?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-md text-base text-muted-foreground text-pretty"
        >
          Create an account, invite the other party, and fund when both sides agree.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="h-11 px-5 active:scale-[0.97]"
            asChild
          >
            <Link to="/signup">
              Create account
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-5 active:scale-[0.97]"
            asChild
          >
            <Link to="/login">Sign in</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
