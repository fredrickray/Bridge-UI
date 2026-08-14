import { motion, useReducedMotion } from 'motion/react'

import { easeInOut } from '@/components/landing/motion'

type EscrowHeroVisualProps = {
  className?: string
}

/**
 * Full-bleed product metaphor: funds moving through a locked escrow channel.
 * Ambient motion explains the product — not decoration for its own sake.
 */
export function EscrowHeroVisual({ className }: EscrowHeroVisualProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-harbor" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 55% at 70% 40%, oklch(0.42 0.09 180 / 0.55), transparent 70%),
            radial-gradient(ellipse 50% 40% at 15% 80%, oklch(0.5 0.1 85 / 0.22), transparent 65%),
            linear-gradient(180deg, oklch(0.2 0.03 240 / 0.2) 0%, oklch(0.14 0.03 240) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.9 0.02 180 / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.9 0.02 180 / 0.4) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 65% 45%, black, transparent)',
        }}
      />

      {/* Horizon channel */}
      <div className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Escrow corridor */}
      <div className="absolute top-[38%] right-[-5%] left-[35%] h-[28%] min-h-[140px] md:left-[42%]">
        <div className="relative h-full overflow-hidden rounded-l-[2rem] border border-white/10 border-r-0 bg-white/[0.04] backdrop-blur-[2px]">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-signal/25 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-held/20 to-transparent" />

          <div className="absolute top-1/2 left-[8%] size-3 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_20px_oklch(0.72_0.12_170/0.8)]" />
          <div className="absolute top-1/2 right-[12%] size-3 -translate-y-1/2 rounded-full bg-held shadow-[0_0_20px_oklch(0.72_0.12_85/0.7)]" />

          <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-white/15" />

          {!reduceMotion && (
            <motion.div
              className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_oklch(0.98_0.02_180)]"
              initial={{ left: '10%' }}
              animate={{ left: ['10%', '78%', '10%'] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: easeInOut,
                times: [0, 0.52, 1],
              }}
            />
          )}

          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-harbor/90 px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-held" />
            <span className="font-heading text-[11px] tracking-[0.14em] text-harbor-foreground/85 uppercase">
              Escrow locked
            </span>
          </div>

          <div className="absolute bottom-4 left-6 font-heading text-[10px] tracking-[0.16em] text-harbor-foreground/45 uppercase">
            Payer
          </div>
          <div className="absolute right-10 bottom-4 font-heading text-[10px] tracking-[0.16em] text-harbor-foreground/45 uppercase">
            Provider
          </div>
        </div>
      </div>

      {/* Soft floating nodes */}
      {!reduceMotion && (
        <>
          <motion.span
            className="absolute top-[22%] left-[18%] size-2 rounded-full bg-signal/70"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: easeInOut }}
          />
          <motion.span
            className="absolute top-[58%] left-[22%] size-1.5 rounded-full bg-held/80"
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: easeInOut, delay: 0.6 }}
          />
        </>
      )}
    </div>
  )
}
