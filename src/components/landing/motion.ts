import type { Transition, Variants } from 'motion/react'

/** Strong ease-out — entrances feel immediate */
export const easeOut = [0.23, 1, 0.32, 1] as const

/** Strong ease-in-out — on-screen movement */
export const easeInOut = [0.77, 0, 0.175, 1] as const

export const revealTransition: Transition = {
  duration: 0.55,
  ease: easeOut,
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
}
