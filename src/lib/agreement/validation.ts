import { z } from 'zod'

import {
  INVITATION_WINDOWS,
  WIZARD_STEPS,
  agreementTotal,
  isStartDateInTheFuture,
  milestoneTotal,
  stepIsOptional,
} from '@/lib/agreement/draft'
import type {
  AgreementDraft,
  Milestone,
  WizardStepId,
} from '@/lib/agreement/draft'

export type StepIssues = {
  form?: string
  fields: Record<string, string>
}

const requiredText = (message: string) => z.string().trim().min(1, message)

const positiveAmount = requiredText('Enter an amount').refine((value) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0
}, 'Enter an amount greater than 0')

const positiveDays = requiredText('Enter a number of days').refine((value) => {
  const days = Number(value)
  return Number.isInteger(days) && days > 0
}, 'Enter a whole number of days greater than 0')

const optionalPositiveDays = z.string().refine((value) => {
  if (value.trim() === '') return true
  const days = Number(value)
  return Number.isInteger(days) && days > 0
}, 'Enter a whole number of days greater than 0')

const nonNegativeCount = requiredText('Enter a number').refine((value) => {
  const count = Number(value)
  return Number.isInteger(count) && count >= 0
}, 'Enter zero or a whole number')

const roleSchema = z.object({
  role: z.enum(['payer', 'provider'], { error: 'Choose your role' }),
})

const detailsSchema = z
  .object({
    title: requiredText('Enter an agreement title'),
    category: requiredText('Choose a category'),
    description: requiredText('Describe the agreement'),
    counterpartyContact: z.email('Enter a valid email address'),
    currency: requiredText('Choose a currency'),
    totalAmount: positiveAmount,
    invitationWindowDays: z.enum(INVITATION_WINDOWS, {
      error: 'Choose an invitation window',
    }),
    startDate: z.string(),
  })
  .superRefine((value, context) => {
    if (value.startDate && !isStartDateInTheFuture(value.startDate)) {
      context.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Expected start date must be in the future.',
      })
    }
  })

const milestoneSchema = z.object({
  title: requiredText('Enter a title'),
  description: requiredText('Describe this milestone'),
  amount: positiveAmount,
  estimatedDurationValue: requiredText('Enter a duration').refine((value) => {
    const amount = Number(value)
    return Number.isInteger(amount) && amount > 0
  }, 'Enter a whole number greater than 0'),
  deliverables: requiredText('List the expected deliverables'),
  evidenceTypes: z
    .array(z.string())
    .min(1, 'Choose at least one evidence type'),
  evidenceInstructions: requiredText('Add evidence instructions'),
})

const milestonesSchema = z.object({
  milestones: z.array(milestoneSchema).min(1, 'Add at least one milestone'),
})

const fundingSchema = z.object({
  fundingStrategy: z.enum(['entire', 'per_milestone'], {
    error: 'Choose a funding strategy',
  }),
  fundingWindowDays: positiveDays,
  inspectionPeriodDays: positiveDays,
  includedRevisions: nonNegativeCount,
  revisionWindowDays: positiveDays,
})

const termsSchema = z.object({
  reviewPeriodDays: optionalPositiveDays,
  cancellationPolicy: requiredText('Add a cancellation policy'),
  revisionPolicy: requiredText('Add a revision policy'),
})

const emptyIssues: StepIssues = { fields: {} }

function issuesFromZod(
  error: z.ZodError,
  milestones?: Milestone[],
): StepIssues {
  const fields: Record<string, string> = {}
  let form: string | undefined

  for (const issue of error.issues) {
    const path = issue.path
    if (path.length === 0) {
      form ??= issue.message
      continue
    }

    if (path.length === 1 && path[0] === 'milestones') {
      form ??= issue.message
      continue
    }

    if (
      milestones &&
      path[0] === 'milestones' &&
      typeof path[1] === 'number' &&
      path[2]
    ) {
      const milestone = milestones[path[1]]
      const key = `milestones.${milestone.id}.${String(path[2])}`
      fields[key] ??= issue.message
      continue
    }

    const key = path.map(String).join('.')
    fields[key] ??= issue.message
  }

  return { form, fields }
}

export function stepIssues(
  step: WizardStepId,
  draft: AgreementDraft,
): StepIssues {
  switch (step) {
    case 'role': {
      const result = roleSchema.safeParse({ role: draft.role })
      return result.success ? emptyIssues : issuesFromZod(result.error)
    }
    case 'details': {
      const result = detailsSchema.safeParse(draft)
      return result.success ? emptyIssues : issuesFromZod(result.error)
    }
    case 'milestones': {
      const result = milestonesSchema.safeParse({
        milestones: draft.milestones,
      })
      const issues = result.success
        ? { fields: {} }
        : issuesFromZod(result.error, draft.milestones)
      const total = agreementTotal(draft)
      const allocated = milestoneTotal(draft)
      if (total > 0 && allocated > 0 && allocated !== total) {
        issues.fields.allocated =
          'Milestone amounts should add up to the agreement total.'
      }
      return issues
    }
    case 'funding': {
      const result = fundingSchema.safeParse(draft)
      return result.success ? emptyIssues : issuesFromZod(result.error)
    }
    case 'terms': {
      const result = termsSchema.safeParse(draft)
      return result.success ? emptyIssues : issuesFromZod(result.error)
    }
    case 'documents':
    case 'review':
      return emptyIssues
  }
}

function hasIssues(issues: StepIssues) {
  return Boolean(issues.form) || Object.keys(issues.fields).length > 0
}

const REQUIRED_STEP_IDS = [
  'role',
  'details',
  'milestones',
  'funding',
  'terms',
] as const satisfies readonly WizardStepId[]

export function areRequiredStepsComplete(draft: AgreementDraft) {
  return REQUIRED_STEP_IDS.every((step) => !hasIssues(stepIssues(step, draft)))
}

export function canLeaveStep(step: WizardStepId, draft: AgreementDraft) {
  if (step === 'documents') return true
  if (step === 'review') return areRequiredStepsComplete(draft)
  return !hasIssues(stepIssues(step, draft))
}

export function isStepComplete(
  step: WizardStepId,
  draft: AgreementDraft,
): boolean {
  if (step === 'documents') return true
  if (step === 'review') return areRequiredStepsComplete(draft)
  return !hasIssues(stepIssues(step, draft))
}

export function isStepChecked(
  step: WizardStepId,
  draft: AgreementDraft,
  passed: Partial<Record<WizardStepId, boolean>>,
) {
  return Boolean(passed[step]) && isStepComplete(step, draft)
}

export function canEnterStep(index: number, draft: AgreementDraft) {
  return WIZARD_STEPS.slice(0, index).every(
    (step) => stepIsOptional(step) || canLeaveStep(step.id, draft),
  )
}

export function fieldIssue(
  issues: StepIssues,
  key: string,
): string | undefined {
  return issues.fields[key]
}
