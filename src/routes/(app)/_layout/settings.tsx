import { createFileRoute } from '@tanstack/react-router'

import { AppPadding } from '@/components/shared/app-shell/app-padding'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/(app)/_layout/settings')({
  component: SettingsPage,
})

const SETTINGS_ROWS = [
  { title: 'Workspace', meta: 'Bridge demo', status: 'Active' },
  { title: 'Notifications', meta: 'Email + in-app', status: 'On' },
]

function SettingsPage() {
  return (
    <AppPadding className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl font-medium tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Workspace preferences. Not wired yet.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {SETTINGS_ROWS.map((row) => (
          <Card key={row.title}>
            <CardHeader>
              <CardTitle className="font-heading">{row.title}</CardTitle>
              <CardDescription>{row.meta}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{row.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppPadding>
  )
}
