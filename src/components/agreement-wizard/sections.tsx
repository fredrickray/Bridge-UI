import { BriefcaseIcon, WalletIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DatePicker } from '@/components/ui/date-picker'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  CATEGORIES,
  CURRENCIES,
  INVITATION_WINDOWS,
  currencySymbol,
  earliestStartDate,
  isStartDateInTheFuture,
  roleLabel,
} from '@/lib/agreement/draft'
import type { AgreementDraft, PartyRole } from '@/lib/agreement/draft'
import { fieldIssue, stepIssues } from '@/lib/agreement/validation'
import { cn } from '@/lib/utils'

export type DraftFieldsProps = {
  draft: AgreementDraft
  patch: (next: Partial<AgreementDraft>) => void
  showErrors?: boolean
}

const CATEGORY_ITEMS = [
  { label: 'Choose a category', value: null },
  ...CATEGORIES.map((category) => ({ label: category, value: category })),
]

const CURRENCY_ITEMS = CURRENCIES.map((currency) => ({
  label: currency,
  value: currency,
}))

export function StepIntro({ title, goal }: { title: string; goal: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-heading text-xl font-medium tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground text-pretty">{goal}</p>
    </div>
  )
}

export function RoleFields({ draft, patch, showErrors }: DraftFieldsProps) {
  const error = showErrors
    ? fieldIssue(stepIssues('role', draft), 'role')
    : undefined

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        value={draft.role ?? ''}
        onValueChange={(value) => patch({ role: value as PartyRole })}
        className="grid gap-3 sm:grid-cols-2"
        aria-invalid={Boolean(error) || undefined}
      >
        <RoleCard
          value="payer"
          selected={draft.role === 'payer'}
          title="Payer"
          description="Funds the agreement and reviews delivered work before release."
          icon={WalletIcon}
        />
        <RoleCard
          value="provider"
          selected={draft.role === 'provider'}
          title="Provider"
          description="Delivers the agreed goods or services against each milestone."
          icon={BriefcaseIcon}
        />
      </RadioGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  )
}

function RoleCard({
  value,
  selected,
  title,
  description,
  icon: Icon,
}: {
  value: PartyRole
  selected: boolean
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <FieldLabel className="cursor-pointer items-stretch has-data-checked:border-transparent has-data-checked:bg-transparent has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border-0 *:data-[slot=field]:p-4 dark:has-data-checked:border-transparent dark:has-data-checked:bg-transparent">
      <Field
        orientation="vertical"
        className={cn(
          'h-full cursor-pointer rounded-xl border bg-card',
          selected && 'border-primary',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full border [&_svg]:size-5',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-accent text-accent-foreground',
            )}
          >
            <Icon />
          </span>
          <RadioGroupItem value={value} className="sr-only" />
        </div>
        <FieldContent>
          <FieldTitle className="font-heading text-base">{title}</FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
      </Field>
    </FieldLabel>
  )
}

export function TitleField({
  draft,
  patch,
  error,
}: DraftFieldsProps & { error?: string }) {
  const invalid = Boolean(error)
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor="agreement-title">Agreement title</FieldLabel>
      <Input
        id="agreement-title"
        value={draft.title}
        onChange={(event) => patch({ title: event.target.value })}
        placeholder="Brand site rebuild"
        className="h-10"
        aria-invalid={invalid || undefined}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}

export function CategoryField({
  draft,
  patch,
  error,
}: DraftFieldsProps & { error?: string }) {
  const invalid = Boolean(error)
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor="agreement-category">Category</FieldLabel>
      <Select
        items={CATEGORY_ITEMS}
        value={draft.category || null}
        onValueChange={(value) => {
          if (value) patch({ category: value })
        }}
      >
        <SelectTrigger
          id="agreement-category"
          className="h-10 w-full"
          aria-invalid={invalid || undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          <SelectGroup>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}

export function DescriptionField({
  draft,
  patch,
  error,
}: DraftFieldsProps & { error?: string }) {
  const invalid = Boolean(error)
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor="agreement-description">Short description</FieldLabel>
      <Textarea
        id="agreement-description"
        value={draft.description}
        onChange={(event) => patch({ description: event.target.value })}
        placeholder="What this agreement covers, in a few sentences."
        aria-invalid={invalid || undefined}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  )
}

export function PartiesFields({
  draft,
  patch,
  error,
}: DraftFieldsProps & { error?: string }) {
  const yours = draft.role ? roleLabel(draft.role) : 'Your role'
  const theirs =
    draft.role === 'payer'
      ? 'Provider'
      : draft.role === 'provider'
        ? 'Payer'
        : 'Other party'
  const invalid = Boolean(error)

  return (
    <FieldSet>
      <FieldLegend>Parties</FieldLegend>
      <FieldDescription>
        {draft.role
          ? `You are the ${yours}. Invite the ${theirs} with an email.`
          : 'Choose your role first so we know who to invite.'}
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="you-party">You ({yours})</FieldLabel>
          <Input id="you-party" value="You" disabled className="h-10" />
        </Field>
        <Field
          data-disabled={!draft.role || undefined}
          data-invalid={invalid || undefined}
        >
          <FieldLabel htmlFor="counterparty">{theirs} (email)</FieldLabel>
          <Input
            id="counterparty"
            type="email"
            value={draft.counterpartyContact}
            onChange={(event) =>
              patch({ counterpartyContact: event.target.value })
            }
            placeholder="name@studio.com"
            className="h-10"
            disabled={!draft.role}
            aria-invalid={invalid || undefined}
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export function FinancialFields({
  draft,
  patch,
  errors,
}: DraftFieldsProps & { errors?: Record<string, string> }) {
  const minStartDate = earliestStartDate()
  const amountError = errors?.totalAmount
  const currencyError = errors?.currency
  const windowError = errors?.invitationWindowDays
  const startDateError =
    errors?.startDate ||
    (draft.startDate && !isStartDateInTheFuture(draft.startDate)
      ? 'Expected start date must be in the future.'
      : undefined)

  return (
    <FieldSet>
      <FieldLegend>Financial & Timeline</FieldLegend>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(currencyError) || undefined}>
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <Select
            items={CURRENCY_ITEMS}
            value={draft.currency}
            onValueChange={(value) => {
              if (value) patch({ currency: value })
            }}
          >
            <SelectTrigger
              id="currency"
              className="h-10 w-full"
              aria-invalid={Boolean(currencyError) || undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectGroup>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {currencyError ? <FieldError>{currencyError}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(amountError) || undefined}>
          <FieldLabel htmlFor="total-amount">Total amount</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <InputGroupText>{currencySymbol(draft.currency)}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="total-amount"
              type="number"
              min="0"
              inputMode="decimal"
              value={draft.totalAmount}
              onChange={(event) => patch({ totalAmount: event.target.value })}
              placeholder="0.00"
              aria-invalid={Boolean(amountError) || undefined}
            />
          </InputGroup>
          {amountError ? <FieldError>{amountError}</FieldError> : null}
        </Field>
      </div>
      <FieldGroup>
        <Field data-invalid={Boolean(startDateError) || undefined}>
          <FieldLabel htmlFor="start-date">Expected start date</FieldLabel>
          <FieldDescription>
            Optional. If set, it must be a future date.
          </FieldDescription>
          <DatePicker
            id="start-date"
            value={draft.startDate}
            onValueChange={(startDate) => patch({ startDate })}
            className="h-10"
            startMonth={minStartDate}
            disabledDates={{ before: minStartDate }}
            aria-invalid={Boolean(startDateError) || undefined}
          />
          {startDateError ? <FieldError>{startDateError}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(windowError) || undefined}>
          <FieldTitle id="invite-window-label">
            Invitation acceptance window
          </FieldTitle>
          <FieldDescription>
            How long the other party has to accept after the invite is sent.
          </FieldDescription>
          <ToggleGroup
            value={
              INVITATION_WINDOWS.includes(
                draft.invitationWindowDays as (typeof INVITATION_WINDOWS)[number],
              )
                ? [draft.invitationWindowDays]
                : []
            }
            onValueChange={(value) => {
              if (value[0]) patch({ invitationWindowDays: value[0] })
            }}
            variant="outline"
            spacing={2}
            aria-labelledby="invite-window-label"
            aria-invalid={Boolean(windowError) || undefined}
          >
            {INVITATION_WINDOWS.map((days) => (
              <ToggleGroupItem key={days} value={days}>
                {days} days
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {windowError ? <FieldError>{windowError}</FieldError> : null}
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export function DetailsFields({ draft, patch, showErrors }: DraftFieldsProps) {
  const issues = showErrors ? stepIssues('details', draft).fields : {}

  return (
    <FieldGroup>
      <TitleField draft={draft} patch={patch} error={issues.title} />
      <CategoryField draft={draft} patch={patch} error={issues.category} />
      <DescriptionField
        draft={draft}
        patch={patch}
        error={issues.description}
      />
      <PartiesFields
        draft={draft}
        patch={patch}
        error={issues.counterpartyContact}
      />
      <FinancialFields draft={draft} patch={patch} errors={issues} />
    </FieldGroup>
  )
}

export function FundingFields({ draft, patch, showErrors }: DraftFieldsProps) {
  const issues = showErrors ? stepIssues('funding', draft).fields : {}
  const strategyError = issues.fundingStrategy
  const windowError = issues.fundingWindowDays
  const inspectionError = issues.inspectionPeriodDays
  const revisionsError = issues.includedRevisions
  const revisionWindowError = issues.revisionWindowDays

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Funding</FieldLegend>
        <Field data-invalid={Boolean(strategyError) || undefined}>
          <FieldTitle id="funding-strategy-label">Funding strategy</FieldTitle>
          <FieldDescription>
            {draft.fundingStrategy === 'entire'
              ? 'The payer funds the full amount before work begins.'
              : 'The payer funds each milestone when it is ready to start.'}
          </FieldDescription>
          <ToggleGroup
            value={[draft.fundingStrategy]}
            onValueChange={(value) => {
              if (value[0])
                patch({
                  fundingStrategy:
                    value[0] as AgreementDraft['fundingStrategy'],
                })
            }}
            variant="outline"
            spacing={2}
            className="flex-wrap"
            aria-labelledby="funding-strategy-label"
            aria-invalid={Boolean(strategyError) || undefined}
          >
            <ToggleGroupItem value="entire">
              Fund entire agreement
            </ToggleGroupItem>
            <ToggleGroupItem value="per_milestone">
              Fund per milestone
            </ToggleGroupItem>
          </ToggleGroup>
          {strategyError ? <FieldError>{strategyError}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(windowError) || undefined}>
          <FieldLabel htmlFor="funding-window">Funding window</FieldLabel>
          <FieldDescription>
            Days the payer has to fund once funding is requested.
          </FieldDescription>
          <InputGroup className="h-10 max-w-xs">
            <InputGroupInput
              id="funding-window"
              type="number"
              min="1"
              value={draft.fundingWindowDays}
              onChange={(event) =>
                patch({ fundingWindowDays: event.target.value })
              }
              aria-invalid={Boolean(windowError) || undefined}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>days</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {windowError ? <FieldError>{windowError}</FieldError> : null}
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Release</FieldLegend>
        <Field>
          <FieldTitle>Release policy</FieldTitle>
          <p className="text-sm text-muted-foreground">
            Manual approval, with automatic release after the inspection period
            if no dispute is opened.
          </p>
        </Field>
        <Field data-invalid={Boolean(inspectionError) || undefined}>
          <FieldLabel htmlFor="inspection-period">Inspection period</FieldLabel>
          <FieldDescription>
            Days the payer has to review a delivered milestone before automatic
            release.
          </FieldDescription>
          <InputGroup className="h-10 max-w-xs">
            <InputGroupInput
              id="inspection-period"
              type="number"
              min="1"
              value={draft.inspectionPeriodDays}
              onChange={(event) =>
                patch({ inspectionPeriodDays: event.target.value })
              }
              aria-invalid={Boolean(inspectionError) || undefined}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>days</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {inspectionError ? <FieldError>{inspectionError}</FieldError> : null}
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Revisions</FieldLegend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(revisionsError) || undefined}>
            <FieldLabel htmlFor="included-revisions">
              Included revisions
            </FieldLabel>
            <FieldDescription>
              Revision requests allowed per milestone before accept or dispute.
            </FieldDescription>
            <Input
              id="included-revisions"
              type="number"
              min="0"
              value={draft.includedRevisions}
              onChange={(event) =>
                patch({ includedRevisions: event.target.value })
              }
              className="h-10"
              aria-invalid={Boolean(revisionsError) || undefined}
            />
            {revisionsError ? <FieldError>{revisionsError}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(revisionWindowError) || undefined}>
            <FieldLabel htmlFor="revision-window">Revision window</FieldLabel>
            <FieldDescription>
              Days the provider has to complete a revision.
            </FieldDescription>
            <InputGroup className="h-10">
              <InputGroupInput
                id="revision-window"
                type="number"
                min="1"
                value={draft.revisionWindowDays}
                onChange={(event) =>
                  patch({ revisionWindowDays: event.target.value })
                }
                aria-invalid={Boolean(revisionWindowError) || undefined}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>days</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {revisionWindowError ? (
              <FieldError>{revisionWindowError}</FieldError>
            ) : null}
          </Field>
        </div>
      </FieldSet>
    </FieldGroup>
  )
}

export function TermsFields({ draft, patch, showErrors }: DraftFieldsProps) {
  const issues = showErrors ? stepIssues('terms', draft).fields : {}
  const reviewError = issues.reviewPeriodDays
  const cancellationError = issues.cancellationPolicy
  const revisionError = issues.revisionPolicy

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(reviewError) || undefined}>
        <FieldLabel htmlFor="review-period">Review period</FieldLabel>
        <FieldDescription>
          Leave blank to use the inspection period from Funding & Release.
        </FieldDescription>
        <InputGroup className="h-10 max-w-xs">
          <InputGroupInput
            id="review-period"
            type="number"
            min="1"
            value={draft.reviewPeriodDays}
            onChange={(event) =>
              patch({ reviewPeriodDays: event.target.value })
            }
            placeholder={draft.inspectionPeriodDays || '5'}
            aria-invalid={Boolean(reviewError) || undefined}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>days</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        {reviewError ? <FieldError>{reviewError}</FieldError> : null}
      </Field>
      <Field data-invalid={Boolean(cancellationError) || undefined}>
        <FieldLabel htmlFor="cancellation-policy">
          Cancellation policy
        </FieldLabel>
        <FieldDescription>
          Example: Either party may cancel before the next milestone is funded.
          Completed milestones stay paid.
        </FieldDescription>
        <Textarea
          id="cancellation-policy"
          value={draft.cancellationPolicy}
          onChange={(event) =>
            patch({ cancellationPolicy: event.target.value })
          }
          placeholder="When and how either party may cancel, and what happens to funded milestones."
          aria-invalid={Boolean(cancellationError) || undefined}
        />
        {cancellationError ? (
          <FieldError>{cancellationError}</FieldError>
        ) : null}
      </Field>
      <Field data-invalid={Boolean(revisionError) || undefined}>
        <FieldLabel htmlFor="revision-policy">Revision policy</FieldLabel>
        <FieldDescription>
          Example: Two revision rounds per milestone. Further changes require a
          new milestone or a dispute.
        </FieldDescription>
        <Textarea
          id="revision-policy"
          value={draft.revisionPolicy}
          onChange={(event) => patch({ revisionPolicy: event.target.value })}
          placeholder="How revision requests work once the included rounds are used."
          aria-invalid={Boolean(revisionError) || undefined}
        />
        {revisionError ? <FieldError>{revisionError}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="late-delivery">
          Late delivery expectations (optional)
        </FieldLabel>
        <FieldDescription>
          Example: If a milestone slips more than 5 business days, the payer may
          pause the next funding request.
        </FieldDescription>
        <Textarea
          id="late-delivery"
          value={draft.lateDelivery}
          onChange={(event) => patch({ lateDelivery: event.target.value })}
          placeholder="Optional. What happens if a milestone is late."
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="additional-terms">Additional terms</FieldLabel>
        <FieldDescription>
          Example: The provider retains unused design exploration. The payer
          owns final delivered assets.
        </FieldDescription>
        <Textarea
          id="additional-terms"
          value={draft.additionalTerms}
          onChange={(event) => patch({ additionalTerms: event.target.value })}
          placeholder="Anything else both parties should agree to."
        />
      </Field>
    </FieldGroup>
  )
}
