import { Link, createFileRoute } from '@tanstack/react-router'
import { FolderKanbanIcon } from 'lucide-react'

import { ReviewSection } from '@/components/agreement-wizard/review-section'
import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const Route = createFileRoute('/(app)/_layout/agreements/$agreementId')({
  component: AgreementDetailPage,
})

function AgreementDetailPage() {
  const { agreementId } = Route.useParams()
  const { agreements } = useAgreementDraftContext()
  const agreement = agreements[agreementId]

  if (!agreement) {
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
            <Button
              render={<Link to="/$page" params={{ page: 'agreements' }} />}
            >
              Back to agreements
            </Button>
          </EmptyContent>
        </Empty>
      </AppPadding>
    )
  }

  return (
    <AppPadding className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-heading text-xl font-medium tracking-tight text-balance">
            {agreement.draft.title || 'Untitled agreement'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {agreement.invitedAt
              ? 'The other party has been invited to review and accept.'
              : 'Invite is pending. You can send it from this agreement later.'}
          </p>
        </div>
        <Badge variant={agreement.invitedAt ? 'default' : 'secondary'}>
          {agreement.invitedAt ? 'Invited' : 'Invite pending'}
        </Badge>
      </div>
      <ReviewSection draft={agreement.draft} />
    </AppPadding>
  )
}
