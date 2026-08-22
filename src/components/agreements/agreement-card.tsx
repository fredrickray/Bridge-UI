import { Link } from '@tanstack/react-router'

import { AgreementStatusBadge } from '@/components/agreements/agreement-status-badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatMoney } from '@/lib/agreement/draft'
import { formatAgreementUpdatedAt, milestoneLabel } from '@/lib/agreement/list'
import type { AgreementSummary } from '@/lib/agreement/list'

export function AgreementCard({ agreement }: { agreement: AgreementSummary }) {
  return (
    <Link
      to="/agreements/$agreementId"
      params={{ agreementId: agreement.id }}
      aria-label={`Open ${agreement.name}`}
      className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        size="sm"
        className="h-full transition-colors group-hover:bg-muted/40"
      >
        <CardHeader>
          <CardTitle className="min-w-0 truncate">{agreement.name}</CardTitle>
          <CardAction>
            <AgreementStatusBadge status={agreement.status} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-heading text-sm font-medium text-foreground tabular-nums">
              {formatMoney(agreement.totalAmount, agreement.currency)}
            </span>
            {' · '}
            {agreement.milestoneCount}{' '}
            {milestoneLabel(agreement.milestoneCount)}
            {' · '}
            Updated {formatAgreementUpdatedAt(agreement.updatedAt)}
          </p>
          {agreement.currentMilestone ? (
            <CardDescription>
              Current milestone · {agreement.currentMilestone}
            </CardDescription>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
