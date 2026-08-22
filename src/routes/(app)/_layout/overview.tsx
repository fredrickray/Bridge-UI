import { Link, createFileRoute } from '@tanstack/react-router'

import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { AgreementCard } from '@/components/agreements/agreement-card'
import { AgreementStatusBadge } from '@/components/agreements/agreement-status-badge'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CATALOG_AGREEMENTS } from '@/lib/agreement/catalog'
import { formatMoney } from '@/lib/agreement/draft'
import { summaryFromCreated } from '@/lib/agreement/list'
import type { AgreementSummary } from '@/lib/agreement/list'

export const Route = createFileRoute('/(app)/_layout/overview')({
  component: OverviewPage,
})

const RECENT_COUNT = 6
const ATTENTION_COUNT = 5

function sumAmount(items: readonly AgreementSummary[]) {
  return items.reduce((sum, item) => sum + item.totalAmount, 0)
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function OverviewPage() {
  const { agreements } = useAgreementDraftContext()
  const created = Object.values(agreements).map(summaryFromCreated)
  const items = [...created, ...CATALOG_AGREEMENTS].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
  const held = items.filter((item) => item.status === 'held')
  const funded = items.filter((item) => item.status === 'funded')
  const released = items.filter((item) => item.status === 'released')
  const currency = items[0]?.currency ?? 'GBP'
  const recent = items.slice(0, RECENT_COUNT)
  const attention = held.slice(0, ATTENTION_COUNT)

  return (
    <AppPadding className="flex flex-1 flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Escrow at a glance. Held funds, open agreements, and what needs you
          next.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Agreements"
          value={String(items.length)}
          hint={`${funded.length + held.length} currently in flight`}
        />
        <StatCard
          label="Held for inspection"
          value={formatMoney(sumAmount(held), currency)}
          hint={`${held.length} ${held.length === 1 ? 'agreement' : 'agreements'}`}
        />
        <StatCard
          label="Funded"
          value={formatMoney(sumAmount(funded), currency)}
          hint={`${funded.length} waiting on work`}
        />
        <StatCard
          label="Released"
          value={formatMoney(sumAmount(released), currency)}
          hint={`${released.length} completed`}
        />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-base font-medium tracking-tight">
              Needs attention
            </h2>
            <p className="text-sm text-muted-foreground">
              Funds held until evidence is accepted.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/agreements" search={{ status: 'held' }} />}
          >
            View held
          </Button>
        </div>
        {attention.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing waiting on inspection.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {attention.map((agreement) => (
              <Link
                key={agreement.id}
                to="/agreements/$agreementId"
                params={{ agreementId: agreement.id }}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-medium">
                    {agreement.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatMoney(agreement.totalAmount, agreement.currency)}
                    {agreement.currentMilestone
                      ? ` · ${agreement.currentMilestone}`
                      : null}
                  </p>
                </div>
                <AgreementStatusBadge status={agreement.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-base font-medium tracking-tight">
              Recent agreements
            </h2>
            <p className="text-sm text-muted-foreground">
              Latest updates across this workspace.
            </p>
          </div>
          <Button variant="ghost" size="sm" render={<Link to="/agreements" />}>
            View all
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}
        </div>
      </section>
    </AppPadding>
  )
}
