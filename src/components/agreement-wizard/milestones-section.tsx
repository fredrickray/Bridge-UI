import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LayersIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DURATION_UNITS,
  EVIDENCE_TYPES,
  agreementTotal,
  currencySymbol,
  evidenceLabel,
  formatEstimatedDuration,
  formatMoney,
  milestoneTotal,
} from '@/lib/agreement/draft'
import type {
  AgreementDraft,
  EvidenceType,
  Milestone,
} from '@/lib/agreement/draft'
import { fieldIssue, stepIssues } from '@/lib/agreement/validation'
import { cn } from '@/lib/utils'

type MilestoneFieldsProps = {
  draft: AgreementDraft
  addMilestone: () => string
  updateMilestone: (id: string, next: Partial<Milestone>) => void
  removeMilestone: (id: string) => void
  moveMilestone: (id: string, direction: 'up' | 'down') => void
  showErrors?: boolean
}

const DURATION_UNIT_ITEMS = DURATION_UNITS.map((unit) => ({
  label: unit.label,
  value: unit.id,
}))

const EVIDENCE_TYPE_ITEMS = EVIDENCE_TYPES.map((type) => ({
  label: type.label,
  value: type.id,
}))

export function MilestonesFields({
  draft,
  addMilestone,
  updateMilestone,
  removeMilestone,
  moveMilestone,
  showErrors,
}: MilestoneFieldsProps) {
  const [openId, setOpenId] = useState<string | null>(
    draft.milestones[0]?.id ?? null,
  )
  const openedInvalid = useRef(false)
  const issues = showErrors
    ? stepIssues('milestones', draft)
    : { fields: {} as Record<string, string> }
  const allocated = milestoneTotal(draft)
  const total = agreementTotal(draft)
  const mismatch = total > 0 && allocated > 0 && allocated !== total
  const hasMilestones = draft.milestones.length > 0

  useEffect(() => {
    if (!showErrors) {
      openedInvalid.current = false
      return
    }
    if (openedInvalid.current) return
    const invalid = draft.milestones.find((milestone) =>
      Object.keys(stepIssues('milestones', draft).fields).some((key) =>
        key.startsWith(`milestones.${milestone.id}.`),
      ),
    )
    if (invalid) {
      setOpenId(invalid.id)
      openedInvalid.current = true
    }
  }, [showErrors, draft])

  function handleAdd() {
    setOpenId(addMilestone())
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Allocated {formatMoney(allocated, draft.currency)}
          {total > 0 ? (
            <>
              {' of '}
              <span className="font-medium text-foreground">
                {formatMoney(total, draft.currency)}
              </span>
            </>
          ) : null}
        </p>
        {hasMilestones ? <AddMilestoneButton onClick={handleAdd} /> : null}
      </div>

      {hasMilestones ? (
        <>
          <ul className="flex flex-col gap-3">
            {draft.milestones.map((milestone, index) => {
              const open = openId === milestone.id
              const duration = formatEstimatedDuration(
                milestone.estimatedDurationValue,
                milestone.estimatedDurationUnit,
              )
              const invalid = Object.keys(issues.fields).some((key) =>
                key.startsWith(`milestones.${milestone.id}.`),
              )
              return (
                <li key={milestone.id} className="flex items-start gap-2">
                  <div
                    className={cn(
                      'min-w-0 flex-1 overflow-hidden rounded-xl border bg-card ring-1',
                      invalid
                        ? 'border-destructive/40 ring-destructive/20'
                        : 'ring-foreground/10',
                    )}
                  >
                    <button
                      type="button"
                      className={cn(
                        'flex w-full min-w-0 cursor-pointer items-center gap-3 p-3 text-left hover:bg-muted/60',
                        open ? 'rounded-t-xl rounded-b-none' : 'rounded-xl',
                      )}
                      onClick={() => setOpenId(open ? null : milestone.id)}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-xs">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {milestone.title || 'Untitled milestone'}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {milestone.amount
                            ? formatMoney(milestone.amount, draft.currency)
                            : 'No amount'}
                          {duration ? ` · ${duration}` : ''}
                        </span>
                      </span>
                    </button>
                    <div
                      className={cn('border-t px-4 py-4', !open && 'hidden')}
                    >
                      <MilestoneEditor
                        milestone={milestone}
                        currency={draft.currency}
                        errors={issues.fields}
                        onChange={(next) => updateMilestone(milestone.id, next)}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <MilestoneIconButton
                      label="Move up"
                      icon={ArrowUpIcon}
                      disabled={index === 0}
                      onClick={() => moveMilestone(milestone.id, 'up')}
                    />
                    <MilestoneIconButton
                      label="Move down"
                      icon={ArrowDownIcon}
                      disabled={index === draft.milestones.length - 1}
                      onClick={() => moveMilestone(milestone.id, 'down')}
                    />
                    <MilestoneIconButton
                      label="Remove milestone"
                      icon={Trash2Icon}
                      variant="destructive"
                      onClick={() => removeMilestone(milestone.id)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <AddMilestoneButton onClick={handleAdd} />
        </>
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayersIcon />
            </EmptyMedia>
            <EmptyTitle>No milestones yet</EmptyTitle>
            <EmptyDescription>
              Split the work into units that can be reviewed and paid on their
              own.
            </EmptyDescription>
          </EmptyHeader>
          {showErrors && issues.form ? (
            <FieldError>{issues.form}</FieldError>
          ) : null}
          <EmptyContent>
            <Button type="button" onClick={handleAdd}>
              <PlusIcon data-icon="inline-start" />
              Add the first milestone
            </Button>
          </EmptyContent>
        </Empty>
      )}
      {mismatch ? (
        <p className="text-sm text-destructive">
          {fieldIssue(issues, 'allocated') ??
            'Milestone amounts should add up to the agreement total.'}
        </p>
      ) : null}
    </div>
  )
}

function AddMilestoneButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      <PlusIcon data-icon="inline-start" />
      Add milestone
    </Button>
  )
}

function MilestoneIconButton({
  label,
  icon: Icon,
  disabled,
  variant = 'ghost',
  onClick,
}: {
  label: string
  icon: LucideIcon
  disabled?: boolean
  variant?: 'ghost' | 'destructive'
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn('inline-flex', disabled && 'cursor-not-allowed')}
          />
        }
      >
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function MilestoneEditor({
  milestone,
  currency,
  errors,
  onChange,
}: {
  milestone: Milestone
  currency: string
  errors: Record<string, string>
  onChange: (next: Partial<Milestone>) => void
}) {
  const error = (field: string) => errors[`milestones.${milestone.id}.${field}`]
  const titleError = error('title')
  const descriptionError = error('description')
  const amountError = error('amount')
  const durationError = error('estimatedDurationValue')
  const deliverablesError = error('deliverables')
  const evidenceError = error('evidenceTypes')
  const instructionsError = error('evidenceInstructions')

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend className="data-[variant=legend]:text-lg">
          Basic
        </FieldLegend>
        <Field data-invalid={Boolean(titleError) || undefined}>
          <FieldLabel htmlFor={`ms-title-${milestone.id}`}>Title</FieldLabel>
          <Input
            id={`ms-title-${milestone.id}`}
            value={milestone.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Discovery & IA"
            className="h-10"
            aria-invalid={Boolean(titleError) || undefined}
          />
          {titleError ? <FieldError>{titleError}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(descriptionError) || undefined}>
          <FieldLabel htmlFor={`ms-desc-${milestone.id}`}>
            Description / scope
          </FieldLabel>
          <Textarea
            id={`ms-desc-${milestone.id}`}
            value={milestone.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="What this milestone covers."
            aria-invalid={Boolean(descriptionError) || undefined}
          />
          {descriptionError ? (
            <FieldError>{descriptionError}</FieldError>
          ) : null}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(amountError) || undefined}>
            <FieldLabel htmlFor={`ms-amount-${milestone.id}`}>
              Amount
            </FieldLabel>
            <InputGroup className="h-10">
              <InputGroupAddon>
                <InputGroupText>{currencySymbol(currency)}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={`ms-amount-${milestone.id}`}
                type="number"
                min="0"
                inputMode="decimal"
                value={milestone.amount}
                onChange={(event) => onChange({ amount: event.target.value })}
                placeholder="0.00"
                aria-invalid={Boolean(amountError) || undefined}
              />
            </InputGroup>
            {amountError ? <FieldError>{amountError}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(durationError) || undefined}>
            <FieldLabel htmlFor={`ms-duration-${milestone.id}`}>
              Estimated duration
            </FieldLabel>
            <InputGroup className="h-10">
              <InputGroupInput
                id={`ms-duration-${milestone.id}`}
                type="number"
                min="1"
                inputMode="numeric"
                value={milestone.estimatedDurationValue}
                onChange={(event) =>
                  onChange({ estimatedDurationValue: event.target.value })
                }
                placeholder="2"
                aria-invalid={Boolean(durationError) || undefined}
              />
              <InputGroupAddon align="inline-end" className="pr-0.5">
                <Select
                  items={DURATION_UNIT_ITEMS}
                  value={milestone.estimatedDurationUnit}
                  onValueChange={(value) => {
                    if (value) onChange({ estimatedDurationUnit: value })
                  }}
                >
                  <SelectTrigger
                    aria-label="Duration unit"
                    className="h-8 w-28 border-0 bg-transparent pl-0 shadow-none dark:bg-transparent"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} align="end">
                    <SelectGroup>
                      {DURATION_UNITS.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </InputGroupAddon>
            </InputGroup>
            {durationError ? <FieldError>{durationError}</FieldError> : null}
          </Field>
        </div>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="data-[variant=legend]:text-lg">
          Deliverables
        </FieldLegend>
        <Field data-invalid={Boolean(deliverablesError) || undefined}>
          <FieldLabel htmlFor={`ms-deliverables-${milestone.id}`}>
            Expected deliverables
          </FieldLabel>
          <Textarea
            id={`ms-deliverables-${milestone.id}`}
            value={milestone.deliverables}
            onChange={(event) => onChange({ deliverables: event.target.value })}
            placeholder="What will be handed over."
            aria-invalid={Boolean(deliverablesError) || undefined}
          />
          {deliverablesError ? (
            <FieldError>{deliverablesError}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor={`ms-notes-${milestone.id}`}>
            Completion notes (optional)
          </FieldLabel>
          <Textarea
            id={`ms-notes-${milestone.id}`}
            value={milestone.completionNotes}
            onChange={(event) =>
              onChange({ completionNotes: event.target.value })
            }
            placeholder="How completion should be demonstrated."
          />
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="data-[variant=legend]:text-lg">
          Evidence requirements
        </FieldLegend>
        <Field data-invalid={Boolean(evidenceError) || undefined}>
          <FieldLabel htmlFor={`ms-evidence-${milestone.id}`}>
            Allowed evidence types
          </FieldLabel>
          <FieldDescription>
            Proof required when this milestone is delivered.
          </FieldDescription>
          <Select
            items={EVIDENCE_TYPE_ITEMS}
            multiple
            value={milestone.evidenceTypes}
            onValueChange={(value) => onChange({ evidenceTypes: value })}
          >
            <SelectTrigger
              id={`ms-evidence-${milestone.id}`}
              className="h-10 w-full"
              aria-invalid={Boolean(evidenceError) || undefined}
            >
              <SelectValue>
                {(value: EvidenceType[]) =>
                  value.length === 0 ? (
                    <span className="text-muted-foreground">
                      Select evidence types
                    </span>
                  ) : (
                    value.map(evidenceLabel).join(', ')
                  )
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectGroup>
                {EVIDENCE_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {evidenceError ? <FieldError>{evidenceError}</FieldError> : null}
        </Field>
        <Field data-invalid={Boolean(instructionsError) || undefined}>
          <FieldLabel htmlFor={`ms-evidence-notes-${milestone.id}`}>
            Evidence instructions
          </FieldLabel>
          <Textarea
            id={`ms-evidence-notes-${milestone.id}`}
            value={milestone.evidenceInstructions}
            onChange={(event) =>
              onChange({ evidenceInstructions: event.target.value })
            }
            placeholder="How to submit proof for this milestone."
            aria-invalid={Boolean(instructionsError) || undefined}
          />
          {instructionsError ? (
            <FieldError>{instructionsError}</FieldError>
          ) : null}
        </Field>
      </FieldSet>
    </FieldGroup>
  )
}
