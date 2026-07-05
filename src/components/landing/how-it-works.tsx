import { motion, useReducedMotion } from 'motion/react'

import { fadeUp, staggerContainer } from '@/components/landing/motion'

const steps = [
  {
    title: 'Fund',
    body: 'The payer deposits into escrow — entire agreement or per milestone.',
  },
  {
    title: 'Deliver',
    body: 'The provider submits work with the evidence the agreement requires.',
  },
  {
    title: 'Release',
    body: 'After inspection — or when the review window ends — funds unlock.',
  },
]

export function HowItWorks() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          className="flex max-w-2xl flex-col gap-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="font-heading text-xs font-medium tracking-[0.16em] text-primary uppercase"
          >
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl"
          >
            Three steps. Funds stay controlled the whole way.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground text-pretty">
            Bridge turns handshakes into a clear path: deposit, deliver, inspect, release.
          </motion.p>
        </motion.div>

        <motion.ol
          className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {steps.map((step, index) => (
            <motion.li key={step.title} variants={fadeUp} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 font-heading text-sm font-medium text-primary">
                  {index + 1}
                </span>
                <h3 className="font-heading text-xl font-medium tracking-tight">{step.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {step.body}
              </p>
              {index < steps.length - 1 ? (
                <div
                  aria-hidden
                  className="mt-2 hidden h-px w-full bg-gradient-to-r from-primary/40 to-transparent sm:block"
                />
              ) : null}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
