import { createFileRoute, redirect } from '@tanstack/react-router'

import { AppDemoPage } from '@/components/shared/app-shell/demo-page'
import { isPageSlug } from '@/components/shared/app-shell/nav'

export const Route = createFileRoute('/(app)/_layout/$page')({
  beforeLoad: ({ params }) => {
    if (!isPageSlug(params.page)) {
      throw redirect({ to: '/$page', params: { page: 'agreements' } })
    }
  },
  component: AppDemoPage,
})
