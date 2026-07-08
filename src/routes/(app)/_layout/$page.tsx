import { createFileRoute, redirect, useParams } from '@tanstack/react-router'

import { SettingsPage } from '@/components/settings/settings-page'
import { AppDemoPage } from '@/components/shared/app-shell/demo-page'
import { isPageSlug } from '@/components/shared/app-shell/nav'

export const Route = createFileRoute('/(app)/_layout/$page')({
  beforeLoad: ({ params }) => {
    if (!isPageSlug(params.page)) {
      throw redirect({ to: '/$page', params: { page: 'agreements' } })
    }
  },
  component: AppPage,
})

function AppPage() {
  const params = useParams({ from: '/(app)/_layout/$page' })
  if (params.page === 'settings') {
    return <SettingsPage />
  }
  return <AppDemoPage />
}
