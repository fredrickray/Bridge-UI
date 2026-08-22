import { Link, useParams, useRouterState } from '@tanstack/react-router'
import { BellIcon } from 'lucide-react'

import { useAgreementDraftContext } from '@/components/agreement-wizard/use-agreement-draft'
import { navLabelForPath } from '@/components/shared/app-shell/nav'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getCatalogAgreement } from '@/lib/agreement/catalog'

function AppBreadcrumb() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const params = useParams({ strict: false })
  const { agreements } = useAgreementDraftContext()
  const agreementId =
    typeof params.agreementId === 'string' ? params.agreementId : undefined
  const created =
    agreementId && agreementId in agreements
      ? agreements[agreementId]
      : undefined
  const catalog = agreementId ? getCatalogAgreement(agreementId) : undefined
  const agreementTitle = created?.draft.title || catalog?.name || 'Agreement'
  const currentLabel = navLabelForPath(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {agreementId ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink render={<Link to="/agreements" />}>
                Agreements
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{agreementTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" className="relative" />}
      >
        <BellIcon />
        <span className="sr-only">Notifications</span>
        <Badge className="absolute top-1 right-1 size-1.5 min-w-0 bg-held p-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuItem>
            Acme × North Studio — milestone 2 is ready for inspection.
          </DropdownMenuItem>
          <DropdownMenuItem>
            Funds for Harbor Roofing are held pending evidence.
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View all</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 md:rounded-t-xl">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-0.5" />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto"
        />
        <AppBreadcrumb />
      </div>
      <NotificationBell />
    </header>
  )
}
