import type { ReactNode } from 'react'

import {
  documentKindLabel,
  formatMoney,
  milestoneAside,
  reviewFacts,
  termRows,
} from '@/components/agreement-wizard/review-facts'
import type { ReviewFacts } from '@/components/agreement-wizard/review-facts'
import type {
  AgreementDocument,
  AgreementDraft,
  Milestone,
} from '@/lib/agreement/draft'
import { roleLabel } from '@/lib/agreement/draft'

export function ReviewSection({ draft }: { draft: AgreementDraft }) {
  const facts = reviewFacts(draft)

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-col gap-2">
          {facts.category ? (
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {facts.category}
            </p>
          ) : null}
          <h2 className="font-serif text-3xl tracking-tight text-balance">
            {facts.title}
          </h2>
          {facts.role ? (
            <p className="text-sm text-muted-foreground">
              You are the {roleLabel(facts.role)}
              {facts.other ? ` · Invite the ${roleLabel(facts.other)}` : ''}
            </p>
          ) : null}
        </div>
        <p className="font-serif text-4xl tabular-nums tracking-tight sm:pt-5 sm:text-right">
          {facts.amount ?? '—'}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <PartyBlock label="Payer" value={facts.parties.payer} />
        <PartyBlock label="Provider" value={facts.parties.provider} />
      </div>

      <p className="text-sm text-muted-foreground">{facts.chips.join(' · ')}</p>

      {facts.description ? (
        <p className="max-w-prose text-sm leading-relaxed text-pretty">
          {facts.description}
        </p>
      ) : null}

      <section className="flex flex-col gap-4 border-t pt-6">
        <SectionLabel>Milestones</SectionLabel>
        <MilestoneStack facts={facts} />
      </section>

      <section className="flex flex-col gap-4 border-t pt-6">
        <SectionLabel>Terms</SectionLabel>
        <TermsList facts={facts} />
      </section>

      {facts.documents.length > 0 ? (
        <section className="flex flex-col gap-4 border-t pt-6">
          <SectionLabel>Papers</SectionLabel>
          <ul className="flex flex-col gap-5">
            {facts.documents.map((document) => (
              <li key={document.id}>
                <PaperAnnex document={document} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}

function PaperAnnex({ document }: { document: AgreementDocument }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {documentKindLabel(document.kind)}
      </p>
      <p className="text-sm leading-relaxed text-pretty">
        {document.description.trim() || 'No note on this paper.'}
      </p>
      <p className="text-xs text-muted-foreground">{document.name}</p>
    </div>
  )
}

function PartyBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium text-pretty">{value}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </h3>
  )
}

function MilestoneStack({ facts }: { facts: ReviewFacts }) {
  if (facts.milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestones added.</p>
  }

  return (
    <ol className="flex flex-col gap-3">
      {facts.milestones.map((milestone, index) => (
        <MilestoneLine
          key={milestone.id}
          milestone={milestone}
          index={index}
          currency={facts.currency}
        />
      ))}
    </ol>
  )
}

function MilestoneLine({
  milestone,
  index,
  currency,
}: {
  milestone: Milestone
  index: number
  currency: string
}) {
  const aside = milestoneAside(milestone)

  return (
    <li className="flex flex-col gap-0.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">
          {index + 1}. {milestone.title || 'Untitled'}
        </p>
        <p className="text-sm tabular-nums">
          {milestone.amount ? formatMoney(milestone.amount, currency) : '—'}
        </p>
      </div>
      {aside ? <p className="text-xs text-muted-foreground">{aside}</p> : null}
    </li>
  )
}

function TermsList({ facts }: { facts: ReviewFacts }) {
  const rows = termRows(facts)

  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No terms yet.</p>
  }

  return (
    <dl className="flex flex-col gap-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-6"
        >
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium text-pretty sm:text-right">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
