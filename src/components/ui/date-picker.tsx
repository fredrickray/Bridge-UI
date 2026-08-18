"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

function parseDateValue(value: string | undefined) {
  if (!value) return undefined
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }
  return date
}

function formatDateValue(date: Date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isSelectEvent(event: Event) {
  const nodes = [event.target]
  if ("relatedTarget" in event) {
    nodes.push((event as FocusEvent).relatedTarget)
  }
  return nodes.some(
    (node) =>
      node instanceof Element &&
      node.closest("[data-slot=select-content], [data-slot=select-trigger]")
  )
}

const DEFAULT_START_MONTH = new Date(new Date().getFullYear() - 10, 0)
const DEFAULT_END_MONTH = new Date(new Date().getFullYear() + 10, 11)

function DatePicker({
  id,
  value,
  onValueChange,
  placeholder = "Pick a date",
  disabled,
  disabledDates,
  className,
  "aria-invalid": ariaInvalid,
  startMonth = DEFAULT_START_MONTH,
  endMonth = DEFAULT_END_MONTH,
}: {
  id?: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  disabledDates?: React.ComponentProps<typeof Calendar>["disabled"]
  className?: string
  "aria-invalid"?: boolean
  startMonth?: Date
  endMonth?: Date
}) {
  const [open, setOpen] = React.useState(false)
  const date = parseDateValue(value)

  return (
    <InputGroup
      className={cn(className)}
      data-disabled={disabled ? true : undefined}
    >
      <Popover
        open={open}
        onOpenChange={(next, details) => {
          // Select is portaled, so month/year interaction looks like leaving the popover.
          if (
            !next &&
            (details.reason === "outside-press" ||
              details.reason === "focus-out") &&
            isSelectEvent(details.event)
          ) {
            details.cancel()
            return
          }
          setOpen(next)
        }}
      >
        <PopoverTrigger
          disabled={disabled}
          render={
            <button
              type="button"
              id={id}
              disabled={disabled}
              aria-invalid={ariaInvalid}
              data-slot="input-group-control"
              data-empty={!date}
              className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-lg bg-transparent px-2.5 text-left text-base font-normal outline-none disabled:cursor-not-allowed data-[empty=true]:text-muted-foreground md:text-sm"
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {date ? format(date, "PPP") : placeholder}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <PopoverTitle className="sr-only">Choose a date</PopoverTitle>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => {
              onValueChange?.(next ? formatDateValue(next) : "")
              if (next) setOpen(false)
            }}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            defaultMonth={date}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
      {date ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear date"
            disabled={disabled}
            onClick={() => onValueChange?.("")}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}

export { DatePicker }
