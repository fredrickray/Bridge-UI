import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AGREEMENT_STATUS_LABEL,
  AGREEMENT_STATUSES,
  isAgreementStatus,
} from '@/lib/agreement/list'
import type { AgreementStatus } from '@/lib/agreement/list'

const STATUS_FILTER_ITEMS = [
  { label: 'All statuses', value: 'all' },
  ...AGREEMENT_STATUSES.map((status) => ({
    label: AGREEMENT_STATUS_LABEL[status],
    value: status,
  })),
]

export function AgreementsStatusSelect({
  id = 'agreements-status',
  value,
  onChange,
  className,
}: {
  id?: string
  value?: AgreementStatus
  onChange: (status: AgreementStatus | undefined) => void
  className?: string
}) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className="sr-only">
        Filter by status
      </FieldLabel>
      <Select
        items={STATUS_FILTER_ITEMS}
        value={value ?? 'all'}
        onValueChange={(next) => {
          onChange(isAgreementStatus(next) ? next : undefined)
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="end">
          <SelectGroup>
            {STATUS_FILTER_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
