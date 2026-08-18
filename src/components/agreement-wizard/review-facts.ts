import type {
  AgreementDocument,
  AgreementDraft,
  Milestone,
} from '@/lib/agreement/draft'
import {
  counterpartyRole,
  documentKindLabel,
  effectiveReviewDays,
  evidenceLabel,
  formatEstimatedDuration,
  formatMoney,
} from '@/lib/agreement/draft'

export type ReviewFacts = {
  title: string
  category: string | null
  description: string | null
  amount: string | null
  currency: string
  role: AgreementDraft['role']
  other: ReturnType<typeof counterpartyRole>
  parties: { payer: string; provider: string }
  funding: string
  fundingWindow: string | null
  inspection: string | null
  revisions: string | null
  revisionWindow: string | null
  inviteWindow: string | null
  cancellation: string | null
  revisionPolicy: string | null
  lateDelivery: string | null
  additionalTerms: string | null
  milestones: Milestone[]
  documents: AgreementDocument[]
  chips: string[]
}

export function reviewFacts(draft: AgreementDraft): ReviewFacts {
  const waiting = draft.counterpartyContact || 'Awaiting contact'
  const chips = [
    `${draft.milestones.length} ${draft.milestones.length === 1 ? 'milestone' : 'milestones'}`,
    draft.fundingStrategy === 'entire'
      ? 'Fund entire agreement'
      : 'Fund per milestone',
    effectiveReviewDays(draft)
      ? `${effectiveReviewDays(draft)}-day inspection`
      : null,
  ].filter((chip): chip is string => Boolean(chip))

  return {
    title: draft.title || 'Untitled agreement',
    category: draft.category || null,
    description: draft.description || null,
    amount: draft.totalAmount
      ? formatMoney(draft.totalAmount, draft.currency)
      : null,
    currency: draft.currency,
    role: draft.role,
    other: counterpartyRole(draft.role),
    parties: {
      payer:
        draft.role === 'payer'
          ? 'You'
          : draft.role === 'provider'
            ? waiting
            : '—',
      provider:
        draft.role === 'provider'
          ? 'You'
          : draft.role === 'payer'
            ? waiting
            : '—',
    },
    funding:
      draft.fundingStrategy === 'entire'
        ? 'Fund entire agreement'
        : 'Fund per milestone',
    fundingWindow: draft.fundingWindowDays
      ? `${draft.fundingWindowDays} days`
      : null,
    inspection: effectiveReviewDays(draft)
      ? `${effectiveReviewDays(draft)} days`
      : null,
    revisions: draft.includedRevisions
      ? `${draft.includedRevisions} per milestone`
      : null,
    revisionWindow: draft.revisionWindowDays
      ? `${draft.revisionWindowDays} days`
      : null,
    inviteWindow: draft.invitationWindowDays
      ? `${draft.invitationWindowDays} days`
      : null,
    cancellation: draft.cancellationPolicy || null,
    revisionPolicy: draft.revisionPolicy || null,
    lateDelivery: draft.lateDelivery || null,
    additionalTerms: draft.additionalTerms || null,
    milestones: draft.milestones,
    documents: draft.documents,
    chips,
  }
}

export function termRows(facts: ReviewFacts) {
  return [
    ['Funding', facts.funding],
    ['Funding window', facts.fundingWindow],
    ['Inspection', facts.inspection],
    ['Included revisions', facts.revisions],
    ['Revision window', facts.revisionWindow],
    ['Cancellation', facts.cancellation],
    ['Revision policy', facts.revisionPolicy],
    ['Late delivery', facts.lateDelivery],
    ['Additional terms', facts.additionalTerms],
    ['Invite window', facts.inviteWindow],
  ].filter((row): row is [string, string] => Boolean(row[1]))
}

export function milestoneAside(milestone: Milestone) {
  const duration = formatEstimatedDuration(
    milestone.estimatedDurationValue,
    milestone.estimatedDurationUnit,
  )
  const evidence =
    milestone.evidenceTypes.length > 0
      ? milestone.evidenceTypes.map(evidenceLabel).join(', ')
      : null
  return [duration, evidence].filter(Boolean).join(' · ')
}

export { documentKindLabel, formatMoney }
