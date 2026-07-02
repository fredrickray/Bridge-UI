import { motion, useReducedMotion } from 'motion/react'

import { fadeUp, scaleIn, staggerContainer } from '@/components/landing/motion'

const points = [
  {
    title: 'Milestone-native',
    body: 'Break work into payable units with deliverables, evidence, and deadlines.',
  },
  {
    title: 'Inspection windows',
    body: 'Review before release — or let funds move automatically when time is up.',
  },
  {
    title: 'Disputes when needed',
    body: 'Pause progression, attach evidence, and resolve without leaving the agreement.',
  },
]

export function TrustSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-harbor py-20 text-harbor-foreground sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 10% 20%, oklch(0.45 0.08 180 / 0.4), transparent),
            radial-gradient(ellipse 50% 40% at 90% 80%, oklch(0.55 0.1 85 / 0.2), transparent)
          `,
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <motion.div
          className="flex flex-col gap-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="font-heading text-xs font-medium tracking-[0.16em] text-signal uppercase"
          >
            Built for real agreements
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl"
          >
            Escrow that matches how work actually gets done.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-lg text-base leading-relaxed text-harbor-foreground/65 text-pretty"
          >
            Not a generic payment hold — a workspace for funding, evidence, revisions,
            and release.
          </motion.p>

          <motion.ul variants={staggerContainer} className="mt-4 flex flex-col gap-6">
            {points.map((point) => (
              <motion.li key={point.title} variants={fadeUp} className="flex flex-col gap-1.5">
                <h3 className="font-heading text-lg font-medium">{point.title}</h3>
                <p className="text-sm leading-relaxed text-harbor-foreground/60">{point.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative min-h-[280px] lg:min-h-[360px]"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={scaleIn}
        >
          <div className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm text-harbor-foreground/80">
                  Website redesign
                </span>
                <span className="rounded-md bg-signal/15 px-2 py-1 font-heading text-[10px] tracking-wider text-signal uppercase">
                  Active
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { name: 'Discovery', status: 'Released', tone: 'signal' },
                  { name: 'UI system', status: 'Under review', tone: 'held' },
                  { name: 'Build & launch', status: 'Awaiting funding', tone: 'muted' },
                ].map((m, i) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between gap-3 border-b border-white/8 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-xs text-harbor-foreground/40">
                        0{i + 1}
                      </span>
                      <span className="text-sm">{m.name}</span>
                    </div>
                    <span
                      className={
                        m.tone === 'signal'
                          ? 'text-xs text-signal'
                          : m.tone === 'held'
                            ? 'text-xs text-held'
                            : 'text-xs text-harbor-foreground/45'
                      }
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-signal to-held"
                  initial={{ width: reduceMotion ? '42%' : '0%' }}
                  whileInView={{ width: '42%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                />
              </div>
              <p className="text-xs text-harbor-foreground/45">$4,200 of $10,000 released</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
