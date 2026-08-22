import { AgreementStatusBadge } from '@/components/agreements/agreement-status-badge'
import { formatMoney } from '@/lib/agreement/draft'
import { catalogMilestoneRows } from '@/lib/agreement/catalog'
import type { CatalogAgreement } from '@/lib/agreement/catalog'
import { formatAgreementUpdatedAt } from '@/lib/agreement/list'

export function CatalogAgreementDetail({
  agreement,
}: {
  agreement: CatalogAgreement
}) {
  const milestones = catalogMilestoneRows(agreement)
  const milestoneLabel =
    agreement.milestoneCount === 1 ? 'milestone' : 'milestones'

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-col gap-3">
          <AgreementStatusBadge status={agreement.status} />
          <h1 className="font-serif text-3xl tracking-tight text-balance">
            {agreement.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Updated {formatAgreementUpdatedAt(agreement.updatedAt)}
          </p>
        </div>
        <p className="font-serif text-4xl tabular-nums tracking-tight sm:pt-5 sm:text-right">
          {formatMoney(agreement.totalAmount, agreement.currency)}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Payer
          </p>
          <p className="text-sm">{agreement.payer}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Provider
          </p>
          <p className="text-sm">{agreement.provider}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {agreement.milestoneCount} {milestoneLabel}
      </p>

      {milestones.length > 0 ? (
        <section className="flex flex-col gap-4 border-t pt-6">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Milestones
          </p>
          <ol className="flex flex-col">
            {milestones.map((milestone, index) => (
              <li
                key={`${milestone.title}-${index}`}
                className="flex items-baseline justify-between gap-4 border-b py-3 last:border-0"
              >
                <span className="text-sm">{milestone.title}</span>
                <span className="font-heading text-sm tabular-nums">
                  {formatMoney(milestone.amount, agreement.currency)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  )
}
