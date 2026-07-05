import { motion, useReducedMotion } from 'motion/react'

const steps = [
  { label: 'Fund', detail: 'Payer deposits into escrow' },
  { label: 'Deliver', detail: 'Provider completes the milestone' },
  { label: 'Release', detail: 'Funds move after inspection' },
]

export function AuthBrandPanel() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative flex h-full min-h-[320px] flex-col overflow-hidden bg-harbor text-harbor-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% 20%, oklch(0.45 0.08 180 / 0.45), transparent),
            radial-gradient(ellipse 60% 40% at 90% 80%, oklch(0.55 0.1 85 / 0.25), transparent),
            linear-gradient(180deg, transparent 0%, oklch(0.16 0.03 240 / 0.6) 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.9 0.02 180 / 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.9 0.02 180 / 0.35) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-10 lg:p-12">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-signal/20 ring-1 ring-signal/40">
            <span className="size-2.5 rounded-full bg-signal shadow-[0_0_12px_oklch(0.72_0.12_170)]" />
          </span>
          <span className="font-serif text-2xl tracking-tight">Bridge</span>
        </div>

        <div className="flex max-w-md flex-col gap-8 py-10">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-wide text-signal uppercase">
              Escrow as a service
            </p>
            <h1 className="font-heading text-3xl leading-tight font-medium tracking-tight text-balance md:text-4xl lg:text-[2.75rem]">
              Hold the money. Unlock the work.
            </h1>
            <p className="text-base leading-relaxed text-harbor-foreground/70 text-pretty">
              Milestone escrow that keeps payers and providers aligned from invite
              to release.
            </p>
          </div>

          <EscrowChannel reduceMotion={!!reduceMotion} />

          <ol className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <li key={step.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/8 font-heading text-xs text-signal">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-heading text-sm font-medium">{step.label}</span>
                  <span className="text-sm text-harbor-foreground/60">{step.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-harbor-foreground/45">
          Funds stay locked until milestones clear inspection — or disputes resolve.
        </p>
      </div>
    </div>
  )
}

function EscrowChannel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between text-xs tracking-wide text-harbor-foreground/55 uppercase">
        <span>Payer</span>
        <span className="text-held">In escrow</span>
        <span>Provider</span>
      </div>
      <div className="relative h-12 overflow-hidden rounded-lg bg-harbor/60">
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-signal/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-held/25 to-transparent" />
        <div className="absolute top-1/2 left-[18%] size-2.5 -translate-y-1/2 rounded-full bg-signal" />
        <div className="absolute top-1/2 right-[18%] size-2.5 -translate-y-1/2 rounded-full bg-held" />
        <div className="absolute inset-x-[22%] top-1/2 h-px -translate-y-1/2 bg-white/20" />
        {!reduceMotion && (
          <motion.div
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_oklch(0.95_0.02_180)]"
            initial={{ left: '20%' }}
            animate={{ left: ['20%', '72%', '20%'] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.55, 1],
            }}
          />
        )}
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/15 bg-harbor px-2 py-1">
          <span className="size-1.5 rounded-full bg-held" />
          <span className="font-heading text-[10px] tracking-wider text-harbor-foreground/80 uppercase">
            Locked
          </span>
        </div>
      </div>
    </div>
  )
}
