import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AgreementDraftProvider } from '@/components/agreement-wizard/use-agreement-draft'
import { AppHeader } from '@/components/shared/app-shell/app-header'
import { AppSidebar } from '@/components/shared/app-shell/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getAuthState } from '#/lib/auth/session'

export const Route = createFileRoute('/(app)/_layout')({
  beforeLoad: () => {
    const { token } = getAuthState()
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <AgreementDraftProvider>
      <TooltipProvider>
        <SidebarProvider className="sidebar-harbor">
          <AppSidebar />
          <SidebarInset className="flex max-h-svh flex-col overflow-hidden md:max-h-[calc(100svh-1rem)]">
            <AppHeader />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AgreementDraftProvider>
  )
}
