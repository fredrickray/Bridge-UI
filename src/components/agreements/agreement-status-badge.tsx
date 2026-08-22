import { Badge } from '@/components/ui/badge'
import type { AgreementStatus } from '@/lib/agreement/list'
import { AGREEMENT_STATUS_LABEL } from '@/lib/agreement/list'

const VARIANT = {
  invite_pending: 'secondary',
  invited: 'outline',
  queued: 'ghost',
  funded: 'default',
  held: 'held',
  released: 'signal',
} as const

export function AgreementStatusBadge({ status }: { status: AgreementStatus }) {
  return (
    <Badge variant={VARIANT[status]}>{AGREEMENT_STATUS_LABEL[status]}</Badge>
  )
}
