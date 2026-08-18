import { zodResolver } from '@hookform/resolvers/zod'
import type { LucideIcon } from 'lucide-react'
import {
  ClipboardListIcon,
  FileIcon,
  FileTextIcon,
  PaperclipIcon,
  PlusIcon,
  ReceiptIcon,
  ShieldIcon,
  SignatureIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type {
  AgreementDocument,
  AgreementDraft,
  DocumentKind,
} from '@/lib/agreement/draft'
import { DOCUMENT_KINDS, documentKindLabel } from '@/lib/agreement/draft'

type DocumentsFieldsProps = {
  draft: AgreementDraft
  addDocument: (kind: DocumentKind, name: string, description: string) => void
  removeDocument: (id: string) => void
}

const DOCUMENT_KIND_IDS = DOCUMENT_KINDS.map((item) => item.id) as [
  DocumentKind,
  ...DocumentKind[],
]

const DOCUMENT_KIND_ITEMS = DOCUMENT_KINDS.map((item) => ({
  label: item.label,
  value: item.id,
}))

const DOCUMENT_KIND_ICONS: Record<DocumentKind, LucideIcon> = {
  contract: SignatureIcon,
  sow: ClipboardListIcon,
  purchase_order: ReceiptIcon,
  nda: ShieldIcon,
  specification: FileTextIcon,
  other: FileIcon,
}

const attachDocumentSchema = z.object({
  kind: z.enum(DOCUMENT_KIND_IDS, { error: 'Select a type' }),
  file: z.custom<File>((value) => value instanceof File, {
    error: 'Choose a file',
  }),
  description: z.string().optional(),
})

type AttachDocumentValues = z.infer<typeof attachDocumentSchema>

export function DocumentsFields({
  draft,
  addDocument,
  removeDocument,
}: DocumentsFieldsProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const hasDocuments = draft.documents.length > 0
  const grouped = DOCUMENT_KINDS.flatMap((kind) => {
    const items = draft.documents.filter(
      (document) => document.kind === kind.id,
    )
    if (items.length === 0) return []
    return [{ kind, items }]
  })

  return (
    <div className="flex flex-col gap-4">
      {hasDocuments ? (
        <>
          <ul className="flex flex-col gap-5">
            {grouped.map(({ kind, items }) => {
              const Icon = DOCUMENT_KIND_ICONS[kind.id]
              return (
                <li key={kind.id} className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    <Icon className="size-3.5" />
                    {kind.label}
                  </p>
                  <ul className="flex flex-col overflow-hidden rounded-xl border bg-card">
                    {items.map((document, index) => (
                      <DocumentRow
                        key={document.id}
                        document={document}
                        bordered={index > 0}
                        onRemove={() => removeDocument(document.id)}
                      />
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
          <Button
            type="button"
            variant="outline"
            className="self-start"
            onClick={() => setSheetOpen(true)}
          >
            <PlusIcon data-icon="inline-start" />
            Attach another
          </Button>
        </>
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PaperclipIcon />
            </EmptyMedia>
            <EmptyTitle>No documents yet</EmptyTitle>
            <EmptyDescription>
              Attach contracts, statements of work, and specs — not proof of
              completed work.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" onClick={() => setSheetOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Attach a document
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <AttachDocumentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        addDocument={addDocument}
      />
    </div>
  )
}

function AttachDocumentSheet({
  open,
  onOpenChange,
  addDocument,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  addDocument: DocumentsFieldsProps['addDocument']
}) {
  const form = useForm<AttachDocumentValues>({
    resolver: zodResolver(attachDocumentSchema),
    defaultValues: {
      description: '',
    },
  })
  const [fileKey, setFileKey] = useState(0)

  function clearForm() {
    form.reset({ description: '' })
    setFileKey((key) => key + 1)
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) clearForm()
  }

  function onSubmit(values: AttachDocumentValues) {
    addDocument(values.kind, values.file.name, values.description?.trim() ?? '')
    clearForm()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add a document</SheetTitle>
          <SheetDescription>
            Governing papers only — not evidence of completed work.
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 px-4">
            <Controller
              name="kind"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="attach-kind">Type</FieldLabel>
                  <Select
                    items={DOCUMENT_KIND_ITEMS}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value ?? undefined)
                    }}
                  >
                    <SelectTrigger
                      id="attach-kind"
                      className="h-10 w-full"
                      aria-invalid={fieldState.invalid || undefined}
                    >
                      <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} align="start">
                      <SelectGroup>
                        {DOCUMENT_KINDS.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="file"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="attach-file">File</FieldLabel>
                  <Input
                    key={fileKey}
                    id="attach-file"
                    type="file"
                    className="h-10"
                    aria-invalid={fieldState.invalid || undefined}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      field.onChange(event.target.files?.[0] ?? undefined)
                    }}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="attach-desc">
                Description (optional)
              </FieldLabel>
              <Textarea
                id="attach-desc"
                className="min-h-32"
                {...form.register('description')}
              />
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit">Add document</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function DocumentRow({
  document,
  onRemove,
  bordered,
}: {
  document: AgreementDocument
  onRemove: () => void
  bordered: boolean
}) {
  const Icon = DOCUMENT_KIND_ICONS[document.kind]

  return (
    <li
      className={
        bordered
          ? 'flex items-start gap-3 border-t px-3 py-3'
          : 'flex items-start gap-3 px-3 py-3'
      }
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{document.name}</p>
        {document.description ? (
          <p className="text-sm text-muted-foreground text-pretty">
            {document.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {documentKindLabel(document.kind)}
          </p>
        )}
      </div>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label="Remove document"
          >
            <Trash2Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove</TooltipContent>
      </Tooltip>
    </li>
  )
}
