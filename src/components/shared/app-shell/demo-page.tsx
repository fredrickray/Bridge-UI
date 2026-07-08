import { useParams } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { isPageSlug, PAGE_INTRO } from '@/components/shared/app-shell/nav'
import type { PageSlug } from '@/components/shared/app-shell/nav'

const AGREEMENT_STATUSES = ['Held', 'Funded', 'Released', 'Queued'] as const

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
]

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
]

function formatAmount(index: number) {
  const amount = 1800 + ((index * 1373) % 48200)
  return `£${amount.toLocaleString('en-GB')}`
}

function extraAgreements(count: number) {
  return Array.from({ length: count }, (_, n) => {
    const index = n + 1
    const payer = PAYERS[index % PAYERS.length]
    const provider =
      PROVIDERS[Math.floor(index / PAYERS.length) % PROVIDERS.length]
    const status = AGREEMENT_STATUSES[index % AGREEMENT_STATUSES.length]

    return {
      title: `${payer} × ${provider}`,
      meta: `${formatAmount(index)} ${status.toLowerCase()}`,
      status,
    }
  })
}

const DEMO_ROWS: Record<
  PageSlug,
  { title: string; meta: string; status: string }[]
> = {
  agreements: [
    { title: 'Acme × North Studio', meta: '£24,800 held', status: 'Held' },
    { title: 'Harbor Roofing', meta: '£8,400 funded', status: 'Funded' },
    {
      title: 'Kin & Co. retainers',
      meta: '£3,200 released',
      status: 'Released',
    },
    ...extraAgreements(100),
  ],
  parties: [
    {
      title: 'Ada Okonkwo',
      meta: 'Payer · ada@bridge.escrow',
      status: 'Payer',
    },
    {
      title: 'North Studio',
      meta: 'Provider · billing@north.studio',
      status: 'Provider',
    },
  ],
  milestones: [
    { title: 'Discovery workshop', meta: 'Due 22 Aug', status: 'Released' },
    { title: 'Brand system', meta: 'Inspection open', status: 'Held' },
    { title: 'Launch kit', meta: 'Not started', status: 'Queued' },
  ],
  releases: [
    {
      title: 'Milestone 1 — Discovery',
      meta: 'Released 4 Aug · £6,200',
      status: 'Released',
    },
    { title: 'Milestone 2 — Brand', meta: 'Awaiting payer', status: 'Held' },
  ],
  settings: [],
}

export function AppDemoPage() {
  const params = useParams({ strict: false })
  const rawPage = params.page ?? 'agreements'
  const page = isPageSlug(rawPage) ? rawPage : 'agreements'
  const intro = PAGE_INTRO[page]
  const rows = DEMO_ROWS[page]

  return (
    <AppPadding className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          {intro.title}
        </h1>
        <p className="text-sm text-muted-foreground">{intro.description}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row, index) => (
          <Card key={`${row.title}-${index}`}>
            <CardHeader>
              <CardTitle className="font-heading">{row.title}</CardTitle>
              <CardDescription>{row.meta}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{row.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppPadding>
  )
}
