import { CheckCircle2Icon, SendIcon } from 'lucide-react'

import type {
  CreatedAgreement,
  InviteState,
} from '@/components/agreement-wizard/use-agreement-draft'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { counterpartyRole, formatMoney, roleLabel } from '@/lib/agreement/draft'

export function InviteDialog({
  open,
  agreement,
  invite,
  onSkip,
  onSend,
  onGoToAgreement,
}: {
  open: boolean
  agreement: CreatedAgreement | null
  invite: InviteState
  onSkip: () => void
  onSend: () => void
  onGoToAgreement: () => void
}) {
  const sent = invite.status === 'success'
  const recipientRole = counterpartyRole(agreement?.draft.role ?? null)

  function handleOpenChange(next: boolean) {
    if (next) return
    if (sent) onGoToAgreement()
    else onSkip()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        {sent ? (
          <>
            <DialogHeader>
              <CheckCircle2Icon className="size-8 text-primary" />
              <DialogTitle>Invitation sent</DialogTitle>
              <DialogDescription>
                {agreement?.draft.counterpartyContact} has{' '}
                {agreement?.draft.invitationWindowDays || '7'} days to review
                and accept as the {roleLabel(recipientRole)}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={onGoToAgreement}>
                Go to agreement
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invite the other party</DialogTitle>
              <DialogDescription>
                The agreement is created. Send the invite now, or skip and do it
                later from the agreement page.
              </DialogDescription>
            </DialogHeader>
            {agreement ? (
              <dl className="flex flex-col gap-3">
                <div className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">Recipient</dt>
                  <dd className="font-medium">
                    {agreement.draft.counterpartyContact || '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">Assigned role</dt>
                  <dd className="font-medium">{roleLabel(recipientRole)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">Total amount</dt>
                  <dd className="font-medium">
                    {agreement.draft.totalAmount
                      ? formatMoney(
                          agreement.draft.totalAmount,
                          agreement.draft.currency,
                        )
                      : '—'}
                  </dd>
                </div>
              </dl>
            ) : null}
            {invite.status === 'error' ? (
              <Alert variant="destructive">
                <AlertTitle>Could not send</AlertTitle>
                <AlertDescription>{invite.message}</AlertDescription>
              </Alert>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={invite.status === 'loading'}
                onClick={onSkip}
              >
                Skip and do later
              </Button>
              <Button
                type="button"
                disabled={invite.status === 'loading'}
                onClick={onSend}
              >
                {invite.status === 'loading' ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <SendIcon data-icon="inline-start" />
                )}
                Send invitation
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
