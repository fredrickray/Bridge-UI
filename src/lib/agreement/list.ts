import { format } from 'date-fns'

import { agreementTotal, milestoneTotal } from '@/lib/agreement/draft'
import type { AgreementDraft } from '@/lib/agreement/draft'

export const AGREEMENT_PAGE_SIZE = 12

export const AGREEMENT_STATUSES = [
  'invite_pending',
  'invited',
  'queued',
  'funded',
  'held',
  'released',
] as const

export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number]

export type AgreementSummary = {
  id: string
  name: string
  milestoneCount: number
  currentMilestone: string | null
  totalAmount: number
  currency: string
  status: AgreementStatus
  updatedAt: string
}

export type AgreementsSearch = {
  q?: string
  status?: AgreementStatus
  page?: number
}

export const AGREEMENT_STATUS_LABEL: Record<AgreementStatus, string> = {
  invite_pending: 'Invite pending',
  invited: 'Invited',
  queued: 'Queued',
  funded: 'Funded',
  held: 'Held',
  released: 'Released',
}

export function isAgreementStatus(value: unknown): value is AgreementStatus {
  return (
    typeof value === 'string' &&
    AGREEMENT_STATUSES.some((status) => status === value)
  )
}

export function parseAgreementsSearch(
  search: Record<string, unknown>,
): AgreementsSearch {
  const page = Number(search.page)
  return {
    q:
      typeof search.q === 'string' && search.q.length > 0
        ? search.q
        : undefined,
    status: isAgreementStatus(search.status) ? search.status : undefined,
    page: Number.isInteger(page) && page > 0 ? page : undefined,
  }
}

export function agreementsSearchParams(
  search: AgreementsSearch,
): AgreementsSearch {
  return {
    q: search.q || undefined,
    status: search.status,
    page: search.page && search.page > 1 ? search.page : undefined,
  }
}

export function formatAgreementUpdatedAt(value: string) {
  return format(new Date(value), 'd MMM yyyy')
}

export function summaryFromCreated(agreement: {
  id: string
  draft: AgreementDraft
  createdAt: string
  invitedAt: string | null
}): AgreementSummary {
  const fromMilestones = milestoneTotal(agreement.draft)
  const fromTotal = agreementTotal(agreement.draft)
  return {
    id: agreement.id,
    name: agreement.draft.title || 'Untitled agreement',
    milestoneCount: agreement.draft.milestones.length,
    currentMilestone: currentMilestoneFor(
      agreement.invitedAt ? 'invited' : 'invite_pending',
      agreement.draft.milestones.map((milestone) => milestone.title),
    ),
    totalAmount: fromTotal > 0 ? fromTotal : fromMilestones,
    currency: agreement.draft.currency,
    status: agreement.invitedAt ? 'invited' : 'invite_pending',
    updatedAt: agreement.invitedAt ?? agreement.createdAt,
  }
}

export function filterAgreementSummaries(
  items: readonly AgreementSummary[],
  query: string,
  status?: AgreementStatus,
) {
  const q = query.trim().toLowerCase()
  return items.filter((item) => {
    if (status && item.status !== status) return false
    if (q && !item.name.toLowerCase().includes(q)) return false
    return true
  })
}

export function currentMilestoneFor(
  status: AgreementStatus,
  titles: readonly string[],
) {
  if (status !== 'funded' && status !== 'held') return null
  const named = titles.filter((title) => title.trim().length > 0)
  if (named.length === 0) return null
  const index = status === 'held' ? Math.min(1, named.length - 1) : 0
  return named[index] ?? null
}

export function milestoneLabel(count: number) {
  return count === 1 ? 'milestone' : 'milestones'
}
