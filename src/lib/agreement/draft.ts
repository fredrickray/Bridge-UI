export type PartyRole = 'payer' | 'provider'
export type FundingStrategy = 'entire' | 'per_milestone'

export type EvidenceType =
  'files' | 'links' | 'photos' | 'videos' | 'tracking' | 'other'

export type DurationUnit = 'days' | 'weeks' | 'months' | 'years'

export type DocumentKind =
  'contract' | 'sow' | 'purchase_order' | 'nda' | 'specification' | 'other'

export type WizardStepId =
  | 'role'
  | 'details'
  | 'milestones'
  | 'funding'
  | 'terms'
  | 'documents'
  | 'review'

export type Milestone = {
  id: string
  title: string
  description: string
  amount: string
  estimatedDurationValue: string
  estimatedDurationUnit: DurationUnit
  deliverables: string
  completionNotes: string
  evidenceTypes: EvidenceType[]
  evidenceInstructions: string
}

export type AgreementDocument = {
  id: string
  kind: DocumentKind
  name: string
  description: string
}

export type AgreementDraft = {
  role: PartyRole | null
  title: string
  category: string
  description: string
  counterpartyContact: string
  currency: string
  totalAmount: string
  startDate: string
  invitationWindowDays: string
  milestones: Milestone[]
  fundingStrategy: FundingStrategy
  fundingWindowDays: string
  inspectionPeriodDays: string
  includedRevisions: string
  revisionWindowDays: string
  reviewPeriodDays: string
  cancellationPolicy: string
  revisionPolicy: string
  lateDelivery: string
  additionalTerms: string
  documents: AgreementDocument[]
}

export const WIZARD_STEPS = [
  {
    id: 'role',
    label: 'Your Role',
    short: 'Role',
    goal: 'Define your role in the agreement.',
  },
  {
    id: 'details',
    label: 'General Details',
    short: 'Details',
    goal: 'Define the agreement at a high level.',
  },
  {
    id: 'milestones',
    label: 'Milestones',
    short: 'Milestones',
    goal: 'Break the work into independently reviewable and payable units.',
  },
  {
    id: 'funding',
    label: 'Funding & Release',
    short: 'Funding',
    goal: 'Define how funds are held and released through the lifecycle.',
  },
  {
    id: 'terms',
    label: 'Terms',
    short: 'Terms',
    goal: 'Define how the agreement should be managed after work begins.',
  },
  {
    id: 'documents',
    label: 'Agreement Documents',
    short: 'Documents',
    goal: 'Attach documents that govern or support the agreement.',
    optional: true,
  },
  {
    id: 'review',
    label: 'Review',
    short: 'Review',
    goal: 'See the agreement exactly as the recipient will see it.',
  },
] as const

export const CATEGORIES = [
  'Software development',
  'Design',
  'Construction',
  'Consulting',
  'Marketing',
  'Goods & materials',
  'Professional services',
  'Other',
] as const

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'NGN',
  'CAD',
  'KES',
  'ZAR',
] as const

export const INVITATION_WINDOWS = ['3', '7', '14', '30'] as const

export const DURATION_UNITS: { id: DurationUnit; label: string }[] = [
  { id: 'days', label: 'Days' },
  { id: 'weeks', label: 'Weeks' },
  { id: 'months', label: 'Months' },
  { id: 'years', label: 'Years' },
]

export const EVIDENCE_TYPES: { id: EvidenceType; label: string }[] = [
  { id: 'files', label: 'Files' },
  { id: 'links', label: 'Links' },
  { id: 'photos', label: 'Photos' },
  { id: 'videos', label: 'Videos' },
  { id: 'tracking', label: 'Tracking number' },
  { id: 'other', label: 'Other' },
]

export const DOCUMENT_KINDS: { id: DocumentKind; label: string }[] = [
  { id: 'contract', label: 'Contract' },
  { id: 'sow', label: 'Statement of Work' },
  { id: 'purchase_order', label: 'Purchase Order' },
  { id: 'nda', label: 'NDA' },
  { id: 'specification', label: 'Specification' },
  { id: 'other', label: 'Other' },
]

export function createMilestone(): Milestone {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    amount: '',
    estimatedDurationValue: '',
    estimatedDurationUnit: 'weeks',
    deliverables: '',
    completionNotes: '',
    evidenceTypes: [],
    evidenceInstructions: '',
  }
}

export function createEmptyDraft(): AgreementDraft {
  return {
    role: null,
    title: '',
    category: '',
    description: '',
    counterpartyContact: '',
    currency: 'USD',
    totalAmount: '',
    startDate: '',
    invitationWindowDays: '7',
    milestones: [],
    fundingStrategy: 'entire',
    fundingWindowDays: '7',
    inspectionPeriodDays: '5',
    includedRevisions: '2',
    revisionWindowDays: '7',
    reviewPeriodDays: '',
    cancellationPolicy: '',
    revisionPolicy: '',
    lateDelivery: '',
    additionalTerms: '',
    documents: [],
  }
}

export function createSampleDraft(): AgreementDraft {
  return {
    role: 'payer',
    title: 'Brand site rebuild',
    category: 'Software development',
    description:
      'Redesign and rebuild the marketing site with a new design system, CMS, and launch QA.',
    counterpartyContact: 'ada@studio.example',
    currency: 'USD',
    totalAmount: '18000',
    startDate: daysFromToday(7),
    invitationWindowDays: '7',
    milestones: [
      {
        id: crypto.randomUUID(),
        title: 'Discovery & IA',
        description:
          'Audit the current site, interview stakeholders, and lock information architecture.',
        amount: '4000',
        estimatedDurationValue: '2',
        estimatedDurationUnit: 'weeks',
        deliverables: 'IA map, content inventory, and kickoff notes',
        completionNotes: 'Include a 45-minute walkthrough.',
        evidenceTypes: ['files', 'links'],
        evidenceInstructions:
          'Share the IA board link and a PDF of the inventory.',
      },
      {
        id: crypto.randomUUID(),
        title: 'Visual system & templates',
        description:
          'Design the system and apply it to home, work, and article templates.',
        amount: '7000',
        estimatedDurationValue: '3',
        estimatedDurationUnit: 'weeks',
        deliverables: 'Figma library and three key templates',
        completionNotes: '',
        evidenceTypes: ['files', 'links'],
        evidenceInstructions:
          'Figma link with view access and a PDF of the cover screens.',
      },
      {
        id: crypto.randomUUID(),
        title: 'Build & launch',
        description:
          'Implement templates, CMS wiring, redirects, and launch checklist.',
        amount: '7000',
        estimatedDurationValue: '4',
        estimatedDurationUnit: 'weeks',
        deliverables: 'Staging URL, launch checklist, and CMS training notes',
        completionNotes: '',
        evidenceTypes: ['links', 'files'],
        evidenceInstructions: 'Staging URL plus a short loom of the CMS flow.',
      },
    ],
    fundingStrategy: 'per_milestone',
    fundingWindowDays: '5',
    inspectionPeriodDays: '5',
    includedRevisions: '2',
    revisionWindowDays: '7',
    reviewPeriodDays: '5',
    cancellationPolicy:
      'Either party may cancel before the next milestone is funded. Completed milestones stay paid.',
    revisionPolicy:
      'Two revision rounds per milestone. Further changes require a new milestone or a dispute.',
    lateDelivery:
      'If a milestone slips more than 5 business days, the payer may pause the next funding request.',
    additionalTerms:
      'The provider retains unused design exploration. The payer owns final delivered assets.',
    documents: [
      {
        id: crypto.randomUUID(),
        kind: 'sow',
        name: 'SOW-brand-site.pdf',
        description: 'Scope and out-of-scope for the rebuild',
      },
    ],
  }
}

export function counterpartyRole(role: PartyRole | null): PartyRole | null {
  if (role === 'payer') return 'provider'
  if (role === 'provider') return 'payer'
  return null
}

export function roleLabel(role: PartyRole | null) {
  if (role === 'payer') return 'Payer'
  if (role === 'provider') return 'Provider'
  return 'Unassigned'
}

export function documentKindLabel(kind: DocumentKind) {
  return DOCUMENT_KINDS.find((item) => item.id === kind)?.label ?? kind
}

export function evidenceLabel(type: EvidenceType) {
  return EVIDENCE_TYPES.find((item) => item.id === type)?.label ?? type
}

export function formatEstimatedDuration(value: string, unit: DurationUnit) {
  const amount = Number(value)
  if (!value || !Number.isFinite(amount) || amount <= 0) return ''
  const labels: Record<DurationUnit, [string, string]> = {
    days: ['day', 'days'],
    weeks: ['week', 'weeks'],
    months: ['month', 'months'],
    years: ['year', 'years'],
  }
  const [singular, plural] = labels[unit]
  return `${amount} ${amount === 1 ? singular : plural}`
}

export function milestoneTotal(draft: AgreementDraft) {
  return draft.milestones.reduce((sum, milestone) => {
    const amount = Number(milestone.amount)
    return sum + (Number.isFinite(amount) ? amount : 0)
  }, 0)
}

export function agreementTotal(draft: AgreementDraft) {
  const amount = Number(draft.totalAmount)
  return Number.isFinite(amount) ? amount : 0
}

export function currencySymbol(currency: string) {
  try {
    const part = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find((item) => item.type === 'currency')
    return part?.value ?? currency
  } catch {
    return currency
  }
}

export function formatMoney(amount: number | string, currency: string) {
  const value = typeof amount === 'string' ? Number(amount) : amount
  if (!Number.isFinite(value)) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currencySymbol(currency)} ${value.toLocaleString()}`
  }
}

export function effectiveReviewDays(draft: AgreementDraft) {
  return draft.reviewPeriodDays || draft.inspectionPeriodDays
}

export function stepIsOptional(step: { id: string; optional?: boolean }) {
  return step.optional === true
}

export function earliestStartDate() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  return date
}

function toIsoDate(date: Date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function daysFromToday(days: number) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

export function isStartDateInTheFuture(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return value >= toIsoDate(earliestStartDate())
}
