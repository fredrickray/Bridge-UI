import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type AppPaddingProps = ComponentProps<'div'> & {
  hideTop?: boolean
  hideRight?: boolean
  hideBottom?: boolean
  hideLeft?: boolean
}

export function AppPadding({
  className,
  hideTop = false,
  hideRight = false,
  hideBottom = false,
  hideLeft = false,
  ...props
}: AppPaddingProps) {
  return (
    <div
      data-slot="app-padding"
      className={cn(
        !hideTop && 'pt-4',
        !hideRight && 'pr-4',
        !hideBottom && 'pb-4',
        !hideLeft && 'pl-4',
        className,
      )}
      {...props}
    />
  )
}
