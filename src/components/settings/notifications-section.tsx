import {
  BellIcon,
  LoaderCircleIcon,
  MailIcon,
  SmartphoneIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { SettingsPanel } from '@/components/settings/settings-shell'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  updateNotifications,
  type AuthUser,
  type NotificationPrefs,
} from '@/lib/auth/session'

type NotificationsSectionProps = {
  user: AuthUser
}

type PrefGroup = {
  title: string
  description: string
  icon: typeof MailIcon
  items: {
    key: keyof NotificationPrefs
    label: string
    description: string
  }[]
}

const GROUPS: PrefGroup[] = [
  {
    title: 'Email',
    description: 'Delivered to your account inbox.',
    icon: MailIcon,
    items: [
      {
        key: 'emailAgreements',
        label: 'Agreement updates',
        description: 'Invites, acceptance, and termination requests.',
      },
      {
        key: 'emailMilestones',
        label: 'Milestone activity',
        description: 'Submissions, revisions, and inspection deadlines.',
      },
      {
        key: 'emailFunding',
        label: 'Funding & releases',
        description: 'Funding windows, deposits, and releases.',
      },
    ],
  },
  {
    title: 'In-app',
    description: 'Shown in the notification bell.',
    icon: SmartphoneIcon,
    items: [
      {
        key: 'inAppAgreements',
        label: 'Agreement updates',
        description: 'Agreement events while you are signed in.',
      },
      {
        key: 'inAppMilestones',
        label: 'Milestone activity',
        description: 'Milestone and evidence events.',
      },
      {
        key: 'inAppFunding',
        label: 'Funding & releases',
        description: 'Payment and release events.',
      },
    ],
  },
]

export function NotificationsSection({ user }: NotificationsSectionProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(user.notifications)
  const [pending, setPending] = useState(false)
  const dirty = JSON.stringify(prefs) !== JSON.stringify(user.notifications)

  useEffect(() => {
    setPrefs(user.notifications)
  }, [user.notifications])

  function toggle(key: keyof NotificationPrefs, checked: boolean) {
    setPrefs((current) => ({ ...current, [key]: checked }))
  }

  async function onSave() {
    setPending(true)
    try {
      await updateNotifications(prefs)
      toast.success('Notification preferences saved')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to save preferences',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <SettingsPanel
      icon={<BellIcon />}
      title="Notification preferences"
      description="Choose which escrow events Bridge sends by email and keeps in-app."
      footer={
        <Button
          type="button"
          className="active:scale-[0.97]"
          disabled={pending || !dirty}
          onClick={onSave}
        >
          {pending ? (
            <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
          ) : null}
          Save preferences
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <group.icon className="size-3.5" />
              </span>
              <div className="flex flex-col">
                <p className="font-heading text-sm font-medium">{group.title}</p>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
              {group.items.map((item, index) => (
                <label
                  key={item.key}
                  htmlFor={item.key}
                  className={cn(
                    'flex cursor-pointer items-start justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50',
                    index > 0 && 'border-t border-border/80',
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                  <Switch
                    id={item.key}
                    checked={prefs[item.key]}
                    onCheckedChange={(checked) => toggle(item.key, checked)}
                    className="mt-0.5"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SettingsPanel>
  )
}
