import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react'

import { fadeUp } from '@/components/landing/motion'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { WIZARD_STEPS, stepIsOptional } from '@/lib/agreement/draft'
import type { AgreementDraft, WizardStepId } from '@/lib/agreement/draft'
import {
  canEnterStep,
  canLeaveStep,
  isStepChecked,
} from '@/lib/agreement/validation'
import { cn } from '@/lib/utils'

export function useWizardPager(draft: AgreementDraft) {
  const [index, setIndex] = useState(0)
  const [attempted, setAttempted] = useState<
    Partial<Record<WizardStepId, boolean>>
  >({})
  const [passed, setPassed] = useState<Partial<Record<WizardStepId, boolean>>>(
    {},
  )
  const step = WIZARD_STEPS[index]
  const lastIndex = WIZARD_STEPS.length - 1

  function markAttempted() {
    setAttempted((current) => ({ ...current, [step.id]: true }))
  }

  function markPassed() {
    setPassed((current) => ({ ...current, [step.id]: true }))
  }

  function goNext(): 'blocked' | 'advanced' | 'finished' {
    if (!canLeaveStep(step.id, draft)) {
      markAttempted()
      return 'blocked'
    }
    markPassed()
    if (index === lastIndex) return 'finished'
    setIndex((current) => Math.min(current + 1, lastIndex))
    return 'advanced'
  }

  function goBack() {
    setIndex((current) => Math.max(current - 1, 0))
  }

  function selectIndex(next: number) {
    if (next === index) return
    if (next < index) {
      setIndex(next)
      return
    }
    if (!canLeaveStep(step.id, draft)) {
      markAttempted()
      return
    }
    markPassed()
    if (!canEnterStep(next, draft)) return
    setIndex(next)
  }

  return {
    index,
    step,
    passed,
    setIndex: selectIndex,
    goNext,
    goBack,
    showErrors: Boolean(attempted[step.id]),
  }
}

export function WizardShell({
  rail,
  header,
  headerClassName,
  footer,
  stepKey,
  children,
}: {
  rail?: ReactNode
  header?: ReactNode
  headerClassName?: string
  footer: ReactNode
  stepKey: string
  children: ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = 0
  }, [stepKey])

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {rail}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header ? (
          <div
            className={cn(
              'shrink-0 overflow-x-auto border-b px-4 py-4 sm:px-6',
              headerClassName,
            )}
          >
            {header}
          </div>
        ) : null}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
        >
          <StepEnter stepKey={stepKey}>{children}</StepEnter>
        </div>
        <div className="shrink-0 border-t bg-background px-4 py-3 sm:px-6">
          {footer}
        </div>
      </div>
    </div>
  )
}

export function WizardFooter({
  index,
  onBack,
  onNext,
  onPrefill,
  showHint = false,
  pending = false,
}: {
  index: number
  onBack: () => void
  onNext: () => void
  onPrefill?: () => void
  showHint?: boolean
  pending?: boolean
}) {
  const isLast = index === WIZARD_STEPS.length - 1

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex items-center gap-2 justify-self-start">
        <Button
          type="button"
          variant="ghost"
          disabled={index === 0 || pending}
          onClick={onBack}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back
        </Button>
        {onPrefill ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={onPrefill}
          >
            Prefill (temp)
          </Button>
        ) : null}
      </div>
      <p className="text-center text-xs text-destructive">
        {showHint ? 'Fill in the required fields to continue.' : null}
      </p>
      <Button
        type="button"
        onClick={onNext}
        disabled={pending}
        className="justify-self-end"
      >
        {pending ? <Spinner data-icon="inline-start" /> : null}
        {isLast ? 'Create agreement' : 'Continue'}
        {isLast || pending ? null : <ArrowRightIcon data-icon="inline-end" />}
      </Button>
    </div>
  )
}

export function LinkedStepHeader({
  currentIndex,
  draft,
  passed,
  onSelect,
}: {
  currentIndex: number
  draft: AgreementDraft
  passed: Partial<Record<WizardStepId, boolean>>
  onSelect: (index: number) => void
}) {
  const lastIndex = WIZARD_STEPS.length - 1

  return (
    <ol className="flex min-w-max items-start sm:min-w-0">
      {WIZARD_STEPS.map((step, index) => {
        const complete = isStepChecked(step.id, draft, passed)
        const current = index === currentIndex
        const last = index === lastIndex
        return (
          <li
            key={step.id}
            className={cn(
              'flex items-start',
              last ? 'shrink-0' : 'min-w-0 flex-1',
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={current ? 'step' : undefined}
              className="flex w-14 shrink-0 cursor-pointer flex-col items-center gap-1 sm:w-16"
            >
              <StepMark complete={complete} current={current} index={index} />
              <span
                className={cn(
                  'w-full truncate text-center text-[11px]',
                  current
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {step.short}
              </span>
            </button>
            {last ? null : (
              <div
                aria-hidden
                className={cn(
                  'mt-2.5 h-px min-w-3 flex-1',
                  index < currentIndex ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function WizardStepRail({
  currentIndex,
  draft,
  passed,
  onSelect,
}: {
  currentIndex: number
  draft: AgreementDraft
  passed: Partial<Record<WizardStepId, boolean>>
  onSelect: (index: number) => void
}) {
  const lastIndex = WIZARD_STEPS.length - 1

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col overflow-y-auto bg-wizard-rail text-wizard-rail-foreground lg:flex">
      <div className="flex flex-col gap-1 px-5 py-6">
        <p className="font-serif text-xl">New agreement</p>
        <p className="text-xs text-muted-foreground">
          One step at a time. Completed steps keep their check.
        </p>
      </div>
      <nav
        className="flex flex-1 flex-col px-4 pb-6"
        aria-label="Agreement steps"
      >
        {WIZARD_STEPS.map((step, index) => {
          const complete = isStepChecked(step.id, draft, passed)
          const current = index === currentIndex
          const optional = stepIsOptional(step)
          return (
            <div key={step.id} className="flex min-h-15 items-start gap-3">
              <div className="flex w-5 shrink-0 flex-col items-center self-stretch">
                <StepMark
                  complete={complete}
                  current={current}
                  index={index}
                  surface="mist"
                />
                {index < lastIndex ? (
                  <div
                    className={cn(
                      'w-px flex-1',
                      index < currentIndex ? 'bg-primary' : 'bg-border',
                    )}
                  />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'min-w-0 flex-1 cursor-pointer text-left text-sm leading-5 transition-colors',
                  current
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="block text-pretty">
                  {optional ? `${step.label} (Optional)` : step.label}
                </span>
              </button>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function StepMark({
  complete,
  current,
  index,
  surface = 'page',
}: {
  complete: boolean
  current: boolean
  index: number
  surface?: 'page' | 'mist'
}) {
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full font-heading text-[10px] [&_svg]:size-2.5',
        complete || current
          ? 'bg-primary text-primary-foreground'
          : 'bg-primary/20 text-foreground',
        current && 'ring-2 ring-ring ring-offset-2',
        current && surface === 'page' && 'ring-offset-background',
        current && surface === 'mist' && 'ring-offset-wizard-rail',
      )}
    >
      {complete ? <CheckIcon /> : index + 1}
    </span>
  )
}

function StepEnter({
  stepKey,
  children,
}: {
  stepKey: WizardStepId | string
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        className="mx-auto w-full max-w-2xl"
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        exit={
          reduceMotion
            ? undefined
            : { opacity: 0, y: -12, transition: { duration: 0.2 } }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
