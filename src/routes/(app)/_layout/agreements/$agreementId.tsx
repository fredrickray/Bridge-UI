import { Link, createFileRoute } from '@tanstack/react-router'
import { FolderKanbanIcon } from 'lucide-react'

import { CatalogAgreementDetail } from '@/components/agreements/catalog-agreement-detail'
import { AgreementStatusBadge } from '@/components/agreements/agreement-status-badge'
import { ReviewSection } from '@/components/agreement-wizard/review-section'
import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getCatalogAgreement } from '@/lib/agreement/catalog'
import { summaryFromCreated } from '@/lib/agreement/list'

export const Route = createFileRoute('/(app)/_layout/agreements/$agreementId')({
  component: AgreementDetailPage,
})

function AgreementDetailPage() {
  const { agreementId } = Route.useParams()
  const { agreements } = useAgreementDraftContext()
  const created =
    agreementId in agreements ? agreements[agreementId] : undefined
  const catalog = getCatalogAgreement(agreementId)

  if (created) {
    const summary = summaryFromCreated(created)
    return (
      <AppPadding className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {created.invitedAt
              ? 'The other party has been invited to review and accept.'
              : 'Invite is pending. You can send it from this agreement later.'}
          </p>
          <AgreementStatusBadge status={summary.status} />
        </div>
        <ReviewSection draft={created.draft} />
      </AppPadding>
    )
  }

  if (catalog) {
    return (
      <AppPadding className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <CatalogAgreementDetail agreement={catalog} />
      </AppPadding>
    )
  }

  return (
    <AppPadding className="flex flex-1 flex-col">
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderKanbanIcon />
          </EmptyMedia>
          <EmptyTitle>Agreement not found</EmptyTitle>
          <EmptyDescription>
            This agreement is not available in the current session.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to="/agreements" />} nativeButton={false}>
            Back to agreements
          </Button>
        </EmptyContent>
      </Empty>
    </AppPadding>
  )
}
