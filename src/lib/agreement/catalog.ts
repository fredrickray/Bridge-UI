import { currentMilestoneFor } from '@/lib/agreement/list'
import type { AgreementStatus, AgreementSummary } from '@/lib/agreement/list'

export type CatalogAgreement = AgreementSummary & {
  payer: string
  provider: string
}

const PAYERS = [
  'Acme',
  'Harbor Roofing',
  'Kin & Co.',
  'Lumen Freight',
  'Oak & Copper',
  'Paget Labs',
  'Quayline',
  'Redgrove',
  'Salt & Timber',
  'Thornfield',
  'Umbra Legal',
  'Vesper Goods',
  'Wren & Hale',
  'Yarrow Press',
  'Zephyr Clinics',
  'Ashford Mutual',
  'Bramble Estates',
  'Cedar & Pine',
  'Driftwood Hotels',
  'Elm Court',
  'Fable Audio',
  'Glasshouse',
  'Hearthstone',
  'Ivory Coast Co.',
  'Juniper Bank',
] as const

const PROVIDERS = [
  'North Studio',
  'Atlas Build',
  'Beacon Design',
  'Cobalt Works',
  'Dune Agency',
  'Echo Systems',
  'Fieldwork',
  'Grain Architects',
  'Halo Motion',
  'Indigo Craft',
  'Jasper Supply',
  'Kite Digital',
  'Lark Interiors',
  'Marrow Studio',
  'Nimbus Ops',
  'Orchard Media',
  'Pike Engineering',
  'Quartz Labs',
  'Ridge & Co.',
  'Sable Films',
] as const

const CATALOG_STATUSES: AgreementStatus[] = [
  'queued',
  'funded',
  'held',
  'released',
]

const MILESTONE_NAMES = [
  'Discovery',
  'Design system',
  'Build',
  'QA & launch',
  'Handover',
  'Retainer month',
]

function daysAgoIso(days: number) {
  const date = new Date()
  date.setHours(9, 30, 0, 0)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const featured: CatalogAgreement[] = [
  {
    id: 'acme-north-studio',
    name: 'Acme × North Studio',
    milestoneCount: 4,
    currentMilestone: currentMilestoneFor('held', MILESTONE_NAMES.slice(0, 4)),
    totalAmount: 24800,
    currency: 'GBP',
    status: 'held',
    updatedAt: daysAgoIso(1),
    payer: 'Acme',
    provider: 'North Studio',
  },
  {
    id: 'harbor-roofing',
    name: 'Harbor Roofing',
    milestoneCount: 3,
    currentMilestone: currentMilestoneFor(
      'funded',
      MILESTONE_NAMES.slice(0, 3),
    ),
    totalAmount: 8400,
    currency: 'GBP',
    status: 'funded',
    updatedAt: daysAgoIso(3),
    payer: 'Harbor Roofing',
    provider: 'Atlas Build',
  },
  {
    id: 'kin-co-retainers',
    name: 'Kin & Co. retainers',
    milestoneCount: 2,
    currentMilestone: currentMilestoneFor(
      'released',
      MILESTONE_NAMES.slice(0, 2),
    ),
    totalAmount: 3200,
    currency: 'GBP',
    status: 'released',
    updatedAt: daysAgoIso(9),
    payer: 'Kin & Co.',
    provider: 'Beacon Design',
  },
]

function extraAgreements(count: number): CatalogAgreement[] {
  return Array.from({ length: count }, (_, n) => {
    const index = n + 1
    const payer = PAYERS[index % PAYERS.length]
    const provider =
      PROVIDERS[Math.floor(index / PAYERS.length) % PROVIDERS.length]
    const milestoneCount = 1 + (index % 6)
    const status = CATALOG_STATUSES[index % CATALOG_STATUSES.length]
    return {
      id: `agr-${String(index).padStart(3, '0')}`,
      name: `${payer} × ${provider}`,
      milestoneCount,
      currentMilestone: currentMilestoneFor(
        status,
        MILESTONE_NAMES.slice(0, milestoneCount),
      ),
      totalAmount: 1800 + ((index * 1373) % 48200),
      currency: 'GBP',
      status,
      updatedAt: daysAgoIso(2 + (index % 45)),
      payer,
      provider,
    }
  })
}

export const CATALOG_AGREEMENTS: CatalogAgreement[] = [
  ...featured,
  ...extraAgreements(45),
]

const catalogById = new Map(
  CATALOG_AGREEMENTS.map((agreement) => [agreement.id, agreement]),
)

export function getCatalogAgreement(id: string) {
  return catalogById.get(id)
}

export function catalogMilestoneRows(agreement: CatalogAgreement) {
  const count = agreement.milestoneCount
  const share = count > 0 ? agreement.totalAmount / count : 0
  return Array.from({ length: count }, (_, index) => ({
    title: MILESTONE_NAMES[index % MILESTONE_NAMES.length],
    amount: share,
  }))
}
